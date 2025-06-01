import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { liked: false },
        { status: 200 }
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
    
    // Check if user already liked this reel using the likedBy array
    const result = await client.fetch(
      `*[_type == "productReel" && _id == $reelId][0]{
        "liked": count(likedBy[userId == $userId]) > 0
      }`,
      { reelId, userId }
    );
    
    return NextResponse.json({ 
      liked: result?.liked || false 
    });
  } catch (error) {
    console.error("Error checking reel like status:", error);
    return NextResponse.json(
      { liked: false },
      { status: 200 }
    );
  }
} 