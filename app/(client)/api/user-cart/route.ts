import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { CartItem } from "@/store";
import { getUserCart } from "@/sanity/queries";

// Get user cart
export async function GET(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to access your cart." },
        { status: 401 }
      );
    }
    
    console.log("Fetching cart for user:", userId);
    
    // Check if user has a cart in Sanity
    const userCart = await getUserCart(userId);
    
    // If no cart exists, return empty array
    if (!userCart) {
      console.log("No cart found for user:", userId);
      return NextResponse.json({ items: [] });
    }
    
    console.log("Found cart with", userCart.items?.length || 0, "items for user", userId);
    
    // Cart items already have product references expanded
    const validCartItems = (userCart.items || []).filter((item: { product: any }) => item.product);
    
    console.log("Returning", validCartItems.length, "valid products for cart of user", userId);
    
    return NextResponse.json({ items: validCartItems });
  } catch (error) {
    console.error("Error fetching user cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// Update user cart
export async function POST(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to update your cart." },
        { status: 401 }
      );
    }
    
    // Get cart items from request
    const body = await req.json();
    console.log(`Received cart update request for user ${userId}`);
    
    const { items } = body;
    
    if (!Array.isArray(items)) {
      console.error("Invalid cart data format:", body);
      return NextResponse.json(
        { error: "Invalid cart data. Items must be an array." },
        { status: 400 }
      );
    }
    
    console.log(`Processing ${items.length} cart items for user ${userId}`);
    
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
      // Format cart items for Sanity with _key property
      const sanityCartItems = items.map((item: CartItem, index: number) => {
        if (!item || !item.product || !item.product._id) {
          console.error("Invalid item in cart items:", item);
          throw new Error("Invalid item data in cart items");
        }
        
        // Generate a unique key that includes size information if available
        const sizeInfo = item.size ? `_${item.size}` : '';
        const uniqueKey = `${item.product._id}${sizeInfo}_${index}`;
        
        return {
          _key: uniqueKey,
          product: {
            _type: "reference",
            _ref: item.product._id
          },
          quantity: item.quantity,
          size: item.size || undefined
        };
      });
      
      console.log(`Formatted ${sanityCartItems.length} cart items for user ${userId}`);
      
      // Create a document ID that's deterministic based on the user ID
      const cartDocId = `cart_${userId}`;
      
      // Use createOrReplace to ensure we only ever have one cart per user
      const result = await backendClient.createOrReplace({
        _type: 'userCart',
        _id: cartDocId,
        clerkUserId: userId,
        items: sanityCartItems,
        updatedAt: new Date().toISOString()
      });
      
      console.log(`Cart operation successful for user ${userId}:`, result._id);
      
      return NextResponse.json({ 
        success: true,
        itemCount: sanityCartItems.length,
        userId: userId
      });
    } catch (error) {
      console.error(`Sanity write error for user ${userId}:`, error);
      return NextResponse.json(
        { 
          error: "Failed to update cart. Your token may be read-only.",
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating user cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
} 