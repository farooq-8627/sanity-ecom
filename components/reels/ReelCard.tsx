"use client";

import { useState, useRef } from "react";
import { ProductReel } from "@/types/ProductReel";
import { useInView } from "react-intersection-observer";
import { PlayIcon, PauseIcon, HeartIcon, ShareIcon, MessageCircleIcon, Volume2Icon, VolumeXIcon } from "lucide-react";
import SanityImage from "../SanityImage";

interface ReelCardProps {
  reel: ProductReel;
  onProductOpen: (productId: string) => void;
  isPressed?: boolean;
}

export default function ReelCard({ reel, onProductOpen, isPressed = false }: ReelCardProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView({
    threshold: 0.7,
  });

  // Play/pause based on visibility
  const togglePlayback = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <div 
      ref={ref}
      className={`relative w-full max-w-[400px] aspect-[9/16] rounded-xl overflow-hidden shadow-lg transition-transform ${
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
        muted={muted}
        playsInline
        onClick={togglePlayback}
      />

      {/* Overlay Controls */}
      <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between pointer-events-none">
        {/* Top Controls */}
        <div className="flex justify-end">
          <button 
            onClick={toggleMute}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm pointer-events-auto"
          >
            {muted ? (
              <VolumeXIcon size={24} className="text-white" />
            ) : (
              <Volume2Icon size={24} className="text-white" />
            )}
          </button>
        </div>

        {/* Center Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          {!playing && (
            <button className="p-4 rounded-full bg-black/20 backdrop-blur-sm transform transition-transform hover:scale-110">
              <PlayIcon size={32} className="text-white" />
            </button>
          )}
        </div>

        {/* Product Info */}
        <div 
          className="absolute bottom-4 left-4 right-12 cursor-pointer pointer-events-auto"
          onClick={() => onProductOpen(reel.product._id)}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <SanityImage
                image={reel.product.images?.[0]}
                alt={reel.product.name || 'Product image'}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium truncate">{reel.product.name}</h3>
              <p className="text-white/80 text-sm truncate">{reel.product.description}</p>
            </div>
          </div>
        </div>

        {/* Interaction Buttons */}
        <div className="absolute right-4 bottom-4 flex flex-col gap-4 pointer-events-auto">
          <button 
            onClick={toggleLike}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm"
          >
            <HeartIcon 
              size={24} 
              className={liked ? "text-red-500 fill-red-500" : "text-white"} 
            />
          </button>
          <button className="p-2 rounded-full bg-black/20 backdrop-blur-sm">
            <MessageCircleIcon size={24} className="text-white" />
          </button>
          <button className="p-2 rounded-full bg-black/20 backdrop-blur-sm">
            <ShareIcon size={24} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
} 