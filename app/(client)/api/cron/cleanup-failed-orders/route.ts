import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { groq } from "next-sanity";

// Only allow GET requests from cron jobs
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get("authorization");
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find orders that are:
    // 1. Failed or pending payment status
    // 2. Created more than 24 hours ago
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    // First, get the IDs of orders to delete
    const query = groq`*[
      _type == "order" && 
      (paymentStatus == "failed" || paymentStatus == "pending") && 
      createdAt < '${oneDayAgo}'
    ]._id`;

    const orderIds = await client.fetch(query);

    if (!orderIds.length) {
      return NextResponse.json({ 
        message: "No failed orders to clean up",
        deletedCount: 0,
        timestamp: new Date().toISOString()
      });
    }

    // Delete the orders
    const transaction = orderIds.map((id: string) => ({
      delete: { id }
    }));

    await client.transaction(transaction).commit();

    return NextResponse.json({ 
      message: "Cleaned up failed orders",
      deletedCount: orderIds.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Failed to clean up orders:", error);
    return NextResponse.json(
      { 
        error: "Failed to clean up orders",
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
} 