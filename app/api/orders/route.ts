import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { v4 as uuidv4 } from "uuid";

// Common order schema for both COD and PhonePe
const createOrderDocument = (orderData: any, paymentMethod: 'cod' | 'phonepe') => {
  const baseOrder = {
    _type: 'order',
    orderNumber: orderData.orderNumber,
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    clerkUserId: orderData.clerkUserId,
    address: {
      _type: 'address',
      ...orderData.address
    },
    items: orderData.items.map((item: any) => ({
      _type: 'orderItem',
      product: {
        _type: 'reference',
        _ref: item.product._id
      },
      quantity: item.quantity,
      size: item.size,
      price: item.product.price
    })),
    totalAmount: orderData.totalAmount,
    orderStatus: 'pending',
    createdAt: new Date().toISOString(),
  };

  // Add payment specific fields
  if (paymentMethod === 'phonepe') {
    return {
      ...baseOrder,
      paymentMethod: 'phonepe',
      paymentStatus: 'pending',
      phonepeDetails: {
        _type: 'phonepePayment',
        merchantTransactionId: orderData.orderNumber,
        providerReferenceId: null, // Will be updated after payment
        paymentState: 'PENDING',
        payResponseCode: null
      }
    };
  }

  return {
    ...baseOrder,
    paymentMethod: 'cod',
    paymentStatus: 'cod'
  };
};

// POST /api/orders/cod - Create COD order
export async function POST(req: Request) {
  try {
    const orderData = await req.json();
    
    // Create order document for COD
    const orderDoc = createOrderDocument(orderData, 'cod');

    // Save to Sanity
    const result = await client.create(orderDoc);

    return NextResponse.json({
      success: true,
      orderId: result.orderNumber
    });

  } catch (error) {
    console.error('Error creating COD order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/phonepe - Update PhonePe order after payment
export async function PUT(req: Request) {
  try {
    const { 
      orderNumber,
      providerReferenceId,
      paymentState,
      payResponseCode 
    } = await req.json();

    // Update order with PhonePe payment details
    const result = await client
      .patch(`order-${orderNumber}`)
      .set({
        'phonepeDetails.providerReferenceId': providerReferenceId,
        'phonepeDetails.paymentState': paymentState,
        'phonepeDetails.payResponseCode': payResponseCode,
        'paymentStatus': paymentState === 'COMPLETED' ? 'paid' : 'failed'
      })
      .commit();

    return NextResponse.json({
      success: true,
      orderId: result.orderNumber
    });

  } catch (error) {
    console.error('Error updating PhonePe order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
} 