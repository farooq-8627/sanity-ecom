"use client";

import React, { useState } from "react";
import { UserAddress } from "@/sanity.types";
import { Button } from "@/components/ui/button";
import { CheckCircle, Edit, Trash2, MapPin, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddressCardProps {
  address: UserAddress;
  onSelect?: (address: UserAddress) => void;
  isSelected?: boolean;
  isSelectable?: boolean;
  onEdit?: (address: UserAddress) => void;
  onDelete?: (addressId: string) => void;
  isManageable?: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onSelect,
  isSelected = false,
  isSelectable = false,
  onEdit,
  onDelete,
  isManageable = true,
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(address);
    } else {
      router.push(`/account/addresses/edit?id=${address._id}&checkout=true`);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this address?")) {
      setIsDeleting(true);

      if (onDelete) {
        onDelete(address._id);
      } else {
        try {
          const response = await fetch(`/api/addresses?id=${address._id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to delete address");
          }

          router.refresh();
        } catch (error) {
          console.error("Error deleting address:", error);
          alert("An error occurred while deleting the address. Please try again.");
        } finally {
          setIsDeleting(false);
        }
      }
    }
  };

  const handleSelect = () => {
    if (onSelect && isSelectable) {
      onSelect(address);
    }
  };

  return (
    <div 
      className={`border rounded-lg relative transition-all ${
        isSelected 
          ? "border-shop_dark_green ring-1 ring-shop_dark_green bg-shop_light_bg/5" 
          : "border-gray-200 hover:border-gray-300"
      } ${isSelectable ? "cursor-pointer" : ""}`}
      onClick={isSelectable ? handleSelect : undefined}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            {isSelectable && (
              <div className="mt-1">
                <input
                  type="radio"
                  className="h-4 w-4 text-shop_dark_green focus:ring-shop_dark_green border-gray-300"
                  checked={isSelected}
                  onChange={handleSelect}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-medium text-gray-900">{address.addressName}</h3>
                {address.isDefault && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-shop_dark_green/10 text-shop_dark_green">
                    Default
                  </span>
                )}
              </div>
              
              <div className="space-y-1 text-sm text-gray-500">
                <p className="font-medium text-gray-900">{address.fullName}</p>
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Phone:</span>
                  {address.phoneNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onClick={handleEdit}
              title="Edit address"
            >
              <Edit className="h-4 w-4 text-gray-500" />
            </Button>
            {isManageable && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isDeleting}
                title="Delete address"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                ) : (
                  <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressCard; 