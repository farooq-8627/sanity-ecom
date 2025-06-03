import { backendClient } from "@/sanity/lib/backendClient";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

// This is a test-only endpoint that simulates a successful order
// without requiring an actual Stripe webhook
export async function POST(req: NextRequest) {
  try {
    const { products, userData } = await req.json();
    
    if (!products || !Array.isArray(products) || !userData) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }
    
    // Create order in Sanity
    const orderNumber = uuidv4();
    
    // Format products for Sanity
    const sanityProducts = products.map(item => ({
      _key: uuidv4(),
      product: {
        _type: "reference",
        _ref: item.product._id,
      },
      quantity: item.quantity,
      size: item.size || null,
    }));
    
    // Calculate total price
    const totalPrice = products.reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );
    
    // Create order in Sanity
    const order = await backendClient.create({
      _type: "order",
      orderNumber,
      customerName: userData.name || "Test User",
      email: userData.email || "test@example.com",
      clerkUserId: userData.userId,
      products: sanityProducts,
      totalPrice,
      status: "paid",
      orderDate: new Date().toISOString(),
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Test order created successfully",
      orderId: order._id,
      orderNumber
    });
  } catch (error) {
    console.error("Error creating test order:", error);
    return NextResponse.json(
      { error: `Error creating test order: ${error}` },
      { status: 500 }
    );
  }
} 