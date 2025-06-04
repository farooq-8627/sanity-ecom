"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Home, Briefcase, Plus } from "lucide-react";
import { UserAddress } from "@/sanity.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Indian states mapping
const indianStates = [
  { title: 'Andhra Pradesh', code: 'AP' },
  { title: 'Arunachal Pradesh', code: 'AR' },
  { title: 'Assam', code: 'AS' },
  { title: 'Bihar', code: 'BR' },
  { title: 'Chhattisgarh', code: 'CG' },
  { title: 'Goa', code: 'GA' },
  { title: 'Gujarat', code: 'GJ' },
  { title: 'Haryana', code: 'HR' },
  { title: 'Himachal Pradesh', code: 'HP' },
  { title: 'Jharkhand', code: 'JH' },
  { title: 'Karnataka', code: 'KA' },
  { title: 'Kerala', code: 'KL' },
  { title: 'Madhya Pradesh', code: 'MP' },
  { title: 'Maharashtra', code: 'MH' },
  { title: 'Manipur', code: 'MN' },
  { title: 'Meghalaya', code: 'ML' },
  { title: 'Mizoram', code: 'MZ' },
  { title: 'Nagaland', code: 'NL' },
  { title: 'Odisha', code: 'OD' },
  { title: 'Punjab', code: 'PB' },
  { title: 'Rajasthan', code: 'RJ' },
  { title: 'Sikkim', code: 'SK' },
  { title: 'Tamil Nadu', code: 'TN' },
  { title: 'Telangana', code: 'TG' },
  { title: 'Tripura', code: 'TR' },
  { title: 'Uttar Pradesh', code: 'UP' },
  { title: 'Uttarakhand', code: 'UK' },
  { title: 'West Bengal', code: 'WB' },
  // Union Territories
  { title: 'Andaman and Nicobar Islands', code: 'AN' },
  { title: 'Chandigarh', code: 'CH' },
  { title: 'Dadra and Nagar Haveli and Daman and Diu', code: 'DN' },
  { title: 'Delhi', code: 'DL' },
  { title: 'Jammu and Kashmir', code: 'JK' },
  { title: 'Ladakh', code: 'LA' },
  { title: 'Lakshadweep', code: 'LD' },
  { title: 'Puducherry', code: 'PY' }
];

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
    state: address?.state || { title: "", code: "" },
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

  const handleStateChange = (value: string) => {
    const selectedState = indianStates.find(state => state.title === value);
    if (selectedState) {
      setFormData(prev => ({
        ...prev,
        state: {
          title: selectedState.title,
          code: selectedState.code
        }
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
          return !formData.state.title;
        }
        return !formData[field as keyof typeof formData];
      });
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
        setIsLoading(false);
        return;
      }

      // Validate phone number
      if (!formData.phoneNumber.match(/^[6-9][0-9]{9}$/)) {
        alert("Please enter a valid 10-digit mobile number starting with 6-9");
        setIsLoading(false);
        return;
      }

      // Validate PIN code
      if (!formData.pincode.match(/^[1-9][0-9]{5}$/)) {
        alert("Please enter a valid 6-digit PIN code");
        setIsLoading(false);
        return;
      }

      // Update or create address
      const url = "/api/addresses";
      const method = address?._id ? "PATCH" : "POST";
      const body = address?._id 
        ? JSON.stringify({ ...formData, addressId: address._id })
        : JSON.stringify(formData);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error("Failed to save address");
      }

      // Refresh the page data
      router.refresh();
      
      // Call success callback or navigate
      if (onSuccess) {
        onSuccess();
      } else if (isCheckout) {
        router.push("/checkout");
      } else {
        router.push("/account/addresses");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("An error occurred while saving your address. Please try again.");
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
              placeholder="10-digit mobile number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              pattern="[6-9][0-9]{9}"
              title="Please enter a valid 10-digit mobile number starting with 6-9"
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
            <Select
              value={formData.state.title}
              onValueChange={handleStateChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {indianStates.sort((a, b) => a.title.localeCompare(b.title)).map((state) => (
                  <SelectItem key={state.code} value={state.title}>
                    {state.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
              PIN Code <span className="text-red-500">*</span>
            </label>
            <Input
              id="pincode"
              name="pincode"
              placeholder="6-digit PIN code"
              value={formData.pincode}
              onChange={handleChange}
              required
              pattern="[1-9][0-9]{5}"
              title="Please enter a valid 6-digit PIN code"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-shop_dark_green focus:ring-shop_dark_green"
          />
          <label htmlFor="isDefault" className="text-sm text-gray-700">
            Set as default address
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
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