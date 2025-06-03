"use client";

import { useState, useEffect } from 'react';
import { LiaTelegramPlane } from "react-icons/lia";
import { FaWhatsapp, FaFacebookF, FaTwitter, FaTelegram } from "react-icons/fa";
import { MdContentCopy, MdClose } from "react-icons/md";
import toast from "react-hot-toast";

interface ShareButtonProps {
  title: string;
  url: string;
  description?: string;
  className?: string;
  iconOnly?: boolean;
  iconSize?: number;
}

export default function ShareButton({ 
  title, 
  url, 
  description = "", 
  className = "",
  iconOnly = false,
  iconSize = 26
}: ShareButtonProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [fullUrl, setFullUrl] = useState(url);

  useEffect(() => {
    // Only run in the browser
    if (typeof window !== 'undefined') {
      // If it's already a full URL, use it as is
      if (url.startsWith('http')) {
        setFullUrl(url);
      } else {
        // If it's a relative URL, construct the full URL
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
        // Remove any leading slashes from the URL and construct the full path
        const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
        setFullUrl(`${baseUrl}/${cleanUrl}`);
      }
    }
  }, [url]);

  const handleShare = async () => {
    try {
      const shareData = {
        title,
        text: description || title,
        url: fullUrl
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            setShowShareModal(true);
          }
        }
      } else {
        setShowShareModal(true);
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to share. Please try again.");
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast.success("Link copied to clipboard!");
      setShowShareModal(false);
    } catch (err) {
      toast.error("Failed to copy link. Please try again.");
    }
  };

  const handleSocialShare = async (platform: string) => {
    const shareText = description || title;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${fullUrl}`)}`, '_blank', 'width=600,height=400');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank', 'width=600,height=400');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`, '_blank', 'width=600,height=400');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(shareText)}`, '_blank', 'width=600,height=400');
        break;
      case 'copy':
        try {
          if (typeof navigator !== 'undefined' && navigator.clipboard) {
            await navigator.clipboard.writeText(fullUrl);
            toast.success("Link copied to clipboard!");
          } else {
            fallbackCopyToClipboard(fullUrl);
          }
          setShowShareModal(false);
        } catch (error) {
          fallbackCopyToClipboard(fullUrl);
        }
        return;
    }

    setShowShareModal(false);
  };

  return (
    <>
      <button 
        onClick={handleShare}
        className={`hover:text-gray-700 flex items-center gap-1 ${className}`}
      >
        <LiaTelegramPlane className="text-base" size={iconSize}/>
        {!iconOnly && <span>Share</span>}
      </button>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Share to</h3>
              <button onClick={() => setShowShareModal(false)} className="p-1">
                <MdClose size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                  <FaWhatsapp size={24} />
                </div>
                <span className="text-xs">WhatsApp</span>
              </button>
              
              <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white">
                  <FaFacebookF size={24} />
                </div>
                <span className="text-xs">Facebook</span>
              </button>
              
              <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white">
                  <FaTwitter size={24} />
                </div>
                <span className="text-xs">Twitter</span>
              </button>
              
              <button onClick={() => handleSocialShare('telegram')} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#0088cc] flex items-center justify-center text-white">
                  <FaTelegram size={24} />
                </div>
                <span className="text-xs">Telegram</span>
              </button>
            </div>
            
            <button 
              onClick={() => handleSocialShare('copy')}
              className="w-full py-3 flex items-center justify-center gap-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <MdContentCopy size={20} />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
} 