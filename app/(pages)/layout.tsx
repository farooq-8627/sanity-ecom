import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import { siteConfig } from "@/constants/data";
import StoreInitializer from "@/components/StoreInitializer";

export const metadata: Metadata = {
  title: {
    template: siteConfig.seo.titleTemplate,
    default: siteConfig.seo.title,
  },
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [{
      url: siteConfig.seo.ogImage,
      width: 1200,
      height: 630,
      alt: siteConfig.name,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    creator: siteConfig.seo.twitterHandle,
    images: [{
      url: siteConfig.seo.ogImage,
      width: 1200,
      height: 630,
      alt: siteConfig.name,
    }],
  },
};

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <StoreInitializer />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
} 