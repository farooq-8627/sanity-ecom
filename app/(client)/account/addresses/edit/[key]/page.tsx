"use client";

import { useState, useEffect, use } from "react";
import Container from "@/components/Container";
import Title from "@/components/Title";
import AddressForm from "@/components/address/AddressForm";
import { UserAddress } from "@/types";
import AddressFormSkeleton from "@/components/skeletons/AddressFormSkeleton";

export default function EditAddressPage({ params }: { params: Promise<{ key: string }> }) {
  const resolvedParams = use(params);
  const [address, setAddress] = useState<UserAddress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch("/api/addresses");
        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }
        const data = await response.json();
        const foundAddress = data.addresses.find((addr: any) => addr._key === resolvedParams.key);
        
        if (!foundAddress) {
          throw new Error("Address not found");
        }
        
        // Transform the address to match the UserAddress type
        const transformedAddress: UserAddress = {
          _key: foundAddress._key,
          addressName: foundAddress.addressName,
          fullName: foundAddress.fullName,
          phoneNumber: foundAddress.phoneNumber,
          addressLine1: foundAddress.addressLine1,
          addressLine2: foundAddress.addressLine2 || "",
          city: foundAddress.city,
          state: {
            code: foundAddress.state.code,
            title: foundAddress.state.title
          },
          pincode: foundAddress.pincode,
          isDefault: foundAddress.isDefault || false
        };
        
        setAddress(transformedAddress);
      } catch (error) {
        console.error("Error fetching address:", error);
        setError("Could not load the address. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddress();
  }, [resolvedParams.key]);

  if (isLoading) {
    return (
      <Container>
        <div className="max-w-4xl mx-auto py-8">
          <Title>Edit Address</Title>
          <div className="mt-8 bg-white shadow-sm rounded-lg p-6">
            <AddressFormSkeleton />
          </div>
        </div>
      </Container>
    );
  }

  if (error || !address) {
    return (
      <Container>
        <div className="max-w-4xl mx-auto py-16">
          <div className="bg-red-50 p-4 rounded-lg text-red-500">
            {error || "Address not found"}
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8">
        <Title>Edit Address</Title>
        <div className="mt-8 bg-white shadow-sm rounded-lg p-6">
          <AddressForm address={address} />
        </div>
      </div>
    </Container>
  );
} 