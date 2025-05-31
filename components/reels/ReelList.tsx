"use client";

import { useState, useEffect } from "react";
import { ProductReel } from "@/types/ProductReel";
import ReelCard from "./ReelCard";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useStore from "@/store";
import toast from "react-hot-toast";
import ProductImageCarousel from "../ProductImageCarousel";
import ReelComments from "./ReelComments";

interface ReelListProps {
  reels: ProductReel[];
}

export default function ReelList({ reels }: ReelListProps) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [pressedReelId, setPressedReelId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { addItem, addToFavorite, favoriteProduct } = useStore();

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleProductOpen = (productId: string) => {
    if (isMobile) {
      // On mobile, directly navigate to product page
      const selectedReel = reels.find(reel => reel.product._id === productId);
      if (selectedReel?.product?.slug?.current) {
        router.push(`/product/${selectedReel.product.slug.current}`);
      }
    } else {
      // On desktop, show product panel
      setSelectedProductId(productId);
    }
  };

  const selectedProduct = selectedProductId 
    ? reels.find(reel => reel.product._id === selectedProductId)?.product 
    : null;

  const handleAddToCart = (product: any) => {
    if (product.stock > 0) {
      addItem(product);
      toast.success(`${product.name.substring(0, 12)}... added successfully!`);
    } else {
      toast.error("Cannot add out of stock items");
    }
  };

  const handleAddToWishlist = async (product: any) => {
    if (product._id) {
      await addToFavorite(product);
      const isInWishlist = favoriteProduct.some(item => item._id === product._id);
      toast.success(isInWishlist ? "Product removed successfully!" : "Product added successfully!");
    }
  };

  return (
    <div className="flex w-full h-[calc(100vh-4rem)]">
      {/* Reels Section - Fixed width */}
      <div className="w-[45%] border-r border-gray-100">
        <div className="relative flex flex-col items-center gap-4 snap-y snap-mandatory overflow-y-auto h-full py-8 px-4">
          {reels.map((reel) => (
            <div 
              key={reel._id} 
              className="snap-center w-full flex justify-center"
              onMouseDown={() => setPressedReelId(reel._id)}
              onMouseUp={() => setPressedReelId(null)}
              onMouseLeave={() => setPressedReelId(null)}
              onTouchStart={() => setPressedReelId(reel._id)}
              onTouchEnd={() => setPressedReelId(null)}
            >
              <ReelCard 
                reel={reel} 
                onProductOpen={handleProductOpen}
                isPressed={pressedReelId === reel._id}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Product Details Section */}
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedProduct && (
          <div className="bg-white rounded-lg p-4">
            <div className="flex gap-4">
              {/* Left: Product Images */}
              <div className="flex-shrink-0">
                <ProductImageCarousel 
                  images={selectedProduct.images || []}
                  title={selectedProduct.name || ''}
                />
              </div>

              {/* Right: Product Details */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <h2 className="text-xl font-medium mb-1 truncate">{selectedProduct.name}</h2>
                    <p className="text-gray-600 text-sm line-clamp-2">{selectedProduct.description}</p>
                  </div>
                  <button 
                    onClick={() => handleAddToWishlist(selectedProduct)}
                    className={`p-1.5 hover:bg-gray-50 rounded-full flex-shrink-0 ${
                      favoriteProduct.some(item => item._id === selectedProduct._id)
                        ? "text-shop_light_green"
                        : ""
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill={favoriteProduct.some(item => item._id === selectedProduct._id) ? "#3b9c3c" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto flex items-center gap-2">
                  <button
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="flex-1 py-2 px-3 bg-black text-white text-sm rounded-lg hover:bg-black/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={selectedProduct.stock === 0}
                  >
                    {selectedProduct.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => selectedProduct.slug.current && router.push(`/product/${selectedProduct.slug.current}`)}
                    className="py-2 px-3 text-sm text-gray-600 hover:text-gray-900"
                  >
                    ...more details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 