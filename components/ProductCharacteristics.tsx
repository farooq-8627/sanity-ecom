import { Product } from "@/sanity.types";
import React from "react";

const ProductCharacteristics = ({
  product,
}: {
  product: Product | null | undefined;
}) => {
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden mb-4">
      <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex items-center justify-between">
        <p className="text-xs font-medium text-gray-700">Characteristics</p>
        <button className="text-xs text-shop_orange hover:underline">View all</button>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Brand:</span>
          <span className="text-gray-700 font-medium">{product?.brand?.title || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Collection:</span>
          <span className="text-gray-700 font-medium">2025</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Type:</span>
          <span className="text-gray-700 font-medium capitalize">{product?.variant?.title || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Stock:</span>
          <span className="text-gray-700 font-medium">{product?.stock !== undefined ? (product.stock > 0 ? 'Available' : 'Out of Stock') : 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCharacteristics;
