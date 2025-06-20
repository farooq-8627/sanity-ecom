"use client";

import { Product } from "@/sanity.types";
import FavoriteButton from "@/components/FavoriteButton";
import PriceView from "@/components/PriceView";
import ShareButton from "@/components/ShareButton";
import { StarIcon } from "lucide-react";
import React, { useState } from "react";
import QuantityButtons from "@/components/QuantityButtons";
import useStore from "@/store";
import { useUser } from "@clerk/nextjs";
import PriceFormatter from "@/components/PriceFormatter";
import AddToCartButton from "@/components/AddToCartButton";
import ColorOptions from "@/components/ColorOptions";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface ProductInteractiveSectionProps {
  product: Product & {
    colorGroup?: {
      _id: string;
      name: string;
      products: Product[];
    };
  };
  className?: string;
}

const ProductInteractiveSection = ({ product, className }: ProductInteractiveSectionProps) => {
  const { getItemCount } = useStore();
  const { isSignedIn } = useUser();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const itemCount = getItemCount(product?._id, selectedSize);
  const productSlug = product?.slug?.current;
  const sizes = product.hasSizes ? product.sizes : [];

  if (!productSlug || !product.name) {
    return null;
  }

  // Get available sizes (enabled only)
  const availableSizes = product.hasSizes && product.sizes
    ? product.sizes.filter((size) => size.isEnabled)
    : [];


  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
          <FavoriteButton showProduct={true} product={product} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                size={14}
                className="text-shop_light_green"
                fill={"#3b9c3c"}
              />
            ))}
            <span className="text-sm font-medium ml-1">{`(120)`}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ShareButton 
              title={product.name}
              description={product.description || ""}
              url={`/product/${productSlug}`}
              iconSize={16}
            />
          </div>
        </div>
      </div>

      {/* Price and Stock */}
      <div className="flex items-center gap-3">
        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-xl font-bold"
        />
        <p className={cn(
          "px-2 py-1 text-sm font-medium rounded-md",
          product.hasSizes
            ? selectedSize
              ? "text-green-600 bg-green-50"
              : "bg-yellow-100 text-yellow-800"
            : (product.stock === 0
              ? "bg-red-100 text-red-600"
              : "text-green-600 bg-green-50")
        )}>
          {product.hasSizes
            ? selectedSize
              ? "Selected Size Available"
              : "Please Select Size"
            : (product.stock as number) > 0
              ? "In Stock"
              : "Out of Stock"}
        </p>
      </div>

      {/* Description */}
      <div className="max-h-24 overflow-y-auto text-sm text-gray-600 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <p>{product?.description}</p>
      </div>

      {/* Color Options */}
      {product.colorGroup && (
        <ColorOptions
          product={product}
          colorGroup={product.colorGroup}
          className="pt-2"
        />
      )}

      {/* Size Options */}
      {product.hasSizes && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {sizes?.map(({ size, isEnabled }) => (
              <Button
                key={size}
                onClick={() => setSelectedSize(size)}
                disabled={!isEnabled}
                variant="outline"
                className={cn(
                  "h-10 px-6",
                  selectedSize === size
                    ? "border-shop_dark_green bg-shop_dark_green text-white"
                    : isEnabled
                    ? "hover:border-shop_dark_green hover:text-shop_dark_green"
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Cart Section */}
      <div className="w-full space-y-4">
        {/* Quantity Controls - Only show when item is in cart */}
        {itemCount > 0 && isSignedIn && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Quantity</span>
                <QuantityButtons product={product} selectedSize={selectedSize} />
              </div>
              <PriceFormatter
                amount={product?.price ? product?.price * itemCount : 0}
                className="text-lg font-semibold"
              />
            </div>
          </div>
        )}
        
        {/* Add to Cart Button */}
        <AddToCartButton
          product={product}
          selectedSize={selectedSize}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ProductInteractiveSection; 