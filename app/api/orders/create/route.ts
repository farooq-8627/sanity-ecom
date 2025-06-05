import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { backendClient, checkToken } from "@/sanity/lib/backendClient";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = await currentUser();
    
    if (!session?.userId) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401 }
      );
    }

    // Check if Sanity token is available
    try {
      checkToken();
    } catch (e) {
      console.error("Sanity token error:", e);
      return new NextResponse(
        JSON.stringify({ error: "Server configuration error" }), 
        { status: 500 }
      );
    }

    // Validate request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid request body" }), 
        { status: 400 }
      );
    }

    const {
      items,
      customer,
      shippingAddress,
      totalAmount,
      discountAmount,
      couponCode,
      paymentMethod,
      paymentStatus,
      orderStatus
    } = body;

    // Validate required fields
    if (!items?.length || !customer || !shippingAddress || !totalAmount) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }), 
        { status: 400 }
      );
    }

    // Create order document
    const order = {
      _type: 'order',
      orderNumber: `ORD-${Date.now()}-${uuidv4().substring(0, 6)}`,
      customer,
      shippingAddress,
      items,
      totalAmount,
      discountAmount: discountAmount || 0,
      couponCode: couponCode || null,
      paymentStatus: paymentStatus || 'pending',
      orderStatus: orderStatus || 'pending',
      paymentMethod: paymentMethod === 'cod' ? 'cod' : 'phonepe',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const result = await backendClient.create(order);
      return NextResponse.json({ 
        success: true, 
        orderId: result._id 
      });
    } catch (e: any) {
      console.error("Sanity error:", e);
      return new NextResponse(
        JSON.stringify({ 
          error: "Database error: " + (e.message || "Failed to create order")
        }), 
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error creating order:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: error.message || "Failed to create order" 
      }), 
      { status: 500 }
    );
  }
} 