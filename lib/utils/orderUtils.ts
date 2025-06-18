import { v4 as uuidv4 } from "uuid";
import { CartItem } from "@/store";
import { UserAddress } from "@/types";
import type { UserResource } from "@clerk/types";

interface OrderDataParams {
  user: UserResource | null;
  selectedAddress: UserAddress | null;
  groupedItems: CartItem[];
  subtotal: number;
  appliedCoupon: {
    code: string;
    discount: number;
  } | null;
  paymentMethod: 'cod' | 'phonepe';
}

export const generateOrderData = ({
  user,
  selectedAddress,
  groupedItems,
  subtotal,
  appliedCoupon,
  paymentMethod
}: OrderDataParams) => {
  if (!selectedAddress) {
    throw new Error("Selected address is required");
  }

  const baseOrderData = {
    orderNumber: `ORD-${Date.now()}-${uuidv4().substring(0, 6)}`,
    customer: {
      name: user?.fullName ?? selectedAddress?.fullName ?? "Unknown",
      email: user?.emailAddresses?.[0]?.emailAddress ?? "Unknown",
      clerkUserId: user?.id
    },
    shippingAddress: {
      name: selectedAddress.fullName ?? "",
      address: selectedAddress.addressLine1 ?? "",
      addressLine2: selectedAddress.addressLine2 ?? "",
      city: selectedAddress.city ?? "",
      state: selectedAddress.state?.title ?? "",
      zip: selectedAddress.pincode ?? "",
      phoneNumber: selectedAddress.phoneNumber ?? "",
    },
    items: groupedItems.map(item => ({
      _type: 'orderItem',
      _key: `item_${item.product._id}_${item.size || 'default'}_${Date.now()}`,
      product: paymentMethod === 'cod' 
        ? {
            _id: item.product._id,
            price: item.product.price
          }
        : {
            _type: 'reference',
            _ref: item.product._id,
          },
      quantity: item.quantity,
      size: item.size,
      ...(paymentMethod === 'phonepe' && { price: item.product.price })
    })),
    totalAmount: subtotal - (appliedCoupon?.discount || 0),
    discountAmount: appliedCoupon?.discount || 0,
    couponCode: appliedCoupon?.code || null,
    paymentStatus: paymentMethod === 'cod' ? "cod" : "pending",
    orderStatus: paymentMethod === 'cod' ? "confirmed" : "pending",
    paymentMethod: paymentMethod,
    ...(paymentMethod === 'phonepe' && {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  };

  return baseOrderData;
}; 