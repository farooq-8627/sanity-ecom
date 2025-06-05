"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CreditCard, Wallet, Tag, X } from "lucide-react";
import AddressSelector from "@/components/address/AddressSelector";
import { UserAddress } from "@/types";
import useStore, { CartItem } from "@/store";
import { formatCurrency } from "@/lib/utils";
import PriceFormatter from "@/components/PriceFormatter";
import { v4 as uuidv4 } from "uuid";
import { GroupedCartItems, createCheckoutSession, type Metadata, type AddressInfo } from "@/actions/createCheckoutSession";
import { Product } from "@/sanity/schemas/schema";
import CheckoutSkeleton from "@/components/skeletons/CheckoutSkeleton";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from '@sanity/image-url'
import toast from "react-hot-toast";

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

type PaymentMethod = 'cod' | 'prepaid';

interface AppliedCoupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  value: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const groupedItems = useStore((state) => state.getGroupedItems()) as CartItem[];
  const isEmpty = useStore((state) => state.items.length === 0);
  const subtotal = useStore((state) => state.getTotalPrice());
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('prepaid');
  const resetCart = useStore((state) => state.resetCart);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isCouponLoading, setIsCouponLoading] = useState(false);

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (isLoaded && isEmpty) {
      router.push("/cart");
    }
  }, [isLoaded, isEmpty, router]);

  const handleSelectAddress = (address: UserAddress | null) => {
    setSelectedAddress(address);
    setError(null); // Clear any previous errors
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsCouponLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode,
          cartAmount: subtotal,
          items: groupedItems.map(item => ({
            ...item,
            product: {
              ...item.product,
              category: item.product.categories?.[0] || {
                _ref: "",
                _type: "reference"
              }
            }
          }))
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(data);
      toast.success("Coupon applied successfully!");
      setCouponCode("");
    } catch (error) {
      setError("Failed to apply coupon");
      setAppliedCoupon(null);
    } finally {
      setIsCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setError(null);
  };

  const createCodOrder = async () => {
    try {
      const orderData = {
        orderNumber: `ORD-${Date.now()}-${uuidv4().substring(0, 6)}`,
        customerName: user?.fullName ?? selectedAddress?.fullName ?? "Unknown",
        customerEmail: user?.primaryEmailAddress?.emailAddress ?? "Unknown",
        clerkUserId: user?.id,
        address: {
          name: selectedAddress?.fullName ?? "",
          address: selectedAddress?.addressLine1 ?? "",
          addressLine2: selectedAddress?.addressLine2 ?? "",
          city: selectedAddress?.city ?? "",
          state: selectedAddress?.state?.title ?? "",
          zip: selectedAddress?.pincode ?? "",
          phoneNumber: selectedAddress?.phoneNumber ?? "",
        },
        items: groupedItems.map(item => ({
          _type: 'orderItem',
          _key: `item_${item.product._id}_${item.size || 'default'}_${Date.now()}`,
          product: {
            _id: item.product._id,
            price: item.product.price
          },
          quantity: item.quantity,
          size: item.size
        })),
        totalAmount: subtotal - (appliedCoupon?.discount || 0),
        discountAmount: appliedCoupon?.discount || 0,
        couponCode: appliedCoupon?.code || null,
        paymentStatus: "cod",
        orderStatus: "confirmed",
        paymentMethod: "cod"
      };

      const response = await fetch('/api/orders/cod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create COD order');
      }

      const { orderId } = await response.json();
      resetCart();
      router.push(`/success?order_id=${orderId}&payment_method=cod`);
    } catch (error) {
      console.error('Error creating COD order:', error);
      setError("Failed to create order. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    if (!user) {
      router.push("/sign-in");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      if (paymentMethod === 'cod') {
        await createCodOrder();
        return;
      }

      // Create pending order first
      const orderPayload = {
        orderNumber: `ORD-${Date.now()}-${uuidv4().substring(0, 6)}`,
        customer: {
          name: user?.fullName ?? selectedAddress?.fullName ?? "Unknown",
          email: user?.primaryEmailAddress?.emailAddress ?? "Unknown",
          clerkUserId: user?.id
        },
        shippingAddress: {
          name: selectedAddress?.fullName ?? "",
          address: selectedAddress?.addressLine1 ?? "",
          addressLine2: selectedAddress?.addressLine2 ?? "",
          city: selectedAddress?.city ?? "",
          state: selectedAddress?.state?.title ?? "",
          zip: selectedAddress?.pincode ?? "",
          phoneNumber: selectedAddress?.phoneNumber ?? "",
        },
        items: groupedItems.map(item => ({
          _type: 'orderItem',
          _key: `item_${item.product._id}_${item.size || 'default'}_${Date.now()}`,
          product: {
            _type: 'reference',
            _ref: item.product._id,
          },
          quantity: item.quantity,
          size: item.size,
          price: item.product.price
        })),
        totalAmount: subtotal - (appliedCoupon?.discount || 0),
        discountAmount: appliedCoupon?.discount || 0,
        couponCode: appliedCoupon?.code || null,
        paymentStatus: "pending",
        orderStatus: "pending",
        paymentMethod: "phonepe",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderResult.error || 'Failed to create order');
      }

      if (!orderResult.success || !orderResult.orderId) {
        throw new Error('Invalid order response');
      }

      // Store orderId in localStorage before initiating payment
      localStorage.setItem('pending_order_id', orderResult.orderId);

      // Initiate PhonePe payment
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalAmount,
          orderId: orderResult.orderId
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok) {
        // Remove stored order ID if payment initiation fails
        localStorage.removeItem('pending_order_id');
        throw new Error(paymentResult.error || 'Payment initiation failed');
      }

      if (paymentResult.redirectUrl) {
        window.location.href = paymentResult.redirectUrl;
      } else {
        throw new Error('No redirect URL received');
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      setError(error.message || "An error occurred while processing your order. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!isLoaded || isEmpty) {
    return (
      <Container>
        <CheckoutSkeleton />
      </Container>
    );
  }

  const finalAmount = subtotal - (appliedCoupon?.discount || 0);

  return (
    <Container>
      <div className="py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl font-semibold">Checkout</h1>
          <div className="h-6 w-px bg-gray-200" />
          <p className="text-gray-500">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Address selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <AddressSelector 
                onSelectAddress={handleSelectAddress}
                selectedAddress={selectedAddress}
                showAddButton={true}
                isCheckout={true}
              />
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('prepaid')}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border ${
                    paymentMethod === 'prepaid' 
                      ? 'border-shop_dark_green bg-shop_dark_green/5' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className={paymentMethod === 'prepaid' ? 'text-shop_dark_green' : 'text-gray-500'} />
                    <div className="text-left">
                      <p className="font-medium">Pay Online</p>
                      <p className="text-sm text-gray-500">Pay securely with credit/debit card</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-6 h-6 border-2 rounded-full border-gray-300">
                    {paymentMethod === 'prepaid' && (
                      <div className="w-3 h-3 bg-shop_dark_green rounded-full" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border ${
                    paymentMethod === 'cod' 
                      ? 'border-shop_dark_green bg-shop_dark_green/5' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className={paymentMethod === 'cod' ? 'text-shop_dark_green' : 'text-gray-500'} />
                    <div className="text-left">
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-6 h-6 border-2 rounded-full border-gray-300">
                    {paymentMethod === 'cod' && (
                      <div className="w-3 h-3 bg-shop_dark_green rounded-full" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right column - Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {groupedItems.map((item: CartItem, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                      {item.product.images?.[0] && (
                        <Image
                          src={urlFor(item.product.images[0]).url()}
                          alt={item.product.name || "Product image"}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                            {item.size && ` • Size: ${item.size}`}
                          </p>
                        </div>
                        <PriceFormatter 
                          amount={(item.product.price || 0) * item.quantity} 
                          className="font-medium"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="border-t border-b py-4 mb-4">
                {!appliedCoupon ? (
                  <div className="space-y-2">
                    <p className="font-medium flex items-center gap-2">
                      <Tag size={16} />
                      Apply Coupon
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleApplyCoupon}
                        disabled={isCouponLoading || !couponCode.trim()}
                      >
                        {isCouponLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </div>
                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 p-2 rounded-md">
                    <div>
                      <p className="font-medium text-green-700 flex items-center gap-2">
                        <Tag size={16} />
                        {appliedCoupon.code}
                      </p>
                      <p className="text-sm text-green-600">
                        {appliedCoupon.type === 'percentage' 
                          ? `${appliedCoupon.value}% off`
                          : `₹${appliedCoupon.value} off`
                        }
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <PriceFormatter amount={subtotal} />
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-<PriceFormatter amount={appliedCoupon.discount} /></span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">Free</span>
                </div>

                <div className="flex justify-between font-semibold text-lg border-t pt-3">
                  <span>Total</span>
                  <PriceFormatter amount={finalAmount} className="text-lg" />
                </div>
              </div>

              {/* {error && !appliedCoupon && (
                <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
                  {error}
                </div>
              )} */}

              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={handleCheckout}
                disabled={isProcessing || !selectedAddress}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'
                )}
              </Button>

              {!selectedAddress && (
                <p className="text-sm text-gray-500 mt-3 text-center">
                  Please select a delivery address to continue
                </p>
              )}

              <p className="text-xs text-gray-500 mt-4 text-center">
                By proceeding, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}