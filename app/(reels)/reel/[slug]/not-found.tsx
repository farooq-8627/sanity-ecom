import Link from "next/link";

export default function ReelNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="text-3xl font-bold mb-2">Reel Not Found</h1>
      <p className="text-gray-600 mb-6 text-center">
        The reel you're looking for doesn't exist or may have been removed.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/reels" 
          className="bg-shop_light_green text-white px-6 py-2 rounded-lg hover:bg-shop_dark_green transition-colors"
        >
          Browse Reels
        </Link>
        <Link 
          href="/" 
          className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
} 