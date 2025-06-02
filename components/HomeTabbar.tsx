"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getProductVariants } from "@/lib/sanity/queries";

interface ProductVariant {
  _id: string;
  title: string;
  value: string;
  description?: string;
  icon?: string;
  order?: number;
}

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadVariants() {
      try {
        const data = await getProductVariants();
        
        // Sort variants by order field if available
        const sortedVariants = data.sort((a: ProductVariant, b: ProductVariant) => {
          // If order is undefined, place at the end
          if (a.order === undefined) return 1;
          if (b.order === undefined) return -1;
          return a.order - b.order;
        });
        
        setVariants(sortedVariants);
        
        // If there are variants and no tab is selected, select the first one
        if (sortedVariants.length > 0 && !selectedTab) {
          console.log("Setting initial tab to:", sortedVariants[0].title);
          onTabSelect(sortedVariants[0].title);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }

    loadVariants();
  }, [selectedTab, onTabSelect]);

  // Fixed widths for loading placeholders to prevent hydration errors
  const placeholderWidths = [100, 120, 90, 110, 95];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center flex-wrap gap-3 sm:gap-5 justify-between">
      <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1.5 text-sm font-semibold min-w-max">
          <div className="flex items-center gap-2 md:gap-3 pb-1">
            {isLoading ? (
              // Loading placeholders with fixed widths
              placeholderWidths.map((width, index) => (
                <div 
                  key={index}
                  className="border border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full bg-gray-100 animate-pulse"
                  style={{ width: `${width}px` }}
                />
              ))
            ) : variants.length > 0 ? (
              variants.map((item) => (
                <button
                  onClick={() => onTabSelect(item.title)}
                  key={item._id}
                  className={`border border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect ${selectedTab === item.title ? "bg-shop_light_green text-white border-shop_light_green" : "bg-shop_light_green/10"}`}
                >
                  {item.title}
                </button>
              ))
            ) : (
              // Fallback to hardcoded values if no variants found
              [
                { title: "Fashion", value: "fashion" },
                { title: "Electronics", value: "electronics" },
                { title: "Home & Kitchen", value: "home-kitchen" },
                { title: "Beauty & Personal Care", value: "beauty-personal-care" },
                { title: "Sports & Outdoors", value: "sports-outdoors" },
              ].map((item) => (
                <button
                  onClick={() => onTabSelect(item.title)}
                  key={item.title}
                  className={`border border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect ${selectedTab === item.title ? "bg-shop_light_green text-white border-shop_light_green" : "bg-shop_light_green/10"}`}
                >
                  {item.title}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
      <Link
        href={"/shop"}
        className="border border-darkColor px-4 py-1 rounded-full hover:bg-shop_light_green hover:text-white hover:border-shop_light_green hoverEffect self-end sm:self-auto"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabbar;
