"use client";

import Container from "@/components/Container";
import useStore from "@/store";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function TestOrderPage() {
  const { items, resetCart } = useStore();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleCreateTestOrder = async () => {
    if (!user || items.length === 0) {
      toast.error("You must be signed in and have items in your cart");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/test-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: items,
          userData: {
            name: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
            userId: user.id,
          },
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Test order created successfully!");
        resetCart();
        router.push("/orders");
      } else {
        toast.error(data.error || "Failed to create test order");
      }
    } catch (error) {
      console.error("Error creating test order:", error);
      toast.error("An error occurred while creating the test order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="max-w-2xl mx-auto py-12">
        <h1 className="text-2xl font-bold mb-6">Test Order Creation</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Cart Items ({items.length})</h2>
          
          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.product.name}</span>
                    {item.size && (
                      <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">
                        Size: {item.size}
                      </span>
                    )}
                    <span className="ml-2 text-gray-500">× {item.quantity}</span>
                  </div>
                  <span>${(item.product.price || 0) * item.quantity}</span>
                </li>
              ))}
            </ul>
          )}
          
          {items.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
              <span className="font-bold">Total:</span>
              <span className="font-bold">
                ${items.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-4">
          <Button
            onClick={handleCreateTestOrder}
            disabled={loading || items.length === 0}
            className="bg-shop_dark_green hover:bg-shop_light_green"
          >
            {loading ? "Creating..." : "Create Test Order"}
          </Button>
          
          <Button
            onClick={() => router.push("/cart")}
            variant="outline"
          >
            Back to Cart
          </Button>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-semibold text-yellow-800">Note:</h3>
          <p className="text-sm text-yellow-700">
            This page creates test orders directly in Sanity without going through Stripe.
            Use this for testing your order functionality without requiring HTTPS webhooks.
          </p>
        </div>
      </div>
    </Container>
  );
} 