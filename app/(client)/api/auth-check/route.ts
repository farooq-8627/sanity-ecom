import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    const user = await currentUser();
    
    console.log("Auth check API called:", { 
      userId, 
      hasUser: !!user,
      userEmail: user?.emailAddresses[0]?.emailAddress || 'none'
    });
    
    if (!userId) {
      console.log("Auth check: No userId found");
      return NextResponse.json(
        { authenticated: false, message: "User not authenticated" },
        { status: 401 }
      );
    }
    
    console.log("Auth check: User authenticated", userId);
    return NextResponse.json({ 
      authenticated: true,
      userId
    });
  } catch (error) {
    console.error("Error in auth check route:", error);
    return NextResponse.json(
      { error: "An error occurred during authentication check" },
      { status: 500 }
    );
  }
} 