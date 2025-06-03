"use client";

import { Product } from "@/sanity.types";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import ProductVideo from "@/components/ProductVideo";
import ShareButton from "@/components/ShareButton";
import { CornerDownLeft, StarIcon, Truck, Video, Check, Info } from "lucide-react";
import React from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import QuantityButtons from "@/components/QuantityButtons";
import useStore from "@/store";
import { useUser } from "@clerk/nextjs";
import PriceFormatter from "@/components/PriceFormatter";
import AddToCartButton from "@/components/AddToCartButton";

interface ProductDetailsProps {
  product: Product;
  productReel: {
    video: {
      url: string;
    };
  } | null;
}

const ProductDetails = ({ product, productReel }: ProductDetailsProps) => {
  const productSlug = product?.slug?.current;
  if (!productSlug || !product.name) {
    return null;
  }

  return (
    <div className="bg-white py-3 md:py-2">
      <Container>
        <div className="flex flex-col gap-8">
          {/* Media Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Main Product Image */}
            <div className="md:col-span-9">
              {product?.images && (
                <ImageView images={product.images} isStock={product.stock} />
              )}
            </div>
            
            {/* Product Video - Desktop */}
            {productReel && productReel.video && (
              <div className="hidden md:block md:col-span-3">
                <div className="h-[500px] border border-gray-100 rounded-lg overflow-hidden">
                  <ProductVideo 
                    videoUrl={productReel.video.url} 
                    className="h-full w-full object-cover"
                    productSlug={productSlug}
                    fullHeight={true}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Product Video - Mobile */}
          {productReel && productReel.video && (
            <div className="md:hidden">
              <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                <div className="aspect-video w-full">
                  <ProductVideo 
                    videoUrl={productReel.video.url} 
                    className="w-full h-full object-cover"
                    productSlug={productSlug}
                    fullHeight={false}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="text-center text-white">
                    <Video size={32} className="mx-auto mb-2" />
                    <p className="text-sm font-medium">Watch Product Video</p>
                    <p className="text-xs opacity-80">See it in action</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Info - Left Column */}
            <div className="lg:col-span-8">
              <div className="flex flex-col gap-3">
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
                  <p className={`px-2 py-1 text-sm font-medium rounded-md ${
                    product?.stock === 0 ? "bg-red-100 text-red-600" : "text-green-600 bg-green-50"
                  }`}>
                    {(product?.stock as number) > 0 ? "In Stock" : "Out of Stock"}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600">
                  {product?.description}
                </p>

                {/* Cart Section */}
                <div className="w-full space-y-4">
                  {/* Quantity Controls - Only show when item is in cart */}
                  <ClientQuantitySection product={product} />
                  
                  {/* Add to Cart Button */}
                  <AddToCartButton product={product} className="w-full" />
                </div>
              </div>
            </div>

            {/* Additional Info - Right Column */}
            <div className="lg:col-span-4">
              <div className="space-y-3">
                {/* Characteristics Card */}
                <ProductCharacteristics product={product}/>

                {/* Delivery & Returns */}
                <div className="bg-gray-50/50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery & Returns</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Truck size={16} className="text-shop_orange flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Free Delivery</p>
                        <p className="text-xs text-gray-500">Enter postal code for availability</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CornerDownLeft size={16} className="text-shop_orange flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">7-Day Returns</p>
                        <p className="text-xs text-gray-500">Free returns on all orders</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-1.5 text-xs text-gray-700 py-2 px-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <FaRegQuestionCircle className="text-shop_orange" />
                    <span>Ask a question</span>
                  </button>
                  <button className="flex items-center justify-center gap-1.5 text-xs text-gray-700 py-2 px-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Info size={14} className="text-shop_orange" />
                    <span>Size guide</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

// Client Component for Quantity Controls
const ClientQuantitySection = ({ product }: { product: Product }) => {
  const { getItemCount } = useStore();
  const { isSignedIn } = useUser();
  const itemCount = getItemCount(product?._id);

  if (!itemCount || !isSignedIn) return null;

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Quantity</span>
        <QuantityButtons product={product} />
      </div>
      <div className="flex items-center justify-between border-t pt-3">
        <span className="text-sm font-medium text-gray-700">Subtotal</span>
        <PriceFormatter
          amount={product?.price ? product?.price * itemCount : 0}
          className="text-lg font-semibold"
        />
      </div>
    </div>
  );
};

export default ProductDetails; 