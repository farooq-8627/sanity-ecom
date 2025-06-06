"use client";

import React, { useEffect, useState } from "react";
import { UserAddress } from "@/types";
import AddressCard from "./AddressCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddressSelectorSkeleton from "@/components/skeletons/AddressSelectorSkeleton";
import { Plus } from "lucide-react";

interface AddressSelectorProps {
  onSelectAddress: (address: UserAddress | null) => void;
  selectedAddress?: UserAddress | null;
  showAddButton?: boolean;
  isCheckout?: boolean;
}

export function AddressSelector({
  onSelectAddress,
  selectedAddress,
  showAddButton = true,
  isCheckout = false,
}: AddressSelectorProps) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddressKey, setSelectedAddressKey] = useState<string | null>(
    selectedAddress?._key || null
  );

    const fetchAddresses = async () => {
    try {
      setIsLoading(true);
        const response = await fetch("/api/addresses");
      
        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }

        const data = await response.json();
        setAddresses(data.addresses || []);
        
      } catch (error) {
        console.error("Error fetching addresses:", error);
      setError("Failed to load addresses");
      } finally {
        setIsLoading(false);
      }
    };

  // Only fetch addresses on initial mount
  useEffect(() => {
    fetchAddresses();
  }, []); // Empty dependency array means this only runs once on mount

  const handleDeleteAddress = async (addressKey: string) => {
    try {
      const response = await fetch(`/api/addresses?key=${addressKey}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete address");
      }

      // Update local state instead of fetching again
      const updatedAddresses = addresses.filter(addr => addr._key !== addressKey);
      setAddresses(updatedAddresses);

      // If the deleted address was selected, select a new default
      if (selectedAddressKey === addressKey) {
        const newDefaultAddress = updatedAddresses.find(addr => addr.isDefault) 
          || updatedAddresses[0];
        onSelectAddress(newDefaultAddress || null);
        setSelectedAddressKey(newDefaultAddress?._key || null);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      setError(error instanceof Error ? error.message : "Failed to delete address");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSelectAddress = (address: UserAddress) => {
    setSelectedAddressKey(address._key);
    onSelectAddress(address);
  };

  if (isLoading) {
    return <AddressSelectorSkeleton />;
  }

  if (error) {
    return (
      <div className="py-6 text-center">
        <p className="text-red-500">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()} 
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showAddButton && (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">Select Delivery Address</h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose an address for delivery or add a new one
          </p>
        </div>
        <Button 
          onClick={() => router.push(`/account/addresses/add?${isCheckout ? "checkout=true" : ""}`)}
          className="flex items-center gap-2 w-full md:w-auto bg-shop_dark_green/80 text-white hover:bg-shop_dark_green"
          size="default"
        >
          <Plus className="h-5 w-5" />
          Add New Address
        </Button>
      </div>
      )}
      {addresses.length === 0 && (
        <div className="text-center py-12 md:py-16 px-4 border rounded-lg border-dashed bg-gray-50">
          <div className="max-w-sm mx-auto">
            <p className="text-gray-600 mb-4">You don't have any saved addresses yet. Add a new address to get started.</p>
          </div>
        </div>
      )}
        <div className="grid gap-4">
          {addresses.map((address) => (
            <AddressCard
            key={address._key}
              address={address}
              isSelectable
            isSelected={selectedAddressKey === address._key}
            onSelect={() => handleSelectAddress(address)}
              onDelete={handleDeleteAddress}
              isManageable={true}
            />
          ))}
        </div>
    </div>
  );
}

export default AddressSelector; 