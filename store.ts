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
  addToFavorite: (product: Product) => Promise<boolean>;
  removeFromFavorite: (productId: string) => boolean;
  resetFavorite: () => void;
  syncWishlistWithServer: () => Promise<void>;
  loadWishlistFromServer: () => Promise<void>;
  // Reel likes
  likedReels: string[];
  toggleReelLike: (reelId: string) => Promise<boolean>;
  isReelLiked: (reelId: string) => boolean;
  // Auth check
  isUserAuthenticated: () => Promise<boolean>;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],
      likedReels: [],
      isUserAuthenticated: async () => {
        try {
          // Make a request to an API endpoint that requires authentication
          const response = await fetch('/api/auth-check');
          const isAuthenticated = response.status === 200;
          console.log("Auth check result:", isAuthenticated, "Status:", response.status);
          return isAuthenticated;
        } catch (error) {
          console.error('Error checking authentication status:', error);
          return false;
        }
      },
      addItem: (product) => {
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
        });
        
        // Sync with server after updating local state
        setTimeout(() => {
          get().syncCartWithServer().then(() => {
            toast.success(`${product?.name?.substring(0, 12)}... added to cart`);
          });
        }, 0);
      },
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
      resetCart: () => {
        set({ items: [] });
        
        // Sync with server
        setTimeout(() => {
          get().syncCartWithServer();
        }, 0);
      },
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
          // Don't attempt to sync if not authenticated
          const isAuthenticated = await get().isUserAuthenticated();
          if (!isAuthenticated) {
            console.log("User not authenticated, skipping cart sync");
            return { success: false, reason: "not_authenticated" };
          }
          
          console.log("Syncing cart with server...", get().items.length, "items");
          
          const response = await fetch('/api/user-cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: get().items }),
          });
          
          if (response.status === 401) {
            console.log("User not authenticated, skipping cart sync");
            return { success: false, reason: "not_authenticated" };
          }
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
            console.error("Error syncing cart with server:", errorData);
            throw new Error(errorData.error || "Failed to sync cart");
          }
          
          const data = await response.json();
          console.log("Cart sync response:", data);
          return data;
        } catch (error) {
          console.error("Error syncing cart with server:", error);
          throw error;
        }
      },
      loadCartFromServer: async () => {
        try {
          // Don't attempt to load if not authenticated
          const isAuthenticated = await get().isUserAuthenticated();
          if (!isAuthenticated) {
            console.log("User not authenticated, skipping cart load");
            return { success: false, reason: "not_authenticated" };
          }
          
          console.log("Loading cart data from server...");
          const response = await fetch('/api/user-cart');
          
          if (response.status === 401) {
            console.log("User not authenticated, skipping cart load");
            return { success: false, reason: "not_authenticated" };
          }
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
            console.error("Error loading cart from server:", errorData);
            throw new Error(errorData.error || "Failed to load cart data");
          }
          
          const data = await response.json();
          console.log("Cart data received:", data);
          
          if (data.items && Array.isArray(data.items)) {
            // Filter out any items with missing product data
            const validItems = data.items.filter((item: CartItem) => item.product && item.product._id);
            
            if (validItems.length !== data.items.length) {
              console.warn(`Filtered out ${data.items.length - validItems.length} invalid cart items`);
            }
            
            set({ items: validItems });
            console.log("Cart updated in store with", validItems.length, "items");
            return validItems;
          } else {
            console.error("Invalid cart data format:", data);
            throw new Error("Invalid cart data format");
          }
        } catch (error) {
          console.error("Error loading cart from server:", error);
          throw error;
        }
      },
      addToFavorite: async (product: Product) => {
        // Check if user is authenticated first - but don't show toast here
        // The component will handle the auth flow with SignInButton
        const isAuthenticated = await get().isUserAuthenticated();
        console.log("addToFavorite - isAuthenticated:", isAuthenticated);
        
        if (!isAuthenticated) {
          console.log("User not authenticated, returning false");
          return false;
        }
        
        // First update local state for immediate UI feedback
        let isAdded = false;
        
        set((state: StoreState) => {
          const isFavorite = state.favoriteProduct.some(
            (item) => item._id === product._id
          );
          
          isAdded = !isFavorite;
          
          const newFavorites = isFavorite
            ? state.favoriteProduct.filter(
                (item) => item._id !== product._id
              )
            : [...state.favoriteProduct, { ...product }];
            
          return {
            favoriteProduct: newFavorites
          };
        });
        
        // Sync with server
        try {
          await get().syncWishlistWithServer();
         
          return true;
        } catch (error) {
          console.error("Error updating wishlist:", error);
          toast.error("Failed to update wishlist");
          return false;
        }
      },
      removeFromFavorite: (productId: string) => {
        // Check if user is authenticated first
        get().isUserAuthenticated().then(isAuthenticated => {
          if (!isAuthenticated) {
            return false;
          }
          
          set((state: StoreState) => ({
            favoriteProduct: state.favoriteProduct.filter(
              (item) => item?._id !== productId
            ),
          }));
          
          // Sync with server immediately
          setTimeout(() => {
            get().syncWishlistWithServer().then(() => {
              toast.success("Removed from your wishlist");
            });
          }, 0);
          
          return true;
        });
        
        return false;
      },
      resetFavorite: () => {
        set({ favoriteProduct: [] });
        
        // Sync with server
        setTimeout(() => {
          get().syncWishlistWithServer();
        }, 0);
        
      },
      syncWishlistWithServer: async () => {
        try {
          // Don't attempt to sync if not authenticated
          const isAuthenticated = await get().isUserAuthenticated();
          if (!isAuthenticated) {
            console.log("User not authenticated, skipping wishlist sync");
            return { success: false, reason: "not_authenticated" };
          }
          
          const favoriteProducts = get().favoriteProduct;
          console.log(`Syncing wishlist with server... ${favoriteProducts.length} items`);
          
          const response = await fetch('/api/user-wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: favoriteProducts }),
          });
          
          if (response.status === 401) {
            console.log("User not authenticated, skipping wishlist sync");
            return { success: false, reason: "not_authenticated" };
          }
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error syncing wishlist with server:", errorData);
            throw new Error(errorData.error || "Failed to sync wishlist");
          }
          
          const data = await response.json();
          console.log("Wishlist sync response:", data);
          return data;
        } catch (error) {
          console.error("Error syncing wishlist with server:", error);
          throw error;
        }
      },
      loadWishlistFromServer: async () => {
        try {
          // Don't attempt to load if not authenticated
          const isAuthenticated = await get().isUserAuthenticated();
          if (!isAuthenticated) {
            console.log("User not authenticated, skipping wishlist load");
            return { success: false, reason: "not_authenticated" };
          }
          
          console.log("Loading wishlist from server...");
          const response = await fetch('/api/user-wishlist');
          
          if (response.status === 401) {
            console.log("User not authenticated, skipping wishlist load");
            return { success: false, reason: "not_authenticated" };
          }
          
          if (response.ok) {
            const data = await response.json();
            console.log("Wishlist data received:", data);
            
            if (data.favoriteProduct && Array.isArray(data.favoriteProduct)) {
              set({ favoriteProduct: data.favoriteProduct });
              console.log("Wishlist updated in store with", data.favoriteProduct.length, "items");
              return data.favoriteProduct;
            } else {
              console.error("Invalid wishlist data format:", data);
              throw new Error("Invalid wishlist data format");
            }
          } else {
            const errorData = await response.json();
            console.error("Error loading wishlist from server:", errorData);
            throw new Error(errorData.error || "Failed to load wishlist data");
          }
        } catch (error) {
          console.error("Error loading wishlist from server:", error);
          throw error;
        }
      },
      // Reel likes implementation
      toggleReelLike: async (reelId: string) => {
        // Check if user is authenticated first
        const isAuthenticated = await get().isUserAuthenticated();
        if (!isAuthenticated) {
          toast.error("Please sign in to like reels");
          return false;
        }
        
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
