import React from "react";

const ReelListSkeliton = () => {
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex flex-col gap-4 h-1/2">
        {/* Product Images Carousel Skeleton */}
        <div className="w-full flex flex-col md:flex-row">
          {/* Thumbnails */}
          <div className="order-2 md:order-1 flex md:flex-col gap-2 md:w-20">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="flex-shrink-0 w-12 h-12 md:w-18 md:h-18 border rounded-lg bg-gray-200 animate-pulse"
              ></div>
            ))}
          </div>
          
          {/* Main Image */}
          <div className="order-1 md:order-2 flex-1">
            <div className="w-full h-[400px] border rounded-lg bg-gray-200 animate-pulse"></div>
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="flex flex-col">
          {/* Header with title and wishlist */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-20 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          </div>

          {/* Price and Stock Status */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <div 
                  key={size} 
                  className="min-w-[48px] h-10 flex items-center justify-center rounded bg-gray-200 animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto flex items-center gap-2">
            <div className="h-12 flex-1 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-12 w-24 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelListSkeliton;