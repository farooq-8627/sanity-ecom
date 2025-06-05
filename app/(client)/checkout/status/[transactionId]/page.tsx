"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import useStore from "@/store";

export default function CheckoutStatusPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resetCart = useStore((state) => state.resetCart);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  useEffect(() => {
    const updateOrderStatus = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get transaction ID from URL params
        const transactionId = params.transactionId as string;
        if (!transactionId) {
          throw new Error("Transaction ID not found");
        }

        // Check payment status
        const response = await fetch(`/api/payments/status?transactionId=${transactionId}`);
        const data = await response.json();
        console.log('Payment status response:', data); // Debug log

        if (!response.ok) {
          // If payment is still pending and we haven't exceeded retries
          if (data.code === 'PAYMENT_PENDING' && retryCount < MAX_RETRIES) {
            setRetryCount(prev => prev + 1);
            setTimeout(updateOrderStatus, RETRY_DELAY);
            return;
          }

          throw new Error(data.error || "Payment verification failed");
        }

        if (data.success) {
          // Clear stored order ID
          localStorage.removeItem('pending_order_id');
          
          setIsSuccess(true);
          resetCart();
        } else {
          throw new Error(data.error || "Payment verification failed");
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        setError(error.message || "An error occurred while processing your payment");
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure params are available
    setTimeout(updateOrderStatus, 1000);
  }, [resetCart, retryCount, params.transactionId]);

  const handleTryAgain = () => {
    // Clear any stale data
    localStorage.removeItem('pending_order_id');
    router.push('/checkout');
  };

  const handleViewOrders = () => {
    router.push('/orders');
  };

  return (
    <Container>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-sm">
          {isLoading ? (
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-shop_dark_green mx-auto" />
              <h2 className="mt-4 text-lg font-medium">Processing Payment</h2>
              <p className="mt-2 text-gray-500">
                Please wait while we verify your payment...
              </p>
            </div>
          ) : isSuccess ? (
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="mt-4 text-lg font-medium text-green-600">
                Payment Successful!
              </h2>
              <p className="mt-2 text-gray-600">
                Thank you for your order. We'll start processing it right away.
              </p>
              <Button
                className="mt-6 w-full"
                onClick={handleViewOrders}
              >
                View Orders
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="mt-4 text-lg font-medium text-red-600">
                Payment Failed
              </h2>
              <p className="mt-2 text-gray-600">
                {error || "Something went wrong with your payment."}
              </p>
              <Button
                className="mt-6 w-full"
                onClick={handleTryAgain}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
} 