import { useState } from 'react';
import Image from 'next/image';

interface ProductImageCarouselProps {
  images: { url: string }[];
  title: string;
}

export default function ProductImageCarousel({ images, title }: ProductImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="w-full flex flex-col md:flex-row ">
      {/* Thumbnails - Left Side */}
      <div className="order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:w-20 md:max-h-[500px]">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`flex-shrink-0 w-12 h-12 md:w-18 md:h-18 border rounded-lg overflow-hidden ${
              currentImageIndex === index ? 'border-shop_orange' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <Image
              src={image.url}
              alt={`${title} - Thumbnail ${index + 1}`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image - Right Side */}
      <div className="order-1 md:order-2 flex-1">
        <div className="w-full h-[400px] border border-gray-100 rounded-lg overflow-hidden">
          <Image
            src={images[currentImageIndex]?.url || ''}
            alt={`${title} - Image ${currentImageIndex + 1}`}
            width={800}
            height={800}
            priority
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
} 