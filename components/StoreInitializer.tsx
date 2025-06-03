"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import useStore from "@/store";

/**
 * StoreInitializer component
 * Loads cart and wishlist data from server when a user is logged in
 */
export default function StoreInitializer() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { 
    loadCartFromServer, 
    loadWishlistFromServer,
    resetCart,
    resetFavorite
  } = useStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [prevAuthState, setPrevAuthState] = useState<boolean | null>(null);
  
  // Debug auth state
  useEffect(() => {
    console.log("StoreInitializer - Auth state:", { isSignedIn, isLoaded, userId: user?.id });
    
    // Handle logout - clear data when auth state changes from signed in to signed out
    if (prevAuthState === true && isSignedIn === false) {
      console.log("User logged out, clearing cart and wishlist data");
      resetCart();
      resetFavorite();
      setIsInitialized(false);
    }
    
    // Update previous auth state
    if (isLoaded) {
      setPrevAuthState(isSignedIn);
    }
  }, [isSignedIn, isLoaded, user, resetCart, resetFavorite, prevAuthState]);
  
  useEffect(() => {
    // Only proceed when Clerk auth state is loaded and user is signed in
    if (!isLoaded || !isSignedIn || isInitialized) return;
    
    const loadUserData = async () => {
      if (user?.id) {
        console.log("StoreInitializer: Loading data for user", user.id);
        try {
          // Load cart and wishlist data in parallel
          await Promise.all([
            loadCartFromServer(),
            loadWishlistFromServer()
          ]);
          
          console.log("User data loaded successfully");
          setIsInitialized(true);
        } catch (error) {
          console.error('Error loading user data:', error);
          // Even if there's an error, consider it initialized to avoid repeated retries
          setIsInitialized(true);
        }
      }
    };
    
    loadUserData();
  }, [isSignedIn, isLoaded, user?.id, loadCartFromServer, loadWishlistFromServer, isInitialized]);
  
  // This component doesn't render anything
  return null;
} 