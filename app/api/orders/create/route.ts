import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { auth } from "@clerk/nextjs/server";
import { nanoid } from 'nanoid';

const validateOrderData = (body: any) => {
  try {
    // Check for required top-level fields
    const required = [
      'orderNumber',
      'items',
      'totalAmount',
      'paymentStatus',
      'address'
    ];

    const missing = required.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return {
        error: `Missing required fields: ${missing.join(', ')}`,
        details: { missingFields: missing }
      };
    }

    // Validate items array
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return {
        error: 'Order must have at least one item',
        details: { items: body.items }
      };
    }

    // Validate address fields
    const addressRequired = ['name', 'address', 'city', 'state', 'zip', 'phoneNumber'];
    const missingAddress = addressRequired.filter(field => !body.address[field]);
    
    if (missingAddress.length > 0) {
      return {
        error: `Missing address fields: ${missingAddress.join(', ')}`,
        details: { missingAddress }
      };
    }

    // Validate payment status
    if (!['paid', 'cod'].includes(body.paymentStatus)) {
      return {
        error: 'Invalid payment status',
        details: { paymentStatus: body.paymentStatus }
      };
    }

    return null;
  } catch (err: any) {
    return {
      error: 'Validation error',
      details: err.message
    };
  }
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Unauthorized",
          details: "User authentication required"
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("Received order request:", JSON.stringify(body, null, 2));
    
    // Validate request body
    const validationError = validateOrderData(body);
    if (validationError) {
      console.error("Validation error:", validationError);
      return NextResponse.json(
        { 
          success: false, 
          error: validationError.error,
          details: validationError.details
        },
        { status: 400 }
      );
    }

    const {
      orderNumber,
      items,
      totalAmount,
      paymentStatus,
      customerName,
      customerEmail,
      address
    } = body;

    // Create order document matching the schema of successful orders
    const orderDoc = {
      _type: "order",
      orderNumber,
      customer: {
        name: customerName,
        email: customerEmail,
        clerkUserId: userId
      },
      items: items.map((item: any) => ({
        _type: "orderItem",
        _key: nanoid(),
        product: {
          _type: "reference",
          _ref: item.product._id
        },
        quantity: item.quantity,
        size: item.size || null,
        price: item.product.price
      })),
      shippingAddress: {
        name: address.name,
        address: address.address,
        addressLine2: address.addressLine2 || "",
        city: address.city,
        state: address.state,
        zip: address.zip,
        phoneNumber: address.phoneNumber
      },
      totalAmount,
      paymentStatus,
      paymentMethod: paymentStatus === 'cod' ? 'cod' : 'stripe',
      orderStatus: "processing",
      createdAt: new Date().toISOString()
    };

    console.log("Creating order document:", JSON.stringify(orderDoc, null, 2));

    const order = await client.create(orderDoc);
    console.log("Order created successfully:", order._id);

    return NextResponse.json({ 
      success: true, 
      orderId: order._id 
    });
  } catch (error: any) {
    console.error("Order creation error:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      details: error.details || error.response?.data
    });

    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create order",
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 