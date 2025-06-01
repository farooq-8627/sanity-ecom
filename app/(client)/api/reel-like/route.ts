import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to like reels." },
        { status: 401 }
      );
    }
    
    // Get the reel ID from the request
    const { reelId } = await req.json();
    
    if (!reelId) {
      return NextResponse.json(
        { error: "Reel ID is required" },
        { status: 400 }
      );
    }
    
    // Check if the reel exists
    const reel = await client.fetch(
      `*[_type == "productReel" && _id == $reelId][0]{
        _id,
        likes,
        "userHasLiked": count(likedBy[userId == $userId]) > 0
      }`,
      { reelId, userId }
    );
    
    if (!reel) {
      return NextResponse.json(
        { error: "Reel not found" },
        { status: 404 }
      );
    }
    
    // Check if token exists
    if (!process.env.SANITY_API_TOKEN) {
      console.error("Missing SANITY_API_TOKEN environment variable");
      return NextResponse.json(
        { 
          error: "Server is not configured properly. Please add a write token.",
          details: "Missing SANITY_API_TOKEN environment variable"
        },
        { status: 500 }
      );
    }
    
    try {
      if (reel.userHasLiked) {
        // User already liked this reel, so unlike it
        const updatedLikes = (reel.likes || 0) - 1;
        await backendClient
          .patch(reelId)
          .set({ likes: updatedLikes > 0 ? updatedLikes : 0 })
          .unset([`likedBy[userId == "${userId}"]`])
          .commit();
          
        return NextResponse.json({ 
          liked: false, 
          likes: updatedLikes > 0 ? updatedLikes : 0 
        });
      } else {
        // User hasn't liked this reel yet, so like it
        const updatedLikes = (reel.likes || 0) + 1;
        
        // Add user to likedBy array (let Sanity handle _key generation)
        await backendClient
          .patch(reelId)
          .set({ likes: updatedLikes })
          .append('likedBy', [
            {
              userId,
              likedAt: new Date().toISOString()
            }
          ])
          .commit();
          
        return NextResponse.json({ 
          liked: true, 
          likes: updatedLikes 
        });
      }
    } catch (error) {
      console.error("Sanity write error:", error);
      return NextResponse.json(
        { 
          error: "Failed to update like status. Your token may be read-only.",
          details: "Sanity write operation failed. Please ensure your token has write permissions."
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error handling reel like:", error);
    return NextResponse.json(
      { error: "Failed to process like" },
      { status: 500 }
    );
  }
} 