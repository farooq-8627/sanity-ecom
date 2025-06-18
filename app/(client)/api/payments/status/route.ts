import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { checkPaymentStatus } from '@/lib/phonepe';
import { backendClient } from '@/sanity/lib/backendClient';

export async function GET(req: Request) {
  let transactionId: string | null = null;
  
  try {
    const session = await auth();
    if (!session?.userId) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const { searchParams } = new URL(req.url);
    transactionId = searchParams.get("transactionId");

    if (!transactionId) {
      return new NextResponse(
        JSON.stringify({ error: "Transaction ID is required" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Get payment status from PhonePe
    const paymentStatus = await checkPaymentStatus(transactionId);
    console.log('Payment status response:', paymentStatus); // Debug log

    if (!paymentStatus.success) {
      // Find order by transaction ID
      const order = await backendClient.fetch(
        `*[_type == "order" && paymentDetails.merchantTransactionId == $transactionId][0]`,
        { transactionId }
      );

      if (order) {
        // Update order status based on error code
        if (paymentStatus.code === 'PAYMENT_ERROR' || paymentStatus.code === 'PAYMENT_DECLINED') {
          await backendClient
            .patch(order._id)
            .set({
              paymentStatus: 'failed',
              orderStatus: 'cancelled',
              updatedAt: new Date().toISOString()
            })
            .commit();
        }
      }

      return new NextResponse(
        JSON.stringify({
          success: false,
          error: paymentStatus.error,
          code: paymentStatus.code
        }), 
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Find order by transaction ID
    const order = await backendClient.fetch(
      `*[_type == "order" && paymentDetails.merchantTransactionId == $transactionId][0]`,
      { transactionId }
    );

    if (!order) {
      throw new Error("Order not found");
    }

    // Update order with successful payment details
    await backendClient
      .patch(order._id)
      .set({
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        paymentDetails: {
          merchantTransactionId: paymentStatus.data.merchantTransactionId,
          transactionId: paymentStatus.data.transactionId,
          paymentInstrument: {
            type: paymentStatus.data.paymentInstrument.type,
            accountHolderName: paymentStatus.data.paymentInstrument.accountHolderName,
            accountType: paymentStatus.data.paymentInstrument.accountType,
            cardNetwork: paymentStatus.data.paymentInstrument.cardNetwork,
            upiTransactionId: paymentStatus.data.paymentInstrument.upiTransactionId,
            utr: paymentStatus.data.paymentInstrument.utr
          }
        },
        updatedAt: new Date().toISOString()
      })
      .commit();

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: paymentStatus.data
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error: any) {
    console.error("[PAYMENT_STATUS_ERROR]", error);
    
    // Try to update order status if possible
    try {
      if (transactionId) {
        const order = await backendClient.fetch(
          `*[_type == "order" && paymentDetails.merchantTransactionId == $transactionId][0]`,
          { transactionId }
        );

        if (order) {
          await backendClient
            .patch(order._id)
            .set({
              paymentStatus: 'failed',
              orderStatus: 'cancelled',
              updatedAt: new Date().toISOString()
            })
            .commit();
        }
      }
    } catch (updateError) {
      console.error("[ORDER_UPDATE_ERROR]", updateError);
    }

    return new NextResponse(
      JSON.stringify({ 
        error: error.message || "Internal server error",
        code: error.code || 'UNKNOWN_ERROR'
      }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
} 