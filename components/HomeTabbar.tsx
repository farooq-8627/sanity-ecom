"use client";
import { productType } from "@/constants/data";
import Link from "next/link";
interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center flex-wrap gap-3 sm:gap-5 justify-between">
      <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1.5 text-sm font-semibold min-w-max">
          <div className="flex items-center gap-2 md:gap-3 pb-1">
            {productType?.map((item) => (
              <button
                onClick={() => onTabSelect(item?.title)}
                key={item?.title}
                className={`border border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect ${selectedTab === item?.title ? "bg-shop_light_green text-white border-shop_light_green" : "bg-shop_light_green/10"}`}
              >
                {item?.title}
              </button>
            ))}
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
