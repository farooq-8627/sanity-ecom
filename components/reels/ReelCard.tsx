"use client";

import { useState, useRef } from "react";
import { ProductReel } from "@/types/ProductReel";
import { useInView } from "react-intersection-observer";
import { PlayIcon, PauseIcon, HeartIcon, ShareIcon, MessageCircleIcon, Volume2Icon, VolumeXIcon } from "lucide-react";
import Image from "next/image";

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
    onChange: (inView) => {
      if (inView) {
        videoRef.current?.play();
        setPlaying(true);
      } else {
        videoRef.current?.pause();
        setPlaying(false);
        setMuted(true); // Reset muted state when reel is not in view
      }
    }
  });

  const togglePlay = () => {
    if (playing) {
      videoRef.current?.pause();
      setPlaying(false);
    } else {
      videoRef.current?.play();
      setPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent video play/pause
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(!muted);
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
    // Here you would typically make an API call to update likes in Sanity
  };

  return (
    <div 
      ref={ref} 
      className={`relative w-full max-w-[400px] aspect-[9/16] bg-black rounded-lg overflow-hidden transition-transform duration-300 ${
        isPressed ? 'scale-95' : 'scale-100'
      }`}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.video.url}
        className="w-full h-full object-cover"
        loop
        muted={muted}
        playsInline
      />

      {/* Overlay Controls */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50">
        {/* Top Controls */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm"
          >
            {muted ? (
              <VolumeXIcon size={24} className="text-white" />
            ) : (
              <Volume2Icon size={24} className="text-white" />
            )}
          </button>
        </div>

        {/* Center Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/80 hover:text-white"
        >
          {playing ? <PauseIcon size={48} /> : <PlayIcon size={48} />}
        </button>

        {/* Product Info */}
        <div 
          className="absolute bottom-4 left-4 right-12 cursor-pointer"
          onClick={() => onProductOpen(reel.product._id)}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <Image
                src={reel.product.images?.[0]?.url || ''}
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
        <div className="absolute right-4 bottom-4 flex flex-col gap-4">
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