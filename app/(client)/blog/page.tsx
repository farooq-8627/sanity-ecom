import Container from "@/components/Container";
import { urlFor } from "@/sanity/lib/image";
import { getAllBlogs } from "@/sanity/queries";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogPage = async () => {
  const blogs = await getAllBlogs(6);

  return (
    <div>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-5 md:mt-10">
          {blogs?.map((blog: any) => (
            <Link href={`/blog/${blog?.slug?.current}`} key={blog?._id} className="rounded-md overflow-hidden group flex flex-col h-[320px] md:h-[350px]">
              <div className="relative w-full pb-[56.25%]"> {/* 16:9 aspect ratio */}
                {blog?.mainImage && (
                  <Image
                    src={urlFor(blog?.mainImage).url()}
                    alt="blogImage"
                    fill
                    className="absolute inset-0 object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
              </div>
              <div className="bg-gray-100 p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="text-xs flex items-center gap-5">
                    <div className="flex items-center relative group cursor-pointer">
                      {blog?.blogcategories?.map((item: any, index: any) => (
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
                    className="text-base font-bold tracking-wide line-clamp-2 hover:text-shop_dark_green hoverEffect block"
                  >
                    {blog?.title}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default BlogPage;
