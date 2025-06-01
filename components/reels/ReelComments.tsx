"use client";

import { useState } from "react";
import { ProductReel } from "@/types/ProductReel";
import SanityImage from "../SanityImage";

interface ReelCommentsProps {
  comments: ProductReel['comments'];
  onClose?: () => void;
}

export default function ReelComments({ comments, onClose }: ReelCommentsProps) {
  const [newComment, setNewComment] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would submit the comment to your backend
    console.log("Submitting comment:", newComment);
    setNewComment("");
  };
  
  return (
    <div className="bg-white rounded-lg flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Comments ({comments?.length || 0})</h3>
        {onClose && (
          <button onClick={onClose} className="text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments?.map((comment) => (
          <div key={comment._id} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
              {comment.user.image && (
                <SanityImage
                  image={comment.user.image}
                  alt={comment.user.name}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{comment.user.name}</p>
              <p className="text-sm text-gray-600">{comment.comment}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        {(!comments || comments.length === 0) && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="text-sm">No comments yet</p>
          </div>
        )}
      </div>
      
      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-shop_light_green"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!newComment.trim()}
            className="bg-shop_light_green text-white rounded-full p-2 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
} 