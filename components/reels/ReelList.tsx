"use client";

import { useState, useEffect, useRef } from "react";
import { ProductReel } from "@/types/ProductReel";
import ReelCard from "./ReelCard";
import { useRouter, usePathname } from "next/navigation";
import useStore from "@/store";
import toast from "react-hot-toast";
import ProductImageCarousel from "../ProductImageCarousel";
import { urlFor } from "@/sanity/lib/image";
import QuantityButtons from "../QuantityButtons";
import PriceView from "../PriceView";
import { client } from "@/sanity/lib/client";
import { useUser } from "@clerk/nextjs";
import AddToCartButton from "../AddToCartButton";
import FavoriteButton from "../FavoriteButton";
import { ProductSize } from "@/sanity.types";
import ReelListSkeliton from "../skeletons/ReelListSkeliton";

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
  const isScrollingRef = useRef<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const { addItem, addToFavorite, favoriteProduct, items, likedReels } = useStore();
  const { isSignedIn, user } = useUser();
  
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
  
  // Set initial product ID and scroll position based on initialSlug if provided
  useEffect(() => {
    if (initialSlug && reels.length > 0) {
      const initialReelIndex = reels.findIndex(reel => reel.product.slug.current === initialSlug);
      if (initialReelIndex !== -1) {
        setSelectedProductId(reels[initialReelIndex].product._id);
        setCurrentReelIndex(initialReelIndex);
        
        // Scroll to the initial reel without animation
        if (scrollContainerRef.current) {
          const containerHeight = scrollContainerRef.current.clientHeight;
          scrollContainerRef.current.scrollTop = initialReelIndex * containerHeight;
        }
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
        // Reset scroll position before navigation
        if (scrollContainerRef.current) {
          scrollContainerRef.current.style.overflow = 'hidden';
          window.scrollTo(0, 0);
        }
        
        // Use setTimeout to ensure scroll reset happens before navigation
        setTimeout(() => {
          router.push(`/product/${selectedReel.product.slug.current}`);
        }, 0);
      }
    } else {
      setSelectedProductId(productId);
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

    // Cleanup function to reset scroll behavior
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('touchmove', (e) => {
          e.stopPropagation();
        });
        scrollContainer.style.overflow = '';
      }
      document.body.style.overflow = '';
    };
  }, []);

  // Handle scroll position on mount and unmount
  useEffect(() => {
    // Save current scroll position
    const savedScrollPosition = window.scrollY;
    
    // Reset scroll on mount
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore scroll position and behavior on unmount
      document.body.style.overflow = '';
      if (!isMobile) {
        window.scrollTo(0, savedScrollPosition);
      }
    };
  }, [isMobile]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Avoid processing scroll events while programmatic scrolling is happening
    if (isScrollingRef.current) return;
    
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

  // Function to scroll to a specific reel
  const scrollToReel = (index: number) => {
    if (scrollContainerRef.current && index >= 0 && index < reels.length) {
      isScrollingRef.current = true;
      const containerHeight = scrollContainerRef.current.clientHeight;
      
      scrollContainerRef.current.scrollTo({
        top: index * containerHeight,
        behavior: 'smooth'
      });
      
      // Reset the scrolling flag after animation completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    }
  };


  // Sync likes with backend when component mounts
  useEffect(() => {
    const syncLikesWithBackend = async () => {
      if (!isSignedIn || !user) return;
      
      try {
        // For each reel, check if it's liked in Sanity
        const likePromises = reels.map(async (reel) => {
          const response = await fetch('/api/reel-like/check', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reelId: reel._id }),
          });
          
          if (response.ok) {
            const { liked } = await response.json();
            return { reelId: reel._id, liked };
          }
          return null;
        });
        
        const results = await Promise.all(likePromises);
        
        // Update local store with backend data
        const likedReelIds = results
          .filter(result => result && result.liked)
          .map(result => result!.reelId);
          
        if (likedReelIds.length > 0) {
          useStore.setState(state => ({
            likedReels: [...new Set([...state.likedReels, ...likedReelIds])]
          }));
        }
      } catch (error) {
        console.error("Error syncing likes with backend:", error);
      }
    };
    
    syncLikesWithBackend();
  }, [isSignedIn, user, reels]);

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* Mobile View - Full Screen Reels */}
      <div className={`w-full ${!isMobile && 'md:w-[60%]'} h-full flex items-center justify-center -my-16`}>
        <div 
          ref={scrollContainerRef}
          className="h-full w-full overflow-y-auto scrollbar-hide overscroll-y-contain snap-y snap-mandatory"
          onScroll={handleScroll}
        >
          {reels.map((reel, index) => (
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
              <div className="flex flex-col gap-4 h-1/2">
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
                    <p className="text-gray-600 text-sm mt-3">{selectedProduct.description}</p>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <FavoriteButton showProduct={true} product={selectedProduct} />
                  </div>
                </div>

                {/* Price Display with Stock Status */}
                <div className="flex items-center gap-3 mb-4">
                  <PriceView 
                    price={selectedProduct.price} 
                    discount={selectedProduct.discount}
                    className="text-2xl font-bold"
                  />
                  <span className={`px-2 py-1 rounded text-sm ${selectedProduct.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Quantity Selector - Only show for products without sizes */}
                {!selectedProduct.hasSizes && (
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <QuantityButtons product={selectedProduct} />
                  </div>
                )}

                {/* Size Selection - Only show if product has sizes */}
                {selectedProduct.hasSizes && selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes
                        .filter((size: ProductSize) => size.isEnabled)
                        .map((sizeObj: ProductSize) => {
                          const isSelected = items.some(
                            item => 
                              item.product._id === selectedProduct._id && 
                              item.size === sizeObj.size
                          );
                          
                          return (
                            <button
                              key={sizeObj._key}
                              onClick={() => {
                                // Remove existing items with this product but different size
                                const existingItem = items.find(
                                  item => item.product._id === selectedProduct._id
                                );
                                
                                if (existingItem && existingItem.size !== sizeObj.size) {
                                  useStore.getState().deleteCartProduct(selectedProduct._id, existingItem.size);
                                }
                                
                                // Add item with selected size
                                addItem(selectedProduct, sizeObj.size);
                              }}
                              className={`min-w-[48px] h-10 flex items-center justify-center rounded border text-sm font-medium ${
                                isSelected
                                  ? "border-gray-900 bg-gray-900 text-white"
                                  : "border-gray-200 text-gray-900 hover:border-gray-900"
                              }`}
                            >
                              {sizeObj.size}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-auto flex items-center gap-2">
                    <AddToCartButton product={selectedProduct} className="flex-1" />
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
            <ReelListSkeliton />
        )}
      </div>
      )}
    </div>
  );
} 