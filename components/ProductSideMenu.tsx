"use client";
import { cn } from "@/lib/utils";
import { Product } from "@/sanity.types";
import useStore from "@/store";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";

const ProductSideMenu = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const { isSignedIn, isLoaded } = useUser();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (isSignedIn) {
      const availableProduct = favoriteProduct?.find(
        (item) => item?._id === product?._id
      );
      setExistingProduct(availableProduct || null);
    } else {
      setExistingProduct(null);
    }
  }, [product, favoriteProduct, isSignedIn]);
  
  const handleFavorite = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (!isLoaded || !isSignedIn) return;
    
    setIsProcessing(true);
    
    if (product?._id) {
      try {
        toast.success(
          existingProduct
          ? "Product removed from wishlist"
          : "Product added to wishlist"
        );
        await addToFavorite(product);
      } catch (error) {
        console.error("Error handling favorite:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  const heartIcon = (
    <div
      className={`p-2.5 rounded-full hover:bg-shop_dark_green/80 hover:text-white hoverEffect ${
        existingProduct ? "bg-shop_dark_green/80 text-white" : "bg-lightColor/10"
      }`}
    >
      <Heart size={15} />
    </div>
  );
  
  return (
    <div
      className={cn("absolute top-2 right-2 hover:cursor-pointer", className)}
    >
      {!isSignedIn ? (
        <SignInButton mode="modal">
          {heartIcon}
        </SignInButton>
      ) : (
        <div 
          onClick={handleFavorite}
          className={`p-2.5 rounded-full hover:bg-shop_dark_green/80 hover:text-white hoverEffect ${
            existingProduct ? "bg-shop_dark_green/80 text-white" : "bg-lightColor/10"
          }`}
        >
          <Heart size={15} />
        </div>
      )}
    </div>
  );
};

export default ProductSideMenu;
