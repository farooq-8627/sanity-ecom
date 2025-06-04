"use server";

import stripe from "@/lib/stripe";
import { Address } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "@/store";
import Stripe from "stripe";

export interface AddressInfo {
  name: string;
  address: string;
  addressLine2: string;
  city: string;
  state: {
    code: string;
    title: string;
  };
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
  product: CartItem["product"];
  quantity: number;
  size?: string;
}

function getImageUrl(image: any): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  if (image.url) return image.url;
  try {
    return urlFor(image).url();
  } catch (error) {
    console.error('Error generating image URL:', error);
    return '';
  }
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata
) {
  try {
    // Retrieve existing customer or create a new one
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });
    const customerId = customers?.data?.length > 0 ? customers.data[0].id : "";

    // Use environment variable or fallback to localhost
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      metadata: {
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        clerkUserId: metadata.clerkUserId!,
        address: JSON.stringify(metadata.address),
      },
      mode: "payment",
      allow_promotion_codes: true,
      payment_method_types: ["card"],
      invoice_creation: {
        enabled: true,
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${baseUrl}/cart`,
      line_items: items?.map((item) => ({
        price_data: {
          currency: "INR",
          unit_amount: Math.round(item?.product?.price! * 100),
          product_data: {
            name: item?.product?.name || "Unknown Product",
            description: item?.product?.description,
            metadata: { 
              id: item?.product?._id,
              size: item?.size || ""
            },
            images:
              item?.product?.images && item?.product?.images?.length > 0
                ? [getImageUrl(item?.product?.images[0])]
                : undefined,
          },
        },
        quantity: item?.quantity,
      })),
    };
    if (customerId) {
      sessionPayload.customer = customerId;
    } else {
      sessionPayload.customer_email = metadata.customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);
    return session.url;
  } catch (error) {
    console.error("Error creating Checkout Session", error);
    throw error;
  }
}
