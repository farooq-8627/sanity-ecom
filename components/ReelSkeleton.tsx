import React from "react";
import ReelListSkeliton from "./ReelListSkeliton";

const ReelSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* Reel Video Skeleton - Works for both mobile and desktop */}
      <div className="w-full md:w-[60%] h-full flex items-center justify-center -my-16">
        <div className="h-full w-full max-w-md mx-auto px-4 flex items-center justify-center">
          <div className="w-full max-w-[420px] aspect-[9/16] rounded-xl overflow-hidden bg-gray-200 animate-pulse shadow-lg relative">
            {/* Play button skeleton */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse"></div>
            </div>
            
            {/* Top controls skeleton */}
            <div className="absolute top-4 right-4">
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
            </div>
            
            {/* Bottom product info skeleton */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gray-300 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-300 animate-pulse rounded mb-1"></div>
                <div className="h-3 w-24 bg-gray-300 animate-pulse rounded"></div>
              </div>
            </div>
            
            {/* Right side buttons skeleton */}
            <div className="absolute right-4 bottom-24 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side placeholder to maintain layout */}
      <div className="hidden md:block md:w-[39%] my-4 ml-3">
        <ReelListSkeliton />
      </div>
    </div>
  );
};

export default ReelSkeleton; 