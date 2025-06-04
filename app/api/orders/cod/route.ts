import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import crypto from 'crypto';

const generateKey = () => crypto.randomBytes(16).toString('hex');

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

    // Validate required fields
    if (!orderData.customerName || !orderData.address || !orderData.items || !orderData.totalAmount) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 }
      );
    }

    // Validate PIN code
    if (!orderData.address.zip.match(/^[1-9][0-9]{5}$/)) {
      return NextResponse.json(
        { error: "Invalid PIN code. Must be a 6-digit number." },
        { status: 400 }
      );
    }

    // Format the order data with proper _key properties
    const formattedOrder = {
      _type: 'order',
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      clerkUserId: orderData.clerkUserId,
      address: {
        _type: 'address',
        name: orderData.address.name,
        address: orderData.address.address,
        addressLine2: orderData.address.addressLine2,
        city: orderData.address.city,
        state: orderData.address.state,
        zip: orderData.address.zip,
        phoneNumber: orderData.address.phoneNumber
      },
      items: orderData.items.map((item: any) => ({
        _key: generateKey(),
        _type: 'orderItem',
        product: {
          _type: 'reference',
          _ref: item.product._id
        },
        quantity: item.quantity,
        size: item.size,
        price: item.price
      })),
      totalAmount: orderData.totalAmount,
      orderStatus: 'pending',
      paymentMethod: 'cod',
      paymentStatus: 'cod',
      createdAt: new Date().toISOString(),
      updates: [
        {
          _key: generateKey(),
          _type: 'statusUpdate',
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          description: 'Order has been placed successfully with Cash on Delivery'
        }
      ]
    };

    // Create order document using the write client
    const order = await backendClient.create(formattedOrder).catch(error => {
      console.error('Sanity create order error:', error);
      throw new Error(error.message || 'Failed to create order in database');
    });

    return NextResponse.json({
      success: true,
      orderId: order._id,
      orderNumber: order.orderNumber
    });

  } catch (error: any) {
    console.error('Error creating COD order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create order'
      },
      { status: 500 }
    );
  }
} 