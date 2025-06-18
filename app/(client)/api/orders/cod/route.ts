import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orderData = await req.json();

    // Create order in Sanity with the updated schema
    const order = await backendClient.create({
      _type: 'order',
      orderNumber: orderData.orderNumber,
      customer: {
        name: orderData.customerName,
        email: orderData.customerEmail,
        clerkUserId: orderData.clerkUserId,
      },
      shippingAddress: {
        name: orderData.address.name,
        address: orderData.address.address,
        addressLine2: orderData.address.addressLine2,
        city: orderData.address.city,
        state: orderData.address.state,
        zip: orderData.address.zip,
        phoneNumber: orderData.address.phoneNumber,
      },
      items: orderData.items.map((item: any) => ({
        _type: 'orderItem',
        _key: nanoid(),
        product: {
          _type: 'reference',
          _ref: item.product._id
        },
        quantity: item.quantity,
        size: item.size,
        price: item.product.price,
      })),
      totalAmount: orderData.totalAmount,
      discountAmount: orderData.discountAmount || 0,
      couponCode: orderData.couponCode || null,
      paymentStatus: "cod",
      orderStatus: "confirmed",
      paymentMethod: "cod",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true, 
      orderId: order._id 
    });
  } catch (error) {
    console.error('Error creating COD order:', error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
} 