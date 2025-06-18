import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';
import { generateChecksum } from '@/lib/phonepe';

export async function POST(req: Request) {
  const startTime = Date.now();
  console.log('[PhonePe Callback] Starting payment callback processing');
  
  try {
    const body = await req.json();
    
    // Verify the response signature
    const { response, merchantId, transactionId } = body;
    const checksum = generateChecksum(response, `/pg/v1/status/${merchantId}/${transactionId}`);
    
    // Enhanced logging for debugging
    console.log('[PhonePe Callback] Request details:', {
      timestamp: new Date().toISOString(),
      body,
      checksum,
      headers: Object.fromEntries(req.headers),
      environment: process.env.NODE_ENV
    });

    // Decode and parse the response
    const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString());
    console.log('[PhonePe Callback] Decoded response:', decodedResponse);
    
    // Find the order using merchantTransactionId
    const order = await backendClient.fetch(
      `*[_type == "order" && paymentDetails.merchantTransactionId == $transactionId][0]`,
      { transactionId }
    );

    if (!order) {
      console.error('[PhonePe Callback] Order not found:', {
        transactionId,
        timestamp: new Date().toISOString()
      });
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Order not found' }),
        { status: 404 }
      );
    }

    console.log('[PhonePe Callback] Found order:', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.paymentStatus
    });

    // Update order based on payment status
    const { code, data } = decodedResponse;
    
    const updateData = {
      updatedAt: new Date().toISOString(),
      'paymentDetails.transactionId': data.transactionId,
      'paymentDetails.paymentInstrument': {
        type: data.paymentInstrument.type,
        cardNetwork: data.paymentInstrument.cardNetwork,
        accountHolderName: data.paymentInstrument.accountHolderName,
        accountType: data.paymentInstrument.accountType,
        upiTransactionId: data.paymentInstrument.upiTransactionId,
        utr: data.paymentInstrument.utr
      }
    };

    if (code === 'PAYMENT_SUCCESS') {
      Object.assign(updateData, {
        paymentStatus: 'paid',
        orderStatus: 'confirmed'
      });
      console.log('[PhonePe Callback] Payment successful:', {
        orderId: order._id,
        transactionId,
        amount: data.amount
      });
    } else if (code === 'PAYMENT_ERROR' || code === 'PAYMENT_DECLINED') {
      Object.assign(updateData, {
        paymentStatus: 'failed',
        orderStatus: 'cancelled'
      });
      console.log('[PhonePe Callback] Payment failed:', {
        orderId: order._id,
        transactionId,
        code,
        reason: data.error?.description || 'Unknown error'
      });
    }

    await backendClient
      .patch(order._id)
      .set(updateData)
      .commit();

    const processingTime = Date.now() - startTime;
    console.log('[PhonePe Callback] Processing completed:', {
      processingTime: `${processingTime}ms`,
      status: 'success'
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    console.error('[PhonePe Callback] Error:', {
      message: error.message,
      processingTime: `${processingTime}ms`,
      stack: error.stack,
      name: error.name
    });
    
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500 }
    );
  }
} 