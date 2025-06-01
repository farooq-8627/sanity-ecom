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
    
    // Check if user has a wishlist in Sanity
    const userWishlist = await client.fetch(
      `*[_type == "userWishlist" && userId == $userId][0]{
        _id,
        userId,
        products[] {
          _key,
          productId,
          addedAt
        }
      }`,
      { userId }
    );
    
    // If no wishlist exists, return empty array
    if (!userWishlist) {
      return NextResponse.json({ products: [] });
    }
    
    // Get product details for each item in wishlist
    const productsWithDetails = await Promise.all(
      userWishlist.products.map(async (item: any) => {
        const product = await client.fetch(
          `*[_type == "product" && _id == $productId][0]`,
          { productId: item.productId }
        );
        
        return product;
      })
    );
    
    // Filter out any null products (in case a product was deleted)
    const validProducts = productsWithDetails.filter(product => product !== null);
    
    return NextResponse.json({ products: validProducts });
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
    
    // Get products from request
    const { products } = await req.json();
    
    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: "Invalid wishlist data. Products must be an array." },
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
      // Format wishlist products for Sanity with _key property
      const sanityWishlistProducts = products.map((product: any) => ({
        _key: `${product._id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        productId: product._id,
        addedAt: new Date().toISOString()
      }));
      
      // Check if user already has a wishlist
      const existingWishlist = await client.fetch(
        `*[_type == "userWishlist" && userId == $userId][0]`,
        { userId }
      );
      
      if (existingWishlist) {
        // Update existing wishlist
        await backendClient
          .patch(existingWishlist._id)
          .set({ 
            products: sanityWishlistProducts,
            updatedAt: new Date().toISOString()
          })
          .commit();
      } else {
        // Create new wishlist
        await backendClient.create({
          _type: 'userWishlist',
          userId,
          products: sanityWishlistProducts,
          updatedAt: new Date().toISOString()
        });
      }
      
      return NextResponse.json({ success: true });
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
          products[] {
            _key,
            productId
          }
        }`,
        { userId }
      );
      
      if (existingWishlist) {
        // Check if product is already in wishlist
        const isInWishlist = existingWishlist.products.some(
          (item: any) => item.productId === product._id
        );
        
        if (isInWishlist) {
          // Remove product from wishlist
          const updatedProducts = existingWishlist.products.filter(
            (item: any) => item.productId !== product._id
          );
          
          await backendClient
            .patch(existingWishlist._id)
            .set({ 
              products: updatedProducts,
              updatedAt: new Date().toISOString()
            })
            .commit();
            
          return NextResponse.json({ 
            added: false,
            message: "Product removed from wishlist"
          });
        } else {
          // Add product to wishlist with _key property
          const updatedProducts = [
            ...existingWishlist.products,
            {
              _key: `${product._id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              productId: product._id,
              addedAt: new Date().toISOString()
            }
          ];
          
          await backendClient
            .patch(existingWishlist._id)
            .set({ 
              products: updatedProducts,
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
          products: [
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