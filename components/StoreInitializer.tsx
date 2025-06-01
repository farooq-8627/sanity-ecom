"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import useStore from "@/store";

export default function StoreInitializer() {
  const { isSignedIn, isLoaded } = useUser();
  const { loadCartFromServer, loadWishlistFromServer } = useStore();
  
  useEffect(() => {
    // Only load data from server if user is signed in
    if (isLoaded && isSignedIn) {
      loadCartFromServer();
      loadWishlistFromServer();
    }
  }, [isSignedIn, isLoaded, loadCartFromServer, loadWishlistFromServer]);
  
  // This is a utility component that doesn't render anything
  return null;
} 