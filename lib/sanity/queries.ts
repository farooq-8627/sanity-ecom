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