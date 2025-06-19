import React from "react";
import Title from "./Title";
import { getLatestBlogs } from "@/lib/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import { GET_ALL_BLOGResult } from "@/sanity.types";

const LatestBlog = async () => {
  const blogs = await getLatestBlogs(4);
  const hasBlogs = Array.isArray(blogs) && blogs.length > 0;
  
  if (!hasBlogs) return null;
  
  return (
    <div className="mb-10 lg:mb-20">
      <Title>Latest Blog</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
        {blogs?.map((blog: GET_ALL_BLOGResult[number]) => (
          <Link href={`/blog/${blog?.slug?.current}`} key={blog?._id} className="rounded-lg overflow-hidden">
            <div className="relative w-full pb-[56.25%]"> {/* 16:9 aspect ratio */}
                {blog?.mainImage && (
                  <Image
                    src={urlFor(blog?.mainImage).url()}
                    alt={blog?.title || "Blog image"}
                    fill
                    className="absolute inset-0 object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                )}
              </div>
            <div className="bg-shop_light_bg p-5">
              <div className="text-xs flex items-center gap-5">
                <div className="flex items-center relative group cursor-pointer">
                  {blog?.blogcategories?.map((item, index) => (
                    <p
                      key={index}
                      className="font-semibold text-shop_dark_green tracking-wider"
                    >
                      {item?.title}
                    </p>
                  ))}
                  <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hover:cursor-pointer hoverEffect" />
                </div>
                <p className="flex items-center gap-1 text-lightColor relative group hover:cursor-pointer hover:text-shop_dark_green hoverEffect">
                  <Calendar size={15} />{" "}
                  {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
                  <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hoverEffect" />
                </p>
              </div>
              <div
                className="text-base font-semibold tracking-wide mt-5 line-clamp-2 hover:text-shop_dark_green hoverEffect"
              >
                {blog?.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatestBlog;
