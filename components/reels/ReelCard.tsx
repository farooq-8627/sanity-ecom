"use client";

import { useState, useRef, useEffect } from "react";
import { ProductReel } from "@/types/ProductReel";
import { useInView } from "react-intersection-observer";
import { PlayIcon, Heart, Volume2Icon, VolumeXIcon } from "lucide-react";
import SanityImage from "../SanityImage";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import useStore from "@/store";
import ShareButton from "../ShareButton";

interface ReelCardProps {
  reel: ProductReel;
  onProductOpen: (productId: string) => void;
  isPressed?: boolean;
}

export default function ReelCard({ reel, onProductOpen, isPressed = false }: ReelCardProps) {
  const [playing, setPlaying] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wasInView = useRef<boolean>(false);
  const { ref, inView } = useInView({
    threshold: 0.7,
  });
  const { isSignedIn } = useUser();
  const { toggleReelLike, isReelLiked, globalMuted, setGlobalMuted } = useStore();
  const liked = isSignedIn && isReelLiked(reel._id);

  // Control video playback based on visibility
  useEffect(() => {
    if (videoRef.current) {
      if (inView) {
        // Reset video to beginning if this is a re-entry into view
        if (!wasInView.current) {
          videoRef.current.currentTime = 0;
        }
        
        videoRef.current.play()
          .then(() => {
            setPlaying(true);
            wasInView.current = true;
          })
          .catch((e) => {
            console.log("Playback error:", e);
          });
      } else {
        videoRef.current.pause();
        setPlaying(false);
        // Mark that we've left view
        wasInView.current = false;
      }
    }
  }, [inView]);

  // Play/pause based on user interaction
  const togglePlayback = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.log(e));
      }
      setPlaying(!playing);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGlobalMuted(!globalMuted);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isSignedIn) {
      toast.error("Please sign in to like reels");
      return;
    }
    
    if (isLiking) return; // Prevent multiple clicks
    
    try {
      setIsLiking(true);
      
      // Update likes count optimistically for better UX
      const newLikesCount = liked ? likesCount - 1 : likesCount + 1;
      setLikesCount(newLikesCount);
      
      const success = await toggleReelLike(reel._id);
      
      if (!success) {
        // Revert optimistic update if failed
        setLikesCount(reel.likes || 0);
        toast.error("Failed to update like status");
      }
    } catch (error) {
      console.error("Error liking reel:", error);
      // Revert optimistic update
      setLikesCount(reel.likes || 0);
      
      if (error instanceof Error) {
        if (error.message.includes("Server is not configured properly")) {
          toast.error("Server needs a write token. Check setup instructions.");
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div 
      ref={ref}
      className={`relative w-full max-w-[420px] aspect-[9/16] rounded-xl overflow-hidden shadow-lg transition-transform ${
        isPressed ? 'scale-[0.98]' : 'scale-100'
      }`}
      onClick={togglePlayback}
    >
      <div className="absolute inset-0 bg-black/20 z-10" />
      
      <video
        ref={videoRef}
        src={reel.video.url}
        className="w-full h-full object-cover"
        loop
        muted={globalMuted}
        playsInline
      />

      {/* Overlay Controls */}
      <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between pointer-events-none">
        {/* Top Controls - Header */}
        <div className="flex justify-end items-center">
          <button 
            onClick={toggleMute}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm pointer-events-auto"
          >
            {globalMuted ? (
              <VolumeXIcon size={20} className="text-white" />
            ) : (
              <Volume2Icon size={20} className="text-white" />
            )}
          </button>
        </div>

        {/* Center Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          {!playing && (
            <button className="p-4 rounded-full bg-black/30 backdrop-blur-sm transform transition-transform hover:scale-110">
              <PlayIcon size={32} className="text-white" />
            </button>
          )}
        </div>

        {/* Product Info - Footer */}
        <div 
          className="absolute bottom-4 left-0 right-0 px-4 cursor-pointer pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            onProductOpen(reel.product._id);
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0">
              {reel.product.images?.[0] && (
                <SanityImage
                  image={reel.product.images[0]}
                  alt={reel.product.name || 'Product image'}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-white text-sm font-medium mb-0.5 drop-shadow-sm line-clamp-1">{reel.product.name}</h3>
            </div>
          </div>
        </div>

        {/* Interaction Buttons */}
        <div className="absolute right-4 bottom-24 flex flex-col gap-3 pointer-events-auto">
          <button 
            onClick={handleLike}
            className={`transition-all ${isLiking ? 'opacity-50' : ''}`}
            disabled={isLiking}
          >
            <Heart 
              size={26} 
              className={`transition-colors ${liked ? "text-red-500 fill-red-500" : "text-white"}`} 
            />
            <span className="text-[10px] text-white block mt-0.5">{likesCount}</span>
          </button>
          <ShareButton 
            title={reel.product.name}
            description={`Check out this product: ${reel.product.name}`}
            url={`/reel/${reel.product.slug.current}`}
            iconOnly
            className="text-white"
          />
        </div>
      </div>
    </div>
  );
} 