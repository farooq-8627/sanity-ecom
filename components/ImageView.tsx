"use client";
import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useState } from "react";

interface Props {
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  isStock?: number | undefined;
  className?: string;
}

const ImageView = ({ images = [], isStock, className = "" }: Props) => {
  const [active, setActive] = useState(images[0]);

  return (
    <div className={`w-full flex flex-col md:flex-row gap-4 ${className}`}>
      {/* Thumbnails - Left Side */}
      <div className="order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:w-20 md:max-h-[500px]">
        {images?.map((image) => (
          <button
            key={image?._key}
            onClick={() => setActive(image)}
            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 border rounded-lg overflow-hidden ${
              active?._key === image?._key ? "border-shop_orange" : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <Image
              src={urlFor(image).url()}
              alt={`Thumbnail ${image._key}`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image - Right Side */}
      <div className="order-1 md:order-2 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={active?._key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-[500px] border border-gray-100 rounded-lg overflow-hidden"
          >
            <Image
              src={urlFor(active).url()}
              alt="productImage"
              width={800}
              height={800}
              priority
              className={`w-full h-full object-contain hover:scale-105 transition-transform duration-300 ${
                isStock === 0 ? "opacity-50" : ""
              }`}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageView;
