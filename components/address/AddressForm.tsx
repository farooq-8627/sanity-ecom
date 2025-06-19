"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Home, Briefcase, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { UserAddress } from "@/types";
import { indianStates, State } from "@/lib/states";
import * as Select from "@radix-ui/react-select";

interface AddressFormProps {
  address?: UserAddress;
  onSuccess?: () => void;
  isCheckout?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onSuccess,
  isCheckout = false,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [formData, setFormData] = useState({
    addressName: address?.addressName || "",
    fullName: address?.fullName || "",
    phoneNumber: address?.phoneNumber || "",
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
    city: address?.city || "",
    state: address?.state || { code: "", title: "" },
    pincode: address?.pincode || "",
    isDefault: address?.isDefault || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleStateChange = (stateCode: string) => {
    const selectedState = indianStates.find(state => state.code === stateCode);
    if (selectedState) {
      setFormData(prev => ({
        ...prev,
        state: selectedState
      }));
    }
  };

  const handleAddressTypeSelect = (type: string) => {
    if (type === "other") {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
      setFormData(prev => ({
        ...prev,
        addressName: type
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      const requiredFields = ["addressName", "fullName", "phoneNumber", "addressLine1", "city", "state", "pincode"];
      const missingFields = requiredFields.filter(field => {
        if (field === "state") {
          return !formData.state.code || !formData.state.title;
        }
        return !formData[field as keyof typeof formData];
      });
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
        setIsLoading(false);
        return;
      }

      // Update or create address
      const url = "/api/addresses";
      const method = address?._key ? "PUT" : "POST";
      const body = address?._key 
        ? JSON.stringify({ ...formData, _key: address._key })
        : JSON.stringify(formData);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save address");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to save address");
      }

      // Call success callback or navigate back
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/checkout");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert(error instanceof Error ? error.message : "An error occurred while saving your address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Type <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant={formData.addressName === "Home" ? "default" : "outline"}
              onClick={() => handleAddressTypeSelect("Home")}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button
              type="button"
              variant={formData.addressName === "Work" ? "default" : "outline"}
              onClick={() => handleAddressTypeSelect("Work")}
              className="flex items-center gap-2"
            >
              <Briefcase className="h-4 w-4" />
              Work
            </Button>
            <Button
              type="button"
              variant={showOtherInput ? "default" : "outline"}
              onClick={() => handleAddressTypeSelect("other")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Other
            </Button>
          </div>
          {showOtherInput && (
            <Input
              className="mt-2"
              placeholder="Enter custom address name"
              value={formData.addressName}
              onChange={(e) => setFormData(prev => ({ ...prev, addressName: e.target.value }))}
              required
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="9876543210"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <Input
            id="addressLine1"
            name="addressLine1"
            placeholder="Street address, apartment, etc."
            value={formData.addressLine1}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 2
          </label>
          <Input
            id="addressLine2"
            name="addressLine2"
            placeholder="Apartment, suite, unit, building, floor, etc."
            value={formData.addressLine2}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <Input
              id="city"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <Select.Root value={formData.state.code} onValueChange={handleStateChange}>
              <Select.Trigger 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="State"
              >
                <Select.Value placeholder="Select state">
                  {formData.state.title || "Select state"}
                </Select.Value>
                <Select.Icon>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content 
                  className="z-50 min-w-[200px] overflow-hidden bg-white rounded-md shadow-lg border border-gray-200"
                  position="popper"
                  sideOffset={5}
                  align="start"
                  style={{ maxHeight: 'var(--radix-select-content-available-height)' }}
                >
                  <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                    <ChevronUp className="h-4 w-4" />
                  </Select.ScrollUpButton>
                  <Select.Viewport className="p-1">
                    <div className="max-h-[300px] overflow-y-auto">
                      {indianStates.map((state) => (
                        <Select.Item
                          key={state.code}
                          value={state.code}
                          className="relative flex items-center px-8 py-2 text-sm text-gray-700 rounded-sm data-[highlighted]:bg-gray-100 data-[highlighted]:outline-none cursor-pointer"
                        >
                          <Select.ItemText>{state.title}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </div>
                  </Select.Viewport>
                  <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                    <ChevronDown className="h-4 w-4" />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
              Pincode <span className="text-red-500">*</span>
            </label>
            <Input
              id="pincode"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="h-4 w-4 text-shop_dark_green focus:ring-shop_dark_green border-gray-300 rounded"
          />
          <label htmlFor="isDefault" className="text-sm text-gray-700">
            Set as default address
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Address'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm; 