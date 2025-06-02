"use client";
import { Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import useStore from "@/store";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount } = useStore();
  const { isSignedIn, isLoaded } = useUser();
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoaded || !isSignedIn) return;

    setIsCheckingAuth(true);
    
    if ((product?.stock as number) > itemCount) {
      addItem(product);
    }
    
    setIsCheckingAuth(false);
  };
  
  // Show quantity controls if item is in cart
  if (itemCount && isSignedIn) {
    return (
      <div className="text-sm w-full">
        <div className="flex items-center justify-between">
          <span className="text-xs text-darkColor/80">Quantity</span>
          <QuantityButtons product={product} />
        </div>
        <div className="flex items-center justify-between border-t pt-1">
          <span className="text-xs font-semibold">Subtotal</span>
          <PriceFormatter
            amount={product?.price ? product?.price * itemCount : 0}
          />
        </div>
      </div>
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
          <ShoppingBag /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </SignInButton>
    );
  }
  
  // Show regular add to cart button if user is authenticated
  return (
    <Button
      onClick={handleAddToCart}
      disabled={isOutOfStock || isCheckingAuth}
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
