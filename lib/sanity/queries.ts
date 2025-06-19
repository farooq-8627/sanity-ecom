import { client } from "@/sanity/lib/client";

export async function getProductVariants() {
  const query = `*[_type == "productVariant"] | order(order asc) {
    _id,
    title,
    value,
    description,
    order,
    "icon": icon.asset->url
  }`;
  
  return client.fetch(query);
} 

export async function getLatestBlogs(quantity: number): Promise<any[]> {
  const query = `*[_type == "blog"] | order(publishedAt desc)[0...${quantity}]{
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    blogcategories[]->{
      _id,
      title 
    }
  }`;

  return client.fetch(query);
}