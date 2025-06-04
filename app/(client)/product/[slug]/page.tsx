import { getProductBySlug, getReelByProductSlug } from "@/sanity/queries";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Container from "@/components/Container";
import ImageView from "@/components/ImageView";
import ProductVideo from "@/components/ProductVideo";
import { Video } from "lucide-react";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import DeliveryInfo from "@/components/product/DeliveryInfo";
import ProductInteractiveSection from "@/components/product/ProductInteractiveSection";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [{ url: product.images[0].url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [product.images[0].url] : [],
    },
  };
}

// Server Component
export default async function SingleProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const productReel = await getReelByProductSlug(slug);
  
  if (!product) {
    return notFound();
  }

  const productSlug = product.slug?.current;
  if (!productSlug || !product.name) {
    return notFound();
  }

  return (
    <>
      {/* Schema.org structured data for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.images?.[0]?.url,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "INR",
              availability: product.stock > 0 ? "InStock" : "OutOfStock",
            },
          }),
        }}
      />

      <div className="bg-white py-3 md:py-2">
        <Container>
          <div className="flex flex-col gap-8">
            {/* Media Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Main Product Image */}
              <div className="md:col-span-9">
                {product.images && (
                  <ImageView images={product.images} isStock={product.stock} />
                )}
              </div>
              
              {/* Product Video - Desktop */}
              {productReel && productReel.video && (
                <div className="hidden md:block md:col-span-3">
                  <div className="h-[500px] border border-gray-100 rounded-lg overflow-hidden">
                    <ProductVideo 
                      videoUrl={productReel.video.url} 
                      className="h-full w-full object-cover"
                      productSlug={productSlug}
                      fullHeight={true}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Product Video - Mobile */}
            {productReel && productReel.video && (
              <div className="md:hidden">
                <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                  <div className="aspect-video w-full">
                    <ProductVideo 
                      videoUrl={productReel.video.url} 
                      className="w-full h-full object-cover"
                      productSlug={productSlug}
                      fullHeight={false}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="text-center text-white">
                      <Video size={32} className="mx-auto mb-2" />
                      <p className="text-sm font-medium">Watch Product Video</p>
                      <p className="text-xs opacity-80">See it in action</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Info Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Info - Left Column */}
              <div className="lg:col-span-8">
                <ProductInteractiveSection product={product} />
              </div>

              {/* Additional Info - Right Column */}
              <div className="lg:col-span-4">
                <div className="space-y-3">
                  {/* Characteristics Card */}
                  <ProductCharacteristics product={product}/>

                  {/* Delivery & Returns */}
                  <DeliveryInfo />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
