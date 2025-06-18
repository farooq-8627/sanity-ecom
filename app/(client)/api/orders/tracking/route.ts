import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Fetch order tracking information from Sanity
    const order = await backendClient.fetch(
      `*[_type == "order" && _id == $orderId && customer.clerkUserId == $userId][0]{
        tracking,
        orderStatus,
        orderNumber
      }`,
      { orderId, userId }
    );

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      tracking: order.tracking,
      orderStatus: order.orderStatus,
      orderNumber: order.orderNumber
    });
  } catch (error) {
    console.error('Error fetching order tracking:', error);
    return NextResponse.json(
      { error: "Failed to fetch tracking information" },
      { status: 500 }
    );
  }
} 