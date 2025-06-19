import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { initiatePhonePePayment, generateTransactionId } from '@/lib/phonepe';
import { backendClient } from '@/sanity/lib/backendClient';

type PhonePeSuccessResponse = {
  success: true;
  data: {
    instrumentResponse: {
      redirectInfo: {
        url: string;
      };
    };
  };
};

type PhonePeErrorResponse = {
  success: false;
  error: string;
  code: string;
};

type PhonePeResponse = PhonePeSuccessResponse | PhonePeErrorResponse;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { amount, orderId } = await req.json();

    if (!amount || !orderId) {
      return new NextResponse(
        JSON.stringify({ error: "Amount and order ID are required" }), 
        { status: 400 }
      );
    }

    // Verify order exists and is in pending state
    const order = await backendClient.fetch(
      `*[_type == "order" && _id == $orderId && paymentStatus == "pending"][0]`,
      { orderId }
    );

    if (!order) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid or expired order" }), 
        { status: 400 }
      );
    }

    // Generate a unique transaction ID
    const transactionId = generateTransactionId();

    // Update order with transaction ID
    await backendClient
      .patch(orderId)
      .set({
        'paymentDetails.merchantTransactionId': transactionId,
        updatedAt: new Date().toISOString()
      })
      .commit();

    // Initiate payment with PhonePe
    const paymentResponse = await initiatePhonePePayment(
      amount,
      transactionId,
      session.userId
    ) as PhonePeResponse;

    if (!paymentResponse.success) {
      // Update order status to failed
      await backendClient
        .patch(orderId)
        .set({
          paymentStatus: 'failed',
          orderStatus: 'cancelled',
          updatedAt: new Date().toISOString()
        })
        .commit();

      return new NextResponse(
        JSON.stringify({ 
          error: paymentResponse.error || "Payment initiation failed",
          code: paymentResponse.code || 'UNKNOWN_ERROR'
        }), 
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      redirectUrl: paymentResponse.data.instrumentResponse.redirectInfo.url,
      transactionId
    });
  } catch (error: any) {
    console.error('[PAYMENT_INITIATION_ERROR]', error);
    return new NextResponse(
      JSON.stringify({ 
        error: error.message || "Payment initiation failed",
        code: error.code || 'UNKNOWN_ERROR'
      }), 
      { status: 500 }
    );
  }
} 