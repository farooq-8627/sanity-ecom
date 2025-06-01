import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { redirect } from "next/navigation";
import { Metadata } from "next";

// Query to get all reels with their associated products
const reelsQuery = groq`*[_type == "productReel"] {
  _id,
  product-> {
    slug {
      current
    }
  }
} | order(_createdAt desc)[0]`;

export const metadata: Metadata = {
  title: "Shop Reels | Discover Products in Action",
  description: "Watch short videos of our products in action and shop directly from the reels."
};

export const revalidate = 30; // Revalidate every 30 seconds

export default async function ReelsPage() {
  const firstReel = await client.fetch(reelsQuery);
  
  if (firstReel && firstReel.product?.slug?.current) {
    redirect(`/reel/${firstReel.product.slug.current}`);
  }
  
  // Fallback in case there are no reels
  return (
    <main className="h-full flex items-center justify-center">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-2">No Reels Available</h2>
        <p className="text-gray-600">Check back later for product reels.</p>
      </div>
    </main>
  );
}
