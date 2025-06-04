"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { UserAddress } from "@/types";
import AddressCard from "@/components/address/AddressCard";

export default function AddressesPage() {
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
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setError("Could not load your saved addresses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <div className="max-w-4xl mx-auto py-16 flex justify-center">
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Loading your addresses...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Title>Your Addresses</Title>
          <Button 
            onClick={() => router.push("/account/addresses/add")}
            className="flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add New Address
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-lg text-red-500 mb-6">
            {error}
            <button 
              onClick={() => window.location.reload()}
              className="underline ml-2"
            >
              Retry
            </button>
          </div>
        )}

        {addresses.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-10 text-center">
            <p className="text-gray-500 mb-4">You don't have any saved addresses yet.</p>
            <Button 
              onClick={() => router.push("/account/addresses/add")}
              className="flex items-center mx-auto"
            >
              <Plus size={16} className="mr-1" />
              Add Your First Address
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <AddressCard
                key={address._key}
                address={address}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
} 