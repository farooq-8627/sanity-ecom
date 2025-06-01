import Image from 'next/image';
import { urlFor } from "@/sanity/lib/image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface SanityImageProps {
  image: SanityImageSource | string | { url: string };
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
}

const SanityImage = ({ 
  image, 
  alt, 
  width, 
  height, 
  className = "", 
  priority = false,
  loading
}: SanityImageProps) => {
  const getImageUrl = (image: any) => {
    // If it's already a URL string, return it
    if (typeof image === 'string') {
      return image;
    }
    // If it has a url property, return that
    if (image && image.url) {
      return image.url;
    }
    // Otherwise, process it as a Sanity image
    return urlFor(image).url();
  };

  return (
    <Image
      src={getImageUrl(image)}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={loading}
    />
  );
};

export default SanityImage; 