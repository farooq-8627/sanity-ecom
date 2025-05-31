import { useState } from 'react';
import Image from 'next/image';

interface ProductImageCarouselProps {
  images: { url: string }[];
  title: string;
}

export default function ProductImageCarousel({ images, title }: ProductImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Main Image */}
      <div className="relative w-[250px] h-[250px] rounded-lg overflow-hidden">
        <Image
          src={images[currentImageIndex]?.url || ''}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          fill
          className="object-cover"
        />
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-1.5">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`relative w-12 h-12 flex-shrink-0 rounded overflow-hidden border transition-all ${
              currentImageIndex === index ? 'border-black' : 'border-gray-200'
            }`}
          >
            <Image
              src={image.url}
              alt={`${title} - Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
} 