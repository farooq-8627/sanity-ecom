import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import ReelList from "@/components/reels/ReelList";
import { Metadata } from "next";

// Query to get all reels with their associated products
const reelsQuery = groq`*[_type == "productReel"] {
  _id,
  video {
    "url": asset->url
  },
  product-> {
    _id,
    name,
    description,
    images[] {
      "url": asset->url
    },
    stock,
    price,
    slug {
      current
    }
  },
  likes,
  views,
  comments[] {
    _id,
    user-> {
      name,
      "image": avatar.asset->url
    },
    comment,
    _createdAt
  },
  shareCount,
  tags
} | order(_createdAt desc)`;

export const metadata: Metadata = {
  title: "Shop Reels | Discover Products in Action",
  description: "Watch short videos of our products in action and shop directly from the reels."
};

export const revalidate = 30; // Revalidate every 30 seconds

export default async function ReelsPage() {
  const reels = await client.fetch(reelsQuery);

  return (
    <main className="h-full">
      <ReelList reels={reels} />
    </main>
  );
}
