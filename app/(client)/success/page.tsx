"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyPaymentStatus } from "@/lib/phonepe";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Check, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import useStore from "@/store";
import { useUser } from "@clerk/nextjs";

export default function SuccessPage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const resetCart = useStore((state) => state.resetCart);
  const { isLoaded, isSignedIn, user } = useUser();
  const orderId = searchParams.get("order_id");
  const paymentMethod = searchParams.get("payment_method");

  useEffect(() => {
    // Wait for auth to load
    if (!isLoaded) return;

    // If no orderId, redirect to cart
    if (!orderId) {
      router.push("/cart");
      return;
    }

    // Only verify if user is signed in
    if (!isSignedIn) {
      setError("Please sign in to view your order");
      setIsVerifying(false);
      return;
    }

    const verifyOrder = async () => {
      try {
        // For COD orders, just reset cart and show success
        if (paymentMethod === "cod") {
          resetCart();
          setIsVerifying(false);
          return;
        }

        // For PhonePe orders, verify payment status
        if (paymentMethod === "phonepe") {
          const response = await fetch(`/api/orders/phonepe/status?merchantTransactionId=${orderId}`);
          const result = await response.json();

          if (result.success) {
            resetCart();
            setIsVerifying(false);
          } else {
            throw new Error(result.error || "Payment verification failed");
          }
        }
      } catch (err: any) {
        console.error("Order verification error:", err);
        setError(err.message || "Failed to verify order");
        setIsVerifying(false);
      }
    };

    verifyOrder();
  }, [isLoaded, isSignedIn, orderId, paymentMethod, router, resetCart]);

  // Show loading while auth is loading
  if (!isLoaded) {
    return (
      <Container>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-shop_dark_green mx-auto" />
            <h2 className="mt-4 text-lg font-semibold">Loading...</h2>
          </div>
        </div>
      </Container>
    );
  }

  // Show verification loading
  if (isVerifying) {
    return (
      <Container>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-shop_dark_green mx-auto" />
            <h2 className="mt-4 text-lg font-semibold">Verifying Order</h2>
            <p className="mt-2 text-gray-500">Please wait while we confirm your order...</p>
          </div>
        </div>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-red-100 rounded-full p-3 w-fit mx-auto">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-red-600">Order Error</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <div className="mt-6 space-y-3">
              {!isSignedIn ? (
                <Button asChild className="w-full">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              ) : (
                <>
                  <Button asChild className="w-full">
                    <Link href="/checkout">Return to Checkout</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/cart">View Cart</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Show success state
  return (
    <Container>
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-green-100 rounded-full p-3 w-fit mx-auto">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-green-600">Order Confirmed!</h2>
          <p className="mt-2 text-gray-600">
            {paymentMethod === "cod" 
              ? "Your order has been placed successfully. You can pay when your order arrives."
              : "Your payment has been processed and order has been confirmed."}
          </p>
          <p className="mt-1 text-sm text-gray-500">Order ID: {orderId}</p>
          <div className="mt-6 space-y-3">
            <Button asChild className="w-full">
              <Link href="/orders">View Orders</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
