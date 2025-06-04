"use client";

import React, { useEffect, useState } from "react";
import { UserAddress } from "@/types";
import AddressCard from "./AddressCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddressSelectorSkeleton from "@/components/skeletons/AddressSelectorSkeleton";

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

  // Use a ref to track if we've already loaded addresses
  const addressesLoadedRef = React.useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchAddresses() {
      // Skip if we've already loaded addresses
      if (addressesLoadedRef.current) return;

      try {
        setIsLoading(true);
        const response = await fetch("/api/addresses");
        
        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }

        const data = await response.json();
        
        if (isMounted) {
          setAddresses(data.addresses);
          addressesLoadedRef.current = true;
        
          // Only set default address if no address is currently selected
          if (data.addresses.length > 0 && !selectedAddress) {
            const defaultAddress = data.addresses.find((addr: UserAddress) => addr.isDefault) || data.addresses[0];
            onSelectAddress(defaultAddress);
            setSelectedAddressKey(defaultAddress._key);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        if (isMounted) {
          setError("Failed to load addresses");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchAddresses();

    return () => {
      isMounted = false;
    };
  }, [onSelectAddress, selectedAddress]);

  const handleDeleteAddress = async (addressKey: string) => {
    try {
      const response = await fetch(`/api/addresses?key=${addressKey}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }

      // Update addresses list
      const updatedAddresses = addresses.filter(addr => addr._key !== addressKey);
      setAddresses(updatedAddresses);

      // If the deleted address was selected, select a new default
      if (selectedAddressKey === addressKey) {
        const newDefaultAddress = updatedAddresses.find(addr => addr.isDefault) || updatedAddresses[0];
        onSelectAddress(newDefaultAddress || null);
        setSelectedAddressKey(newDefaultAddress?._key || null);
      }

      // Reset the loaded flag so we'll fetch fresh data next time
      addressesLoadedRef.current = false;
    } catch (error) {
      console.error("Error deleting address:", error);
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

  if (addresses.length === 0) {
  return (
      <div className="text-center">
        <p className="mb-4">No addresses found.</p>
        {showAddButton && (
          <Button asChild>
            <Link href={`/account/addresses/add${isCheckout ? "?checkout=true" : ""}`}>
          Add New Address
            </Link>
        </Button>
        )}
      </div>
    );
  }

  const handleSelectAddress = (address: UserAddress) => {
    setSelectedAddressKey(address._key);
    onSelectAddress(address);
  };

  return (
    <div className="space-y-4">
      {showAddButton && (
        <div className="flex justify-end">
          <Button asChild>
            <Link href={`/account/addresses/add${isCheckout ? "?checkout=true" : ""}`}>
              Add New Address
            </Link>
          </Button>
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