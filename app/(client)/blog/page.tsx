import Container from "@/components/Container";
import Title from "@/components/Title";
import { urlFor } from "@/sanity/lib/image";
import { getAllBlogs } from "@/sanity/queries";
import { GET_ALL_BLOGResult } from "@/sanity.types";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogPage = async () => {
  const blogs = await getAllBlogs(6);
  const hasBlogs = Array.isArray(blogs) && blogs.length > 0;

  return (
    <div>
      <Container>
        {hasBlogs && <Title>Blog page</Title>}
        {hasBlogs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 md:mt-10">
            {blogs?.map((blog: GET_ALL_BLOGResult[number]) => (
              <div key={blog?._id} className="rounded-md overflow-hidden group">
                {blog?.mainImage && (
                  <Image
                    src={urlFor(blog?.mainImage).url()}
                    alt="blogImage"
                    width={500}
                    height={500}
                    className="w-full max-h-80 object-cover"
                  />
                )}
                <div className="bg-gray-100 p-5">
                  <div className="text-xs flex items-center gap-5">
                    <div className="flex items-center relative group cursor-pointer">
                      {blog?.blogcategories?.map((item: { title: string | null }, index: number) => (
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
                  <Link
                    href={`/blog/${blog?.slug?.current}`}
                    className="text-base font-bold tracking-wide mt-5 line-clamp-2 hover:text-shop_dark_green hoverEffect"
                  >
                    {blog?.title}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-gray-100">
              <div className="mb-6 bg-gray-50 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-shop_dark_green">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">No Blog Posts Yet</h3>
              <p className="text-gray-500 mb-6">We're working on creating amazing content for you. Check back soon for our latest articles and updates.</p>
              <Link href="/" className="inline-flex items-center justify-center px-5 py-2 bg-shop_dark_green text-white rounded-lg hover:bg-shop_dark_green/90 transition-colors">
                <span>Back to Home</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default BlogPage;
