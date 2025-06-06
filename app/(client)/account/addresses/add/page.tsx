"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import Title from "@/components/Title";
import AddressForm from "@/components/address/AddressForm";

const AddAddressPage = () => {
  return (
    <Container>
      <div className="max-w-2xl mx-auto py-8">
        <Title className="mb-6">Add New Address</Title>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <Suspense>
            <AddAddressForm />
          </Suspense>
        </div>
      </div>
    </Container>
  );
};

const AddAddressForm = () => {
  const searchParams = useSearchParams();
  const isCheckout = searchParams.get("checkout") === "true";
  
  return <AddressForm isCheckout={isCheckout} />;
};

export default AddAddressPage; 