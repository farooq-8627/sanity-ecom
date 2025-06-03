"use client";

import { Product } from "@/sanity.types";
import useStore from "@/store";
import React from "react";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  selectedSize?: string;
  className?: string;
}

const QuantityButtons = ({ product, selectedSize, className }: Props) => {
  const { addItem, removeItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id, selectedSize);
  const isOutOfStock = product?.stock === 0;

  const handleRemoveProduct = () => {
    if (product.hasSizes && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    
    removeItem(product?._id, selectedSize);
    // Toast is handled by the store
  };

  const handleAddToCart = () => {
    if (product.hasSizes && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    addItem(product, selectedSize);
    // Toast is handled by the store
  };

  return (
    <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
      <Button
        onClick={handleRemoveProduct}
        variant="outline"
        size="icon"
        disabled={itemCount === 0 || isOutOfStock}
        className="w-6 h-6 border-[1px] hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Minus />
      </Button>
      <span className="font-semibold text-sm w-6 text-center text-darkColor">
        {itemCount}
      </span>
      <Button
        onClick={handleAddToCart}
        variant="outline"
        size="icon"
        disabled={product.hasSizes && !selectedSize}
        className="w-6 h-6 border-[1px] hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityButtons;
