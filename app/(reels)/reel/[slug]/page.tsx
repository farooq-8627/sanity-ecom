import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import ReelList from "@/components/reels/ReelList";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ReelSkeleton from "@/components/skeletons/ReelSkeleton";
import { siteConfig } from "@/constants/data";

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
    hasSizes,
    sizes,
    slug {
      current
    },
    discount
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
    hasSizes,
    sizes,
    slug {
      current
    },
    discount
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
      title: "Reel Not Found | " + siteConfig.name,
      description: "The requested reel could not be found."
    };
  }
  
  // Get the product image URL if available, or use the default SVG
  const productImage = reel.product.images?.[0]?.url || siteConfig.seo.ogImage;
  
  return {
    title: `${reel.product.name} | ${siteConfig.name} Reels`,
    description: reel.product.description || "Watch this product in action and shop directly from the reel.",
    keywords: siteConfig.seo.keywords + ", video, reels, " + reel.product.name,
    openGraph: {
      title: `${reel.product.name} | ${siteConfig.name}`,
      description: reel.product.description || "Watch this product in action and shop directly from the reel.",
      images: [{
        url: productImage,
        width: 1200,
        height: 630,
        alt: reel.product.name,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${reel.product.name} | ${siteConfig.name}`,
      description: reel.product.description || "Watch this product in action and shop directly from the reel.",
      creator: siteConfig.seo.twitterHandle,
      images: [{
        url: productImage,
        width: 1200,
        height: 630,
        alt: reel.product.name,
      }],
    },
  };
}

// Component to load reel content asynchronously
async function ReelContent({ slug }: { slug: string }) {
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

  return <ReelList reels={reorderedReels} initialSlug={slug} />;
}

export default function ReelPage({ params }: { params: { slug: string } }) {
  return (
    <main className="h-full w-full">
      <Suspense fallback={<ReelSkeleton />}>
        <ReelContent slug={params.slug} />
      </Suspense>
    </main>
  );
} 