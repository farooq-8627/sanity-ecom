"use client";

import { useState, useEffect, useRef } from "react";
import { ProductReel } from "@/types/ProductReel";
import ReelCard from "./ReelCard";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import useStore from "@/store";
import toast from "react-hot-toast";
import ProductImageCarousel from "../ProductImageCarousel";
import ReelComments from "./ReelComments";
import { urlFor } from "@/sanity/lib/image";
import QuantityButtons from "../QuantityButtons";
import PriceView from "../PriceView";
import { client } from "@/sanity/lib/client";

interface ReelListProps {
  reels: ProductReel[];
  initialSlug?: string;
}

interface ProductImageWithUrl {
  url: string;
}

function convertSanityImagesToUrls(images: any[]): ProductImageWithUrl[] {
  return images.map(image => ({
    url: typeof image === 'string' || image.url ? (image.url || image) : urlFor(image).url()
  }));
}

export default function ReelList({ reels, initialSlug }: ReelListProps) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [pressedReelId, setPressedReelId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [globalMuted, setGlobalMuted] = useState(true);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { addItem, addToFavorite, favoriteProduct, items } = useStore();
  
  // Track which reel is currently visible
  const [visibleReelIds, setVisibleReelIds] = useState<Set<string>>(new Set());
  const lastScrollPosition = useRef(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Prevent body scrolling when on reels page
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.style.overflow = '';
    };
  }, []);
  
  // Set initial product ID based on initialSlug if provided
  useEffect(() => {
    if (initialSlug && reels.length > 0) {
      const initialReel = reels.find(reel => reel.product.slug.current === initialSlug);
      if (initialReel) {
        setSelectedProductId(initialReel.product._id);
      }
    }
  }, [initialSlug, reels]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (selectedProductId) {
        const reel = reels.find(r => r.product._id === selectedProductId);
        if (reel?.product?.slug?.current) {
          const query = `*[_type == "product" && slug.current == $slug][0]{
            ...,
            _id,
            name,
            description,
            price,
            discount,
            stock,
            variant,
            status,
            images,
            slug,
            "categories": categories[]->title
          }`;
          const product = await client.fetch(query, { 
            slug: reel.product.slug.current 
          });
          setSelectedProduct(product);
        }
      } else {
        setSelectedProduct(null);
      }
    };
    
    fetchProduct();
  }, [selectedProductId, reels]);

  const handleProductOpen = (productId: string) => {
    if (isMobile) {
      const selectedReel = reels.find(reel => reel.product._id === productId);
      if (selectedReel?.product?.slug?.current) {
        router.push(`/product/${selectedReel.product.slug.current}`);
      }
    } else {
      setSelectedProductId(productId);
    }
  };

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

  const isInCart = (productId: string): boolean => {
    return items.some(item => item.product._id === productId);
  };

  // Prevent default touch behavior to avoid page scrolling
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      e.preventDefault();
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('touchmove', (e) => {
        e.stopPropagation();
      }, { passive: false });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('touchmove', (e) => {
          e.stopPropagation();
        });
      }
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Get the scroll container and its current scroll position
    const scrollContainer = e.currentTarget;
    const scrollTop = scrollContainer.scrollTop;
    
    // Calculate the current reel index based on scroll position and container height
    const containerHeight = scrollContainer.clientHeight;
    const currentIndex = Math.round(scrollTop / containerHeight);
    
    // Only update if the index has changed
    if (currentIndex !== currentReelIndex && currentIndex >= 0 && currentIndex < reels.length) {
      setCurrentReelIndex(currentIndex);
      const currentReel = reels[currentIndex];
      
      if (currentReel?.product?.slug?.current) {
        // Update URL without full page reload
        const newUrl = `/reel/${currentReel.product.slug.current}`;
        if (pathname !== newUrl) {
          window.history.replaceState({}, '', newUrl);
          setSelectedProductId(currentReel.product._id);
        }
      }
    }
  };

  const handleToggleMute = (muted: boolean) => {
    setGlobalMuted(muted);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* Mobile View - Full Screen Reels */}
      <div className={`w-full ${!isMobile && 'md:w-[60%]'} h-full flex items-center justify-center -my-16`}>
        <div 
          ref={scrollContainerRef}
          className="h-full w-full overflow-y-auto scrollbar-hide overscroll-y-contain snap-y snap-mandatory"
          onScroll={handleScroll}
        >
          {reels.map((reel) => (
            <div 
              key={reel._id} 
              className="h-full w-full snap-start snap-always flex items-center justify-center"
              onMouseDown={() => setPressedReelId(reel._id)}
              onMouseUp={() => setPressedReelId(null)}
              onMouseLeave={() => setPressedReelId(null)}
              onTouchStart={() => setPressedReelId(reel._id)}
              onTouchEnd={() => setPressedReelId(null)}
            >
              <div className="flex items-center justify-center h-full max-w-md mx-auto px-4">
                <ReelCard 
                  reel={reel} 
                  onProductOpen={handleProductOpen}
                  isPressed={pressedReelId === reel._id}
                  globalMuted={globalMuted}
                  onToggleMute={handleToggleMute}
                />
              </div>
            </div>
          ))}
          
          {/* End of reels indicator */}
          {reels.length > 0 && (
            <div className="h-32 flex items-center justify-center text-gray-500 text-sm snap-start">
              <div className="flex flex-col items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                <p>You've seen all reels</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop View - Product Details Section */}
      {!isMobile && (
        <div className="hidden md:block md:w-[40%] p-4 overflow-y-auto border-l border-gray-100">
          {selectedProduct ? (
            <div className="bg-white rounded-lg p-4">
              <div className="flex flex-col gap-4">
                {/* Product Images */}
                <div>
                  <ProductImageCarousel 
                    images={convertSanityImagesToUrls(selectedProduct.images || [])}
                    title={selectedProduct.name || ''}
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-xl font-medium mb-1">{selectedProduct.name}</h2>
                      <p className="text-gray-600 text-sm line-clamp-2">{selectedProduct.description}</p>
                    </div>
                    <button 
                      onClick={() => handleAddToWishlist(selectedProduct)}
                      className={`p-1.5 hover:bg-gray-50 rounded-full ${
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

                  {/* Price Display */}
                  <div className="mb-4">
                    <PriceView 
                      price={selectedProduct.price} 
                      discount={selectedProduct.discount}
                      className="text-2xl font-bold"
                    />
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <QuantityButtons product={selectedProduct} />
                  </div>

                  {/* Stock Status */}
                  <div className="mb-6">
                    <span className={`px-2 py-1 rounded text-sm ${selectedProduct.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto flex items-center gap-2">
                    {isInCart(selectedProduct._id) ? (
                      <button
                        onClick={() => router.push('/cart')}
                        className="flex-1 py-2 px-3 bg-shop_light_green text-white text-sm rounded-lg hover:bg-shop_dark_green transition-colors"
                      >
                        View Cart
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(selectedProduct)}
                        className="flex-1 py-2 px-3 bg-black text-white text-sm rounded-lg hover:bg-black/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={selectedProduct.stock === 0}
                      >
                        {selectedProduct.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    )}
                    <button
                      onClick={() => selectedProduct.slug.current && router.push(`/product/${selectedProduct.slug.current}`)}
                      className="py-2 px-3 text-sm text-gray-600 hover:text-gray-900"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="text-center p-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <h3 className="text-lg font-medium mb-2">Select a product</h3>
                <p className="text-sm">Click on a product in the reels to view details</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 