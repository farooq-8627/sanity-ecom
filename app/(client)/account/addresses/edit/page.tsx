"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/components/Container";
import Title from "@/components/Title";
import AddressForm from "@/components/address/AddressForm";
import { UserAddress } from "@/types";
import { Loader2 } from "lucide-react";

const EditAddressPage = () => {
  return (
    <Container>
      <div className="max-w-2xl mx-auto py-8">
        <Title className="mb-6">Edit Address</Title>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <Suspense 
            fallback={
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span>Loading address details...</span>
              </div>
            }
          >
            <EditAddressForm />
          </Suspense>
        </div>
      </div>
    </Container>
  );
};

const EditAddressForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const addressId = searchParams.get("id");
  const isCheckout = searchParams.get("checkout") === "true";
  
  const [address, setAddress] = useState<UserAddress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!addressId) {
      router.push("/account/addresses");
      return;
    }

    const fetchAddress = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/addresses`);
        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }
        
        const data = await response.json();
        const foundAddress = data.addresses.find((addr: UserAddress) => addr._key === addressId);
        
        if (!foundAddress) {
          setError("Address not found. It may have been deleted.");
          return;
        }
        
        setAddress(foundAddress);
      } catch (error) {
        console.error("Error fetching address:", error);
        setError("Could not load the address. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddress();
  }, [addressId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span>Loading address details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => router.push("/account/addresses")}
          className="text-shop_dark_green hover:underline"
        >
          Back to Addresses
        </button>
      </div>
    );
  }

  return address && <AddressForm address={address} isCheckout={isCheckout} />;
};

export default EditAddressPage; 