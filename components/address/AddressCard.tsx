"use client";

import React, { useEffect, useState } from "react";
import { UserAddress } from "@/types";
import { Button } from "@/components/ui/button";
import { CheckCircle, Edit, Trash2, MapPin, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AddressCardProps {
  address: UserAddress;
  onSelect?: (address: UserAddress) => void;
  isSelected?: boolean;
  isSelectable?: boolean;
  onEdit?: (address: UserAddress) => void;
  onDelete?: (key: string) => void;
  isManageable?: boolean;
}

const   AddressCard: React.FC<AddressCardProps> = ({
  address,
  onSelect,
  isSelected = false,
  isSelectable = false,
  onEdit,
  onDelete,
  isManageable = true,
}) => {
  console.log('AddressCard received address:', JSON.stringify(address, null, 2));
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(address);
    } else {
      router.push(`/account/addresses/edit/${address._key}&checkout=true`);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this address?")) {
      setIsDeleting(true);

      try {
      if (onDelete) {
          await onDelete(address._key);
      } else {
          const response = await fetch(`/api/addresses?key=${address._key}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to delete address");
          }

          router.refresh();
        }
        } catch (error) {
          console.error("Error deleting address:", error);
          alert("An error occurred while deleting the address. Please try again.");
        } finally {
          setIsDeleting(false);
      }
    }
  };

  const handleSelect = () => {
    if (onSelect && isSelectable) {
      onSelect(address);
    }
  };

  return (
    <Card
      className={cn(
        "p-4 relative",
        isSelectable && "cursor-pointer hover:border-primary transition-colors",
        isSelected && "border-primary"
      )}
      onClick={isSelectable ? handleSelect : undefined}
    >
        <div className="flex justify-between items-start">
            <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{address.addressName}</h3>
                {address.isDefault && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    Default
                  </span>
                )}
              </div>
          <p className="text-sm text-gray-600 mt-1">{address.fullName}</p>
          <p className="text-sm text-gray-600">{address.phoneNumber}</p>
          <p className="text-sm text-gray-600 mt-2">
            {address.addressLine1}
            {address.addressLine2 && <>, {address.addressLine2}</>}
                </p>
          <p className="text-sm text-gray-600">
            {address.city}, {address.state.title} - {address.pincode}
                </p>
          </div>

        {isManageable && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="h-8 w-8"
            >
              <Link href={`/account/addresses/edit/${address._key}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
              <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                ) : (
                  <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                )}
              </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AddressCard; 