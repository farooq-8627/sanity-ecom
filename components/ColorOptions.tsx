"use client";

import { Product } from "@/sanity.types";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface Props {
  product: Product;
  colorGroup: {
    _id: string;
    name: string;
    products: Product[];
  };
  className?: string;
}

const ColorOptions = ({ product, colorGroup, className }: Props) => {
  const router = useRouter();
  
  // Filter out any variants that have the same ID as the current product
  const otherProducts = colorGroup?.products?.filter(variant => variant._id !== product._id) || [];
  const allProducts = [product, ...otherProducts];

  if (!colorGroup || allProducts.length <= 1) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-2">
        {allProducts.map((variant) => {
          // Get the first image of the variant
          const variantImage = variant.images?.[0];
          if (!variantImage) return null;

          return (
            <button
              key={variant._id}
              onClick={() => router.push(`/product/${variant.slug?.current}`)}
              className={cn(
                "relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200",
                variant._id === product._id
                  ? "border-shop_dark_green ring-2 ring-shop_dark_green ring-offset-2"
                  : "border-gray-300 hover:border-shop_dark_green"
              )}
              title={`View ${variant.name}`}
            >
              <Image
                src={urlFor(variantImage).url()}
                alt={variant.name || "Product variant"}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorOptions; 