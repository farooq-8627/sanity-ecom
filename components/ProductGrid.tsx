"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import { Loader2 } from "lucide-react";
import Container from "./Container";
import HomeTabbar from "./HomeTabbar";
import { Product } from "@/sanity.types";
import { getProductVariants } from "@/lib/sanity/queries";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products: initialProducts }: ProductGridProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("");
  const [products, setProducts] = useState(initialProducts);
  
  // Updated query to match products by variant reference title
  const query = `*[_type == "product" && variant->title == $variant] | order(name asc){
    ...,"categories": categories[]->title
  }`;

  useEffect(() => {
    // Only fetch products if a tab is selected
    if (!selectedTab) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, { variant: selectedTab });
        setProducts(response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab, query]);

  return (
    <Container className="flex flex-col px-2 lg:px-0 my-10">
      <HomeTabbar selectedTab={selectedTab} onTabSelect={setSelectedTab} />
      { loading ? (
        <NoProductAvailable selectedTab={selectedTab} />
      ) : products?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-4 sm:mt-8">
          {products?.map((product) => (
            <AnimatePresence key={product?._id}>
              <motion.div
                layout
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductCard key={product?._id} product={product} />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </Container>
  );
};

export default ProductGrid;
