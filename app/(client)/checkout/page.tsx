"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import AddressSelector from "@/components/address/AddressSelector";
import { UserAddress } from "@/sanity.types";
import useStore from "@/store";
import { formatCurrency } from "@/lib/utils";
import PriceFormatter from "@/components/PriceFormatter";
import { v4 as uuidv4 } from "uuid";
import { GroupedCartItems, createCheckoutSession, Metadata, AddressInfo } from "@/actions/createCheckoutSession";
import { Product } from "@/sanity.types";
import CheckoutSkeleton from "@/components/skeletons/CheckoutSkeleton";

interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
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
      // Format items for checkout session
      const checkoutItems = groupedItems.map((item: CartItem): GroupedCartItems => ({
        product: item.product,
        quantity: item.quantity,
        size: item.size,
      }));

      // Create metadata for the order
      const metadata: Metadata = {
        orderNumber: `ORD-${Date.now()}-${uuidv4().substring(0, 6)}`,
        customerName: user.fullName ?? selectedAddress.fullName ?? "Unknown",
        customerEmail: user.primaryEmailAddress?.emailAddress ?? "Unknown",
        clerkUserId: user.id,
        address: {
          name: selectedAddress.fullName ?? "",
          address: selectedAddress.addressLine1 ?? "",
          addressLine2: selectedAddress.addressLine2 ?? "",
          city: selectedAddress.city ?? "",
          state: selectedAddress.state ?? "",
          zip: selectedAddress.pincode ?? "",
          phoneNumber: selectedAddress.phoneNumber ?? "",
        } as AddressInfo,
      };

      // Create checkout session
      const checkoutUrl = await createCheckoutSession(checkoutItems, metadata);
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setError("An error occurred while processing your order. Please try again.");
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
                selectedAddressId={selectedAddress?._id}
              />
            </div>
          </div>

          {/* Right column - Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {groupedItems.map((item: CartItem, index: number) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.quantity}×</span>
                      <span>{item.product.name}</span>
                      {item.size && (
                        <span className="text-gray-500">({item.size})</span>
                      )}
                    </div>
                    <PriceFormatter amount={(item.product.price || 0) * item.quantity} />
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <PriceFormatter amount={subtotal} />
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">Free</span>
                </div>

                <div className="flex justify-between font-semibold text-lg border-t pt-3">
                  <span>Total</span>
                  <PriceFormatter amount={subtotal} className="text-lg" />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
                  {error}
                </div>
              )}

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
                  'Proceed to Payment'
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