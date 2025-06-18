import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = await currentUser();
    
    if (!session?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { paymentDetails, orderDetails } = await req.json();

    if (!paymentDetails || !orderDetails) {
      return new NextResponse("Invalid request data", { status: 400 });
    }

    const {
      merchantTransactionId,
      transactionId,
      providerReferenceId,
      paymentInstrument
    } = paymentDetails;

    const {
      amount,
      address,
      items,
      couponCode,
      discountAmount
    } = orderDetails;

    // Create order document
    const order = {
      _type: 'order',
      orderNumber: `ORD-${Date.now()}-${uuidv4().substring(0, 6)}`,
      customerName: user?.fullName ?? address?.fullName ?? "Unknown",
      customerEmail: user?.primaryEmailAddress?.emailAddress ?? "Unknown",
      clerkUserId: user?.id,
      address: {
        name: address?.fullName ?? "",
        address: address?.addressLine1 ?? "",
        addressLine2: address?.addressLine2 ?? "",
        city: address?.city ?? "",
        state: address?.state?.title ?? "",
        zip: address?.pincode ?? "",
        phoneNumber: address?.phoneNumber ?? "",
      },
      items: items.map((item: any) => ({
        product: {
          _type: 'reference',
          _ref: item.product._id
        },
        quantity: item.quantity,
        size: item.size,
        price: item.product.price
      })),
      totalAmount: amount,
      discountAmount: discountAmount || 0,
      couponCode: couponCode || null,
      paymentStatus: "paid",
      orderStatus: "confirmed",
      paymentMethod: "phonepe",
      paymentDetails: {
        merchantTransactionId,
        transactionId,
        paymentInstrument: {
          type: paymentInstrument.type,
          accountHolderName: paymentInstrument.accountHolderName,
          accountType: paymentInstrument.accountType,
          cardNetwork: paymentInstrument.cardNetwork,
          upiTransactionId: paymentInstrument.upiTransactionId,
          utr: paymentInstrument.utr
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await backendClient.create(order);

    return NextResponse.json({ 
      success: true, 
      orderId: result._id 
    });
  } catch (error) {
    console.error("Error creating PhonePe order:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to create order" 
      }), 
      { status: 500 }
    );
  }
} 