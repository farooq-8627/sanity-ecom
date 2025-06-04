"use client";

import { useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import Title from "@/components/Title";
import AddressForm from "@/components/address/AddressForm";

export default function AddAddressPage() {
  const searchParams = useSearchParams();
  const isCheckout = searchParams.get("checkout") === "true";

  return (
    <Container>
      <div className="max-w-2xl mx-auto py-8">
        <Title className="mb-6">Add New Address</Title>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <AddressForm isCheckout={isCheckout} />
        </div>
      </div>
    </Container>
  );
} 