"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import useStore from "@/store";

/**
 * StoreInitializer component
 * Loads cart data from server when a user is logged in
 * Includes retry logic to ensure data is loaded properly
 */
export default function StoreInitializer() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { loadCartFromServer, items } = useStore();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Only load data when user is signed in and clerk has loaded
    if (isLoaded && isSignedIn) {
      console.log("StoreInitializer: Loading cart data for user", user?.id);
      
      // Load cart data with retry logic
      const loadData = async () => {
        try {
          await loadCartFromServer();
          setIsInitialized(true);
          console.log("Cart data loaded successfully");
        } catch (error) {
          console.error('Error loading cart data:', error);
          // Retry after a short delay
          setTimeout(loadData, 1000);
        }
      };
      
      loadData();
    }
  }, [isSignedIn, isLoaded, loadCartFromServer, user?.id]);
  
  // This component doesn't render anything
  return null;
} 