import React from "react";
import Title from "./Title";
import { Category } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

const HomeCategories = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="bg-white border border-shop_light_green/20 my-10 md:my-20 p-5 lg:p-7 rounded-md">
      <Title className="border-b pb-3">Popular Categories</Title>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories?.map((category) => (
          <Link 
            key={category?._id}
            href={`/category/${category?.slug?.current}`}
            className="group flex flex-col items-center"
          >
            <div className="bg-gradient-to-b from-shop_light_bg to-white rounded-xl p-3 mb-3 shadow-md hover:shadow-lg transition-all duration-300 w-full aspect-square flex items-center justify-center overflow-hidden">
              {category?.image && (
                <div className="relative w-full h-full">
                  <Image
                    src={urlFor(category?.image).url()}
                    alt={category?.title || "Category"}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
            </div>
            <h3 className="text-center font-medium text-gray-800 group-hover:text-shop_dark_green transition-colors">
              {category?.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
