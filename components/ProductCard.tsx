"use client";

import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { StarIcon } from "@sanity/icons";
import { Flame, Tag, Percent, Ruler, ShoppingBag } from "lucide-react";
import PriceView from "./PriceView";
import Title from "./Title";
import ProductSideMenu from "./ProductSideMenu";
import AddToCartButton from "./AddToCartButton";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import useStore from "@/store";

const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();
  const isAnyVariantInCart = useStore((state) => 
    state.items.some(item => item.product._id === product._id)
  );

  // Render different button based on whether product has sizes
  const renderActionButton = () => {
    if (product.hasSizes) {
      // For products with sizes, show either "View Cart" or "Select Size" button
      if (isAnyVariantInCart) {
        return (
          <Button
            onClick={() => router.push('/cart')}
            className={cn(
              "w-36 rounded-full mt-4 bg-shop_light_green text-white hover:bg-shop_dark_green transition-colors"
            )}
          >
            <ShoppingBag className="mr-2" /> View Cart
          </Button>
        );
      } else {
        return (
          <Button
            onClick={() => router.push(`/product/${product?.slug?.current}`)}
            className={cn(
              "w-36 rounded-full mt-4 bg-shop_dark_green/80 text-white hover:bg-shop_dark_green"
            )}
          >
            <Ruler className="h-4 w-4" /> Select Size
          </Button>
        );
      }
    } else {
      // For products without sizes, use the normal AddToCartButton
      return (
        <AddToCartButton product={product} className="w-36 rounded-full mt-4" />
      );
    }
  };

  return (
    <div className="text-sm border-[1px] rounded-md border-darkBlue/20 group bg-white">
      <div className="relative group overflow-hidden bg-shop_light_bg">
        {product?.images && (
          <Link href={`/product/${product?.slug?.current}`}>
            <Image
              src={urlFor(product.images[0]).url()}
              alt="productImage"
              width={500}
              height={500}
              priority
              className={`w-full h-64 object-contain overflow-hidden transition-transform bg-shop_light_bg duration-500 
              ${product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"}`}
            />
          </Link>
        )}
        <ProductSideMenu product={product} />
        
        {/* Status Indicators */}
        {product?.status === "sale" ? (
          <div className="absolute top-2 left-2 z-10 flex items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full blur-[1px] opacity-20 animate-pulse"></div>
              <div className="relative border border-red-500/70 bg-red-500/70  p-1 rounded-full group-hover:border-red-500 hover:bg-red-500/30 transition-all duration-300">
                <Percent
                  size={18}
                  className="text-white group-hover:text-white transition-colors"
                />
              </div>
            </div>
            
          </div>
        ) : product?.status === "hot" ? (
          <Link href={"/deal"} className="absolute top-2 left-2 z-10">
            <div className="rounded-full bg-shop_orange/20 border border-shop_orange/70 p-1 backdrop-blur-sm group-hover:bg-shop_orange/30 transition-all">
              <Flame size={18} className="text-shop_orange" fill="#fb6c08" />
            </div>
          </Link>
        ) : product?.status === "new" ? (
          <div className="absolute top-2 left-2 z-10">
            <div className="rounded-full bg-shop_light_green/20 border border-shop_light_green/70 p-1 backdrop-blur-sm group-hover:bg-shop_light_green/30 transition-all">
              <Tag size={18} className="text-shop_light_green" />
            </div>
          </div>
        ) : null}
        
        {/* Size indicator for products with sizes */}
        {product.hasSizes && (
          <div className="absolute top-2 right-10 z-10">
            <div className="rounded-full bg-gray-800/70 p-1 backdrop-blur-sm">
              <Ruler size={16} className="text-white" />
            </div>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1">
        <div className="flex justify-between">
        {product?.categories && (
          <p className="uppercase line-clamp-1 text-xs font-medium text-lightText">
            {product.categories.map((cat) => cat).join(", ")}
          </p>
        )}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={
                  index < 4 ? "text-shop_light_green" : " text-lightText"
                }
                fill={index < 4 ? "#93D991" : "#ababab"}
              />
            ))}
          </div>
        </div>
        </div>
        <Title className="text-sm line-clamp-1">{product?.name}</Title>
        

        {/* <div className="flex items-center gap-2.5">
          <p className="font-medium">In Stock</p>
          <p
            className={`${product?.stock === 0 ? "text-red-600" : "text-shop_dark_green/80 font-semibold"}`}
          >
            {(product?.stock as number) > 0 ? product?.stock : "unavailable"}
          </p>
        </div> */}

        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-sm"
        />
        
        {renderActionButton()}
      </div>
    </div>
  );
};

export default ProductCard;
