"use client";

import { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { PlayIcon, VolumeXIcon, Volume2Icon, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import useStore from "@/store";

interface ProductVideoProps {
  videoUrl: string;
  className?: string;
  productSlug?: string;
  fullHeight?: boolean;
}

export default function ProductVideo({ videoUrl, className = "", productSlug, fullHeight = false }: ProductVideoProps) {
  const [playing, setPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wasInView = useRef<boolean>(false);
  const router = useRouter();
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const { globalMuted, setGlobalMuted } = useStore();

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
  const togglePlayback = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when just toggling play/pause
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

  const navigateToReel = () => {
    if (productSlug) {
      router.push(`/reel/${productSlug}`);
    }
  };

  return (
    <div 
      ref={ref}
      className={`relative ${fullHeight ? 'w-full h-full' : 'w-full aspect-[9/16]'} rounded-lg overflow-hidden ${className} cursor-pointer`}
      onClick={navigateToReel}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="absolute inset-0 bg-black/10 z-10" />
      
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        loop
        muted={globalMuted}
        playsInline
      />

      {/* Overlay Controls */}
      <div className="absolute inset-0 z-20 p-2 flex flex-col justify-between pointer-events-none">
        {/* Top Controls - Mute Button and Fullscreen Link */}
        <div className="flex justify-between items-center">
          {/* Fullscreen indicator */}
          {isHovering && productSlug && (
            <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full pointer-events-none">
              <ExternalLink size={14} className="text-white" />
              <span className="text-xs text-white">View Full</span>
            </div>
          )}
          
          <button 
            onClick={toggleMute}
            className="p-1.5 rounded-full bg-black/20 backdrop-blur-sm pointer-events-auto"
          >
            {globalMuted ? (
              <VolumeXIcon size={16} className="text-white" />
            ) : (
              <Volume2Icon size={16} className="text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 