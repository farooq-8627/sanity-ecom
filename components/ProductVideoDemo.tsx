"use client";

import ProductVideo from "./ProductVideo";

export default function ProductVideoDemo() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Product Video Demo</h2>
      <div className="max-w-md mx-auto">
        <ProductVideo 
          videoUrl="https://your-video-url.mp4" 
          className="shadow-md"
        />
        <p className="mt-4 text-sm text-gray-600">
          This is a demo of the ProductVideo component. Replace the videoUrl prop with your actual video URL.
        </p>
      </div>
    </div>
  );
} 