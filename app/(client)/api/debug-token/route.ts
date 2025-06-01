import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Check if token exists (don't expose the actual token)
    const hasToken = !!process.env.SANITY_API_TOKEN;
    
    return NextResponse.json({ 
      hasToken,
      tokenLength: hasToken ? process.env.SANITY_API_TOKEN?.length : 0
    });
  } catch (error) {
    console.error("Error in debug route:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
} 