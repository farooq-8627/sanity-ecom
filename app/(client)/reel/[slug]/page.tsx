import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import ReelList from "@/components/reels/ReelList";
import { Metadata } from "next";
import { notFound } from "next/navigation";

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
  tags
} | order(_createdAt desc)`;

// Query to get a specific reel by product slug
const reelBySlugQuery = groq`*[_type == "productReel" && product->slug.current == $slug][0] {
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
  tags
}`;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Properly await the params object before accessing its properties
  const { slug } = await params;
  
  const reel = await client.fetch(reelBySlugQuery, { slug });
  
  if (!reel) {
    return {
      title: "Reel Not Found",
      description: "The requested reel could not be found."
    };
  }
  
  return {
    title: `${reel.product.name} | Shop Reels`,
    description: reel.product.description || "Watch this product in action and shop directly from the reel."
  };
}

export default async function ReelPage({ params }: { params: { slug: string } }) {
  // Properly await the params object before accessing its properties
  const { slug } = await params;
  
  const allReels = await client.fetch(reelsQuery);
  const currentReel = await client.fetch(reelBySlugQuery, { slug });
  
  if (!currentReel) {
    notFound();
  }
  
  // Find the index of the current reel in all reels
  const currentReelIndex = allReels.findIndex(
    (reel: any) => reel.product.slug.current === slug
  );
  
  if (currentReelIndex === -1) {
    notFound();
  }
  
  // Reorder the reels to start with the current one
  const reorderedReels = [
    ...allReels.slice(currentReelIndex),
    ...allReels.slice(0, currentReelIndex)
  ];

  return (
    <main className="h-full w-full">
      <ReelList reels={reorderedReels} initialSlug={slug} />
    </main>
  );
} 