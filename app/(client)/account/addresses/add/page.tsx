"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import Title from "@/components/Title";
import AddressForm from "@/components/address/AddressForm";
import AddressFormSkeleton from "@/components/skeletons/AddressFormSkeleton";

export default function AddAddressPage() {
  const searchParams = useSearchParams();
  const isCheckout = searchParams.get("checkout") === "true";
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for a smoother transition
  setTimeout(() => setIsLoading(false), 500);

  if (isLoading) {
    return (
      <Container>
        <div className="max-w-4xl mx-auto py-8">
          <Title>Add New Address</Title>
          <div className="mt-8 bg-white shadow-sm rounded-lg p-6">
            <AddressFormSkeleton />
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8">
        <Title>Add New Address</Title>
        <div className="mt-8 bg-white shadow-sm rounded-lg p-6">
          <AddressForm isCheckout={isCheckout} />
        </div>
      </div>
    </Container>
  );
} 