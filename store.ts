import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./sanity.types";
import toast from "react-hot-toast";

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

interface StoreState {
  items: CartItem[];
  addItem: (product: Product, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
  deleteCartProduct: (productId: string, size?: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (productId: string, size?: string) => number;
  getGroupedItems: () => CartItem[];
  syncCartWithServer: () => Promise<any>;
  loadCartFromServer: () => Promise<any>;
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
  // Global video mute state
  globalMuted: boolean;
  setGlobalMuted: (muted: boolean) => void;
  // Auth check
  isUserAuthenticated: () => Promise<boolean>;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],
      likedReels: [],
      globalMuted: true,
      isHydrated: false,
      setHydrated: (state: boolean) => set({ isHydrated: state }),
      setGlobalMuted: (muted: boolean) => set({ globalMuted: muted }),
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
      addItem: (product, size) => {
        // Update local state immediately for instant UI feedback
        set((state) => {
          // For products with sizes, we need to check if the same product with the same size exists
          const existingItem = state.items.find(
            (item) => 
              item.product._id === product._id && 
              (product.hasSizes ? item.size === size : true)
          );
          
          if (existingItem) {
            // Item exists, just increase quantity
            toast.success("Quantity Increased");
            return {
              items: state.items.map((item) =>
                item.product._id === product._id && 
                (product.hasSizes ? item.size === size : true)
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            // New item being added
            const sizeText = size ? ` (${size})` : '';
            toast.success(`${product?.name?.substring(0, 12)}${sizeText} added to cart`);
            return { 
              items: [...state.items, { 
                product, 
                quantity: 1, 
                size: product.hasSizes ? size : undefined 
              }] 
            };
          }
        });
        
        // Sync with server in the background
        get().syncCartWithServer().catch(error => {
          console.error("Failed to sync cart after adding item:", error);
        });
      },
      removeItem: (productId, size) => {
        // Update local state immediately for instant UI feedback
        set((state) => {
          const itemToRemove = state.items.find(
            item => item.product._id === productId && 
              (item.product.hasSizes ? item.size === size : true)
          );
          
          // If item exists and quantity is 1, it will be removed
          const willBeRemoved = itemToRemove && itemToRemove.quantity === 1;
          
          if (willBeRemoved) {
            toast.success(`${itemToRemove.product.name?.substring(0, 12)} removed`);
          } else if (itemToRemove) {
            toast.success("Quantity Decreased");
          }
          
          return {
            items: state.items.reduce((acc, item) => {
              const isSameItem = item.product._id === productId && 
                (item.product.hasSizes ? item.size === size : true);
              
              if (isSameItem) {
                if (item.quantity > 1) {
                  acc.push({ ...item, quantity: item.quantity - 1 });
                }
              } else {
                acc.push(item);
              }
              return acc;
            }, [] as CartItem[]),
          };
        });
        
        // Sync with server in the background
        get().syncCartWithServer().catch(error => {
          console.error("Failed to sync cart after removing item:", error);
        });
      },
      deleteCartProduct: (productId, size) => {
        // Update local state immediately for instant UI feedback
        set((state) => {
          const itemToDelete = state.items.find(
            item => item.product._id === productId && 
              (item.product.hasSizes ? item.size === size : true)
          );
          
          if (itemToDelete) {
            toast.success(`${itemToDelete.product.name?.substring(0, 12)} removed from cart`);
          }
          
          return {
            items: state.items.filter(
              (item) => 
                !(item.product._id === productId && 
                  (item.product.hasSizes ? item.size === size : true))
            ),
          };
        });
        
        // Sync with server in the background
        get().syncCartWithServer().catch(error => {
          console.error("Failed to sync cart after deleting product:", error);
        });
      },
      resetCart: () => {
        // Update local state immediately for instant UI feedback
        set({ items: [] });
        
        // Sync with server in the background
        get().syncCartWithServer().catch(error => {
          console.error("Failed to sync cart after reset:", error);
        });
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
      getItemCount: (productId, size) => {
        if (!productId) return 0;
        
        const item = get().items.find((item) => 
          item.product._id === productId && 
          (item.product.hasSizes ? item.size === size : true)
        );
        
        return item ? item.quantity : 0;
      },
      getGroupedItems: () => {
        // Return items with quantity directly
        return get().items;
      },
      syncCartWithServer: async () => {
        try {
          // Don't attempt to sync if not authenticated
          const isAuthenticated = await get().isUserAuthenticated();
          if (!isAuthenticated) {
            console.log("User not authenticated, skipping cart sync");
            return { success: false, reason: "not_authenticated" };
          }
          
          const items = get().items;
          console.log("Syncing cart with server...", items.length, "items");
          
          const response = await fetch('/api/user-cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({ items }),
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
          console.log("Cart sync successful:", data);
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
          const response = await fetch('/api/user-cart', {
            headers: {
              'Cache-Control': 'no-cache',
            }
          });
          
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
      onRehydrateStorage: () => (state) => {
        // Called when the store is rehydrated from localStorage
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);

export default useStore;
