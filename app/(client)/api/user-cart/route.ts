import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { backendClient } from "@/sanity/lib/backendClient";

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
    
    // Check if user has a cart in Sanity
    const userCart = await client.fetch(
      `*[_type == "userCart" && userId == $userId][0]{
        _id,
        userId,
        items[] {
          _key,
          productId,
          quantity,
          addedAt
        }
      }`,
      { userId }
    );
    
    // If no cart exists, return empty array
    if (!userCart) {
      return NextResponse.json({ items: [] });
    }
    
    // Get product details for each item in cart
    const cartWithProducts = await Promise.all(
      userCart.items.map(async (item: any) => {
        const product = await client.fetch(
          `*[_type == "product" && _id == $productId][0]`,
          { productId: item.productId }
        );
        
        return {
          product,
          quantity: item.quantity
        };
      })
    );
    
    return NextResponse.json({ items: cartWithProducts });
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
    const { items } = await req.json();
    
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid cart data. Items must be an array." },
        { status: 400 }
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
      // Format cart items for Sanity with _key property
      const sanityCartItems = items.map((item: any) => ({
        _key: `${item.product._id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        productId: item.product._id,
        quantity: item.quantity,
        addedAt: new Date().toISOString()
      }));
      
      // Check if user already has a cart
      const existingCart = await client.fetch(
        `*[_type == "userCart" && userId == $userId][0]`,
        { userId }
      );
      
      if (existingCart) {
        // Update existing cart
        await backendClient
          .patch(existingCart._id)
          .set({ 
            items: sanityCartItems,
            updatedAt: new Date().toISOString()
          })
          .commit();
      } else {
        // Create new cart
        await backendClient.create({
          _type: 'userCart',
          userId,
          items: sanityCartItems,
          updatedAt: new Date().toISOString()
        });
      }
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Sanity write error:", error);
      return NextResponse.json(
        { 
          error: "Failed to update cart. Your token may be read-only.",
          details: "Sanity write operation failed. Please ensure your token has write permissions."
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