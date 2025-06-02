"use client";
import { Product } from "@/sanity.types";
import useStore from "@/store";
import { Heart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const FavoriteButton = ({
  showProduct = false,
  product,
}: {
  showProduct?: boolean;
  product?: Product | null | undefined;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const { isSignedIn, isLoaded } = useUser();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Debug authentication status
  useEffect(() => {
    console.log("Auth status:", { isSignedIn, isLoaded });
  }, [isSignedIn, isLoaded]);
  
  useEffect(() => {
    if (isSignedIn) {
      const availableItem = favoriteProduct.find(
        (item) => item?._id === product?._id
      );
      setExistingProduct(availableItem || null);
    } else {
      setExistingProduct(null);
    }
  }, [product, favoriteProduct, isSignedIn]);

  const handleFavorite = async (e: React.MouseEvent<HTMLButtonElement | HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoaded || !isSignedIn) return;
    
    setIsProcessing(true);
    
    if (product?._id) {
      try {
        await addToFavorite(product);
      } catch (error) {
        console.error("Error handling favorite:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  // For the header wishlist icon
  if (!showProduct) {
    const wishlistCount = isSignedIn && favoriteProduct?.length ? favoriteProduct.length : 0;
    
    const icon = (
      <div className="relative">
        <Heart className="w-5 h-5 hover:text-shop_light_green hoverEffect" />
        <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
          {wishlistCount}
        </span>
      </div>
    );
    
    // Always use Link regardless of authentication status
    return (
      <Link href="/wishlist" className="group relative">
        {icon}
      </Link>
    );
  }
  
  // For product wishlist button when user is not signed in
  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <div className="cursor-pointer p-1.5 border border-shop_light_green/80 hover:border-shop_light_green rounded-sm group hover:text-shop_light_green hoverEffect">
          <Heart className="text-shop_light_green/80 group-hover:text-shop_light_green hoverEffect w-5 h-5" />
        </div>
      </SignInButton>
    );
  }
  
  // For product wishlist button when user is signed in
  return (
    <button
      onClick={handleFavorite}
      disabled={isProcessing}
      className="p-1.5 border border-shop_light_green/80 hover:border-shop_light_green rounded-sm group hover:text-shop_light_green hoverEffect"
    >
      {existingProduct ? (
        <Heart
          fill="#3b9c3c"
          className="text-shop_light_green/80 group-hover:text-shop_light_green hoverEffect w-5 h-5"
        />
      ) : (
        <Heart className="text-shop_light_green/80 group-hover:text-shop_light_green hoverEffect w-5 h-5" />
      )}
    </button>
  );
};

export default FavoriteButton;
