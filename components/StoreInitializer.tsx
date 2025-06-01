"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import useStore from "@/store";

/**
 * StoreInitializer component
 * Loads cart data from server when a user is logged in
 * Note: Wishlist data is now handled by UserWishlistInitializer
 */
export default function StoreInitializer() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { loadCartFromServer } = useStore();
  
  useEffect(() => {
    // Only load data when user is signed in and clerk has loaded
    if (isLoaded && isSignedIn) {
      console.log("StoreInitializer: Loading cart data for user", user?.id);
      
      // Load cart data
      loadCartFromServer().catch(error => {
        console.error('Error loading cart data:', error);
      });
    }
  }, [isSignedIn, isLoaded, loadCartFromServer, user?.id]);
  
  // This component doesn't render anything
  return null;
} 