import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { orderId } = params;
    const updates = await req.json();

    // Verify order exists and belongs to user
    const order = await backendClient.fetch(
      `*[_type == "order" && _id == $orderId && clerkUserId == $userId][0]`,
      { orderId, userId: session.userId }
    );

    if (!order) {
      return new NextResponse(
        JSON.stringify({ error: "Order not found" }),
        { status: 404 }
      );
    }

    // Update order
    const result = await backendClient
      .patch(orderId)
      .set({
        ...updates,
        updatedAt: new Date().toISOString()
      })
      .commit();

    return NextResponse.json({ 
      success: true, 
      order: result 
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to update order" 
      }), 
      { status: 500 }
    );
  }
} 