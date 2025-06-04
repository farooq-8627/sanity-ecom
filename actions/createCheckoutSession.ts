"use server";

import { initiatePhonePePayment } from "@/lib/phonepe";
import { v4 as uuidv4 } from "uuid";

export interface AddressInfo {
  name: string;
  address: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  phoneNumber: string;
}

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address?: AddressInfo | null;
}

export interface GroupedCartItems {
  product: any;
  quantity: number;
  size?: string;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const orderId = metadata.orderNumber || `ORD-${Date.now()}-${uuidv4().substring(0, 6)}`;
    
    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const paymentRequest = {
      amount: totalAmount,
      orderId: orderId,
      userId: metadata.clerkUserId || 'GUEST',
      userEmail: metadata.customerEmail,
      userName: metadata.customerName,
      callbackUrl: `${baseUrl}/api/webhook/phonepe`,
      redirectUrl: `${baseUrl}/success?order_id=${orderId}`
    };

    const response = await initiatePhonePePayment(paymentRequest);
    
    if (response.success && response.redirectUrl) {
      return response.redirectUrl;
    } else {
      throw new Error("Failed to create payment session");
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}
