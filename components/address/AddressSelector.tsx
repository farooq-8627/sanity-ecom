"use client";

import React, { useEffect, useState } from "react";
import { UserAddress } from "@/sanity.types";
import AddressCard from "./AddressCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import AddressSelectorSkeleton from "@/components/skeletons/AddressSelectorSkeleton";

interface AddressSelectorProps {
  onSelectAddress: (address: UserAddress | null) => void;
  selectedAddressId?: string;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  onSelectAddress,
  selectedAddressId,
}) => {
  const router = useRouter();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/addresses");
        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }
        const data = await response.json();
        setAddresses(data.addresses || []);
        
        // Auto-select default address if there's no selected address yet
        if (!selectedAddressId && data.addresses?.length > 0) {
          const defaultAddress = data.addresses.find((addr: UserAddress) => addr.isDefault) || data.addresses[0];
          onSelectAddress(defaultAddress);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setError("Could not load your saved addresses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [onSelectAddress, selectedAddressId]);

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const response = await fetch(`/api/addresses?id=${addressId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }

      // Update local addresses state
      const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
      setAddresses(updatedAddresses);

      // If the deleted address was selected, select a new one or set to null
      if (selectedAddressId === addressId) {
        const newDefaultAddress = updatedAddresses.find(addr => addr.isDefault) || updatedAddresses[0];
        onSelectAddress(newDefaultAddress || null);
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("An error occurred while deleting the address. Please try again.");
    }
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
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">Select Delivery Address</h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose an address for delivery or add a new one
          </p>
        </div>
        <Button 
          onClick={() => router.push("/account/addresses/add?checkout=true")}
          className="flex items-center gap-2 bg-white w-full md:w-auto"
          variant="outline"
          size="default"
        >
          <Plus className="h-5 w-5" />
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 md:py-16 px-4 border rounded-lg border-dashed bg-gray-50">
          <div className="max-w-sm mx-auto">
            <p className="text-gray-600 mb-4">You don't have any saved addresses yet. Add a new address to get started.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              isSelectable
              isSelected={selectedAddressId === address._id}
              onSelect={onSelectAddress}
              onDelete={handleDeleteAddress}
              isManageable={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressSelector; 