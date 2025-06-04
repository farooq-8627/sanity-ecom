import { NextResponse } from "next/server";
import { verifyPaymentStatus } from "@/lib/phonepe";
import { headers } from "next/headers";
import { createHash } from "crypto";

const SALT_KEY = process.env.PHONEPE_SALT_KEY!;
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID!;

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const xVerify = headersList.get("X-VERIFY");
    
    if (!xVerify) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const payload = body.response;

    // Verify the callback signature
    const string = payload + "/pg/v1/status/" + MERCHANT_ID + SALT_KEY;
    const sha256 = createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###1";

    if (checksum !== xVerify) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    // Verify payment status
    const merchantTransactionId = body.merchantTransactionId;
    const status = await verifyPaymentStatus(merchantTransactionId);

    if (status.success) {
      // Payment successful - update your database here
      // You can access order details from status.data
      
      return new NextResponse(JSON.stringify({
        success: true,
        message: "Payment successful"
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Payment failed
      return new NextResponse(JSON.stringify({
        success: false,
        message: "Payment failed"
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error("PhonePe webhook error:", error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: "Internal server error"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 