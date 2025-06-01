import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { backendClient } from "@/sanity/lib/backendClient";

// Get user wishlist
export async function GET(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to access your wishlist." },
        { status: 401 }
      );
    }
    
    console.log("Fetching wishlist for user:", userId);
    
    // Check if user has a wishlist in Sanity
    const userWishlist = await client.fetch(
      `*[_type == "userWishlist" && userId == $userId][0]{
        _id,
        userId,
        items[] {
          _key,
          productId,
          addedAt
        }
      }`,
      { userId }
    );
    
    // If no wishlist exists, return empty array
    if (!userWishlist) {
      console.log("No wishlist found for user:", userId);
      return NextResponse.json({ favoriteProduct: [] });
    }
    
    console.log("Found wishlist with", userWishlist.items?.length || 0, "items for user", userId);
    
    // Get product details for each item in wishlist
    const wishlistProducts = await Promise.all(
      (userWishlist.items || []).map(async (item: any) => {
        const product = await client.fetch(
          `*[_type == "product" && _id == $productId][0]`,
          { productId: item.productId }
        );
        
        if (!product) {
          console.log(`Product not found for ID: ${item.productId}`);
        }
        
        return product;
      })
    );
    
    // Filter out any null products (in case a product was deleted)
    const validProducts = wishlistProducts.filter(product => product !== null);
    
    console.log("Returning", validProducts.length, "valid products for wishlist of user", userId);
    
    return NextResponse.json({ favoriteProduct: validProducts });
  } catch (error) {
    console.error("Error fetching user wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// Update user wishlist
export async function POST(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to update your wishlist." },
        { status: 401 }
      );
    }
    
    // Get items from request
    const body = await req.json();
    console.log(`Received wishlist update request for user ${userId}:`, body);
    
    const { items } = body;
    
    if (!Array.isArray(items)) {
      console.error("Invalid wishlist data format:", body);
      return NextResponse.json(
        { error: "Invalid wishlist data. Items must be an array." },
        { status: 400 }
      );
    }
    
    console.log(`Processing ${items.length} wishlist items for user ${userId}`);
    
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
      // Format wishlist items for Sanity with _key property
      const sanityWishlistItems = items.map((product: any, index: number) => {
        if (!product || !product._id) {
          console.error("Invalid product in wishlist items:", product);
          throw new Error("Invalid product data in wishlist items");
        }
        
        return {
          _key: `${product._id}_${Date.now()}_${index}`,
          productId: product._id,
          addedAt: new Date().toISOString()
        };
      });
      
      console.log(`Formatted ${sanityWishlistItems.length} wishlist items for user ${userId}`);
      
      // Check if user already has a wishlist
      const existingWishlist = await client.fetch(
        `*[_type == "userWishlist" && userId == $userId][0]`,
        { userId }
      );
      
      if (existingWishlist) {
        console.log(`Updating existing wishlist for user ${userId}:`, existingWishlist._id);
        
        // Update existing wishlist
        const result = await backendClient
          .patch(existingWishlist._id)
          .set({ 
            items: sanityWishlistItems,
            updatedAt: new Date().toISOString()
          })
          .commit();
          
        console.log(`Wishlist updated successfully for user ${userId}:`, result._id);
        
        return NextResponse.json({ 
          success: true,
          itemCount: sanityWishlistItems.length,
          userId: userId
        });
      } else {
        console.log(`Creating new wishlist for user ${userId}`);
        
        // Create new wishlist
        const result = await backendClient.create({
          _type: 'userWishlist',
          userId,
          items: sanityWishlistItems,
          updatedAt: new Date().toISOString()
        });
        
        console.log(`New wishlist created for user ${userId}:`, result._id);
        
        return NextResponse.json({ 
          success: true,
          itemCount: sanityWishlistItems.length,
          userId: userId
        });
      }
    } catch (error) {
      console.error(`Sanity write error for user ${userId}:`, error);
      return NextResponse.json(
        { 
          error: "Failed to update wishlist. Your token may be read-only.",
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating user wishlist:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}

// Toggle a product in wishlist
export async function PUT(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to update your wishlist." },
        { status: 401 }
      );
    }
    
    // Get product from request
    const { product } = await req.json();
    
    if (!product || !product._id) {
      return NextResponse.json(
        { error: "Invalid product data." },
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
      // Check if user already has a wishlist
      const existingWishlist = await client.fetch(
        `*[_type == "userWishlist" && userId == $userId][0]{
          _id,
          items[] {
            _key,
            productId
          }
        }`,
        { userId }
      );
      
      if (existingWishlist) {
        // Check if product is already in wishlist
        const isInWishlist = existingWishlist.items.some(
          (item: any) => item.productId === product._id
        );
        
        if (isInWishlist) {
          // Remove product from wishlist
          const updatedItems = existingWishlist.items.filter(
            (item: any) => item.productId !== product._id
          );
          
          await backendClient
            .patch(existingWishlist._id)
            .set({ 
              items: updatedItems,
              updatedAt: new Date().toISOString()
            })
            .commit();
            
          return NextResponse.json({ 
            added: false,
            message: "Product removed from wishlist"
          });
        } else {
          // Add product to wishlist with _key property
          const updatedItems = [
            ...existingWishlist.items,
            {
              _key: `${product._id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              productId: product._id,
              addedAt: new Date().toISOString()
            }
          ];
          
          await backendClient
            .patch(existingWishlist._id)
            .set({ 
              items: updatedItems,
              updatedAt: new Date().toISOString()
            })
            .commit();
            
          return NextResponse.json({ 
            added: true,
            message: "Product added to wishlist"
          });
        }
      } else {
        // Create new wishlist with this product with _key property
        await backendClient.create({
          _type: 'userWishlist',
          userId,
          items: [
            {
              _key: `${product._id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              productId: product._id,
              addedAt: new Date().toISOString()
            }
          ],
          updatedAt: new Date().toISOString()
        });
        
        return NextResponse.json({ 
          added: true,
          message: "Product added to wishlist"
        });
      }
    } catch (error) {
      console.error("Sanity write error:", error);
      return NextResponse.json(
        { 
          error: "Failed to update wishlist. Your token may be read-only.",
          details: "Sanity write operation failed. Please ensure your token has write permissions."
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating user wishlist:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
} 