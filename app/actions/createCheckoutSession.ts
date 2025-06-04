import { Product } from "@/sanity.types";

export interface GroupedCartItems {
  product: Product;
  quantity: number;
  size?: string;
}

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
  clerkUserId: string;
  address: AddressInfo;
  discountAmount?: number;
  couponCode?: string | null;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata
) {
  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items, metadata }),
    });

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return null;
  }
} 