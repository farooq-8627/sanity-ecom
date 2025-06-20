"use client";
import { Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag, Ruler } from "lucide-react";
import useStore from "@/store";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  selectedSize?: string;
  className?: string;
  disabled?: boolean;
}

const AddToCartButton = ({ product, selectedSize, className, disabled }: Props) => {
  const { addItem, getItemCount } = useStore();
  const { isSignedIn, isLoaded } = useUser();
  const itemCount = getItemCount(product?._id, selectedSize);
  const isOutOfStock = product?.stock === 0;
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoaded || !isSignedIn) return;
    
    if (product.hasSizes && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    addItem(product, selectedSize);
  };
  
  // Show view cart button if this specific item is in cart
  if (itemCount > 0 && isSignedIn) {
    return (
      <Button
        onClick={() => router.push('/cart')}
        className={cn(
          "w-full bg-shop_light_green text-white hover:bg-shop_dark_green transition-colors",
          className
        )}
      >
        <ShoppingBag className="mr-2" /> View Cart
      </Button>
    );
  }
  
  // Show sign-in button if user is not authenticated
  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button
          className={cn(
            "w-full bg-shop_dark_green/80 text-lightBg shadow-none border border-shop_dark_green/80 font-semibold tracking-wide text-white hover:bg-shop_dark_green hover:border-shop_dark_green hoverEffect",
            className
          )}
        >
          <ShoppingBag className="mr-2" /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </SignInButton>
    );
  }

  // For products with sizes but no size selected yet
  if (product.hasSizes && !selectedSize) {
    return (
      <Button
        disabled={true}
        className={cn(
          "w-full bg-shop_dark_green/80 text-lightBg shadow-none border border-shop_dark_green/80 font-semibold tracking-wide text-white hover:bg-shop_dark_green hover:border-shop_dark_green hoverEffect",
          className
        )}
      >
        <Ruler /> Select Size First
      </Button>
    );
  }
  
  // Show regular add to cart button if user is authenticated
  return (
    <Button
      onClick={handleAddToCart}
      disabled={isOutOfStock || disabled}
      className={cn(
        "w-full bg-shop_dark_green/80 text-lightBg shadow-none border border-shop_dark_green/80 font-semibold tracking-wide text-white hover:bg-shop_dark_green hover:border-shop_dark_green hoverEffect",
        className
      )}
    >
      <ShoppingBag /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
};

export default AddToCartButton;
