import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./sanity.types";
import toast from "react-hot-toast";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => CartItem[];
  syncCartWithServer: () => Promise<void>;
  loadCartFromServer: () => Promise<void>;
  //   // favorite
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
  syncWishlistWithServer: () => Promise<void>;
  loadWishlistFromServer: () => Promise<void>;
  // Reel likes
  likedReels: string[];
  toggleReelLike: (reelId: string) => Promise<boolean>;
  isReelLiked: (reelId: string) => boolean;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],
      likedReels: [],
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product._id === product._id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return { items: [...state.items, { product, quantity: 1 }] };
          }
        }),
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product._id === productId) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as CartItem[]),
        }));
        
        // Sync with server after updating local state
        setTimeout(() => {
          get().syncCartWithServer();
        }, 0);
      },
      deleteCartProduct: (productId) => {
        set((state) => ({
          items: state.items.filter(
            ({ product }) => product?._id !== productId
          ),
        }));
        
        // Sync with server after updating local state
        setTimeout(() => {
          get().syncCartWithServer();
        }, 0);
      },
      resetCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0
        );
      },
      getSubTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.price ?? 0;
          const discount = ((item.product.discount ?? 0) * price) / 100;
          const discountedPrice = price + discount;
          return total + discountedPrice * item.quantity;
        }, 0);
      },
      getItemCount: (productId) => {
        const item = get().items.find((item) => item.product._id === productId);
        return item ? item.quantity : 0;
      },
      getGroupedItems: () => get().items,
      syncCartWithServer: async () => {
        try {
          const response = await fetch('/api/user-cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: get().items }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error syncing cart with server:", errorData);
          }
        } catch (error) {
          console.error("Error syncing cart with server:", error);
        }
      },
      loadCartFromServer: async () => {
        try {
          const response = await fetch('/api/user-cart');
          
          if (response.ok) {
            const data = await response.json();
            if (data.items && Array.isArray(data.items)) {
              set({ items: data.items });
            }
          } else {
            console.error("Error loading cart from server:", await response.json());
          }
        } catch (error) {
          console.error("Error loading cart from server:", error);
        }
      },
      addToFavorite: (product: Product) => {
        return new Promise<void>((resolve) => {
          set((state: StoreState) => {
            const isFavorite = state.favoriteProduct.some(
              (item) => item._id === product._id
            );
            
            const newFavorites = isFavorite
              ? state.favoriteProduct.filter(
                  (item) => item._id !== product._id
                )
              : [...state.favoriteProduct, { ...product }];
              
            // Update local state
            return {
              favoriteProduct: newFavorites
            };
          });
          
          // Sync with server
          get().syncWishlistWithServer();
          
          resolve();
        });
      },
      removeFromFavorite: (productId: string) => {
        set((state: StoreState) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (item) => item?._id !== productId
          ),
        }));
        
        // Sync with server immediately
        setTimeout(() => {
          get().syncWishlistWithServer();
        }, 0);
      },
      resetFavorite: () => {
        set({ favoriteProduct: [] });
        
        // Sync with server
        get().syncWishlistWithServer();
      },
      syncWishlistWithServer: async () => {
        try {
          const response = await fetch('/api/user-wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ products: get().favoriteProduct }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error syncing wishlist with server:", errorData);
          }
        } catch (error) {
          console.error("Error syncing wishlist with server:", error);
        }
      },
      loadWishlistFromServer: async () => {
        try {
          const response = await fetch('/api/user-wishlist');
          
          if (response.ok) {
            const data = await response.json();
            if (data.products && Array.isArray(data.products)) {
              set({ favoriteProduct: data.products });
            }
          } else {
            console.error("Error loading wishlist from server:", await response.json());
          }
        } catch (error) {
          console.error("Error loading wishlist from server:", error);
        }
      },
      // Reel likes implementation
      toggleReelLike: async (reelId: string) => {
        // First update local state for immediate UI feedback
        let isNowLiked = false;
        set((state) => {
          const isCurrentlyLiked = state.likedReels.includes(reelId);
          isNowLiked = !isCurrentlyLiked;
          
          return {
            likedReels: isCurrentlyLiked
              ? state.likedReels.filter(id => id !== reelId)
              : [...state.likedReels, reelId]
          };
        });
        
        try {
          // Then update the backend
          const response = await fetch('/api/reel-like', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reelId }),
          });
          
          if (!response.ok) {
            // If backend update fails, revert the local state
            set((state) => ({
              likedReels: isNowLiked
                ? state.likedReels.filter(id => id !== reelId)
                : [...state.likedReels, reelId]
            }));
            
            // Parse error details
            const errorData = await response.json();
            if (errorData && errorData.error) {
              throw new Error(errorData.error);
            }
            
            return false;
          }
          
          // Show success message only when liking (not unliking)
          if (isNowLiked) {
            toast.success("Added to your likes");
          } else {
            toast.success("Removed from your likes");
          }
          
          return true;
        } catch (error) {
          console.error("Error toggling reel like:", error);
          // Revert local state on error
          set((state) => ({
            likedReels: isNowLiked
              ? state.likedReels.filter(id => id !== reelId)
              : [...state.likedReels, reelId]
          }));
          throw error; // Re-throw to allow component to handle it
        }
      },
      isReelLiked: (reelId: string) => {
        return get().likedReels.includes(reelId);
      },
    }),
    {
      name: "cart-store",
    }
  )
);

export default useStore;
