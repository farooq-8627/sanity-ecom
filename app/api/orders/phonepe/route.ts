import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import crypto from 'crypto';
import { auth } from "@clerk/nextjs/server";

const SALT_KEY = process.env.PHONEPE_SALT_KEY!;
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID!;

// POST /api/orders/phonepe - Initiate PhonePe payment
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orderData = await req.json();
    
    // Create order document first with pending status
    const orderDoc = {
      _type: 'order',
      orderNumber: `ORD-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
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
      paymentMethod: 'phonepe',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      phonepeDetails: {
        _type: 'phonepePayment',
        merchantTransactionId: null,
        providerReferenceId: null,
        paymentState: 'PENDING',
        payResponseCode: null
      }
    };

    // Save initial order to Sanity
    const order = await client.create(orderDoc);

    // Prepare PhonePe payment request
    const paymentData = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: order.orderNumber,
      merchantUserId: orderData.clerkUserId,
      amount: orderData.totalAmount * 100, // Convert to paise
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/success?order_id=${order.orderNumber}&payment_method=phonepe`,
      redirectMode: 'REDIRECT',
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/phonepe`,
      mobileNumber: orderData.address.phoneNumber,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    // Convert to base64
    const base64PaymentData = Buffer.from(JSON.stringify(paymentData)).toString('base64');
    
    // Generate checksum
    const string = base64PaymentData + "/pg/v1/pay" + SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###1";

    // Make request to PhonePe
    const response = await fetch('https://api.phonepe.com/apis/hermes/pg/v1/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      body: JSON.stringify({
        request: base64PaymentData
      })
    });

    const responseData = await response.json();

    if (responseData.success) {
      // Update order with PhonePe merchantTransactionId
      await client
        .patch(order._id)
        .set({
          'phonepeDetails.merchantTransactionId': order.orderNumber
        })
        .commit();

      return NextResponse.json({
        success: true,
        orderId: order.orderNumber,
        redirectUrl: responseData.data.instrumentResponse.redirectInfo.url
      });
    } else {
      throw new Error(responseData.message || 'Payment initiation failed');
    }

  } catch (error) {
    console.error('Error initiating PhonePe payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}

// GET /api/orders/phonepe/status - Check payment status
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const merchantTransactionId = searchParams.get('merchantTransactionId');

    if (!merchantTransactionId) {
      throw new Error('Missing merchantTransactionId');
    }

    // Generate checksum for status check
    const string = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}${SALT_KEY}`;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###1";

    // Check payment status with PhonePe
    const response = await fetch(
      `https://api.phonepe.com/apis/hermes/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': MERCHANT_ID
        }
      }
    );

    const responseData = await response.json();

    if (responseData.success) {
      // Update order status in Sanity
      const order = await client
        .patch(`order-${merchantTransactionId}`)
        .set({
          'phonepeDetails.paymentState': responseData.data.paymentState,
          'phonepeDetails.payResponseCode': responseData.data.payResponseCode,
          'phonepeDetails.providerReferenceId': responseData.data.providerReferenceId,
          'paymentStatus': responseData.data.paymentState === 'COMPLETED' ? 'paid' : 'failed',
          'orderStatus': responseData.data.paymentState === 'COMPLETED' ? 'packed' : 'pending',
          'updates': responseData.data.paymentState === 'COMPLETED' ? [{
            status: 'Order Placed',
            timestamp: new Date().toISOString(),
            description: 'Order has been placed successfully'
          }] : undefined
        })
        .commit();

      return NextResponse.json({
        success: true,
        status: responseData.data.paymentState,
        orderId: order.orderNumber
      });
    } else {
      throw new Error(responseData.message || 'Failed to check payment status');
    }

  } catch (error) {
    console.error('Error checking PhonePe payment status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
} 