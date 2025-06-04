"use client";

import { useUser } from "@clerk/nextjs";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MapPin, Package, User } from "lucide-react";
import NoAccess from "@/components/NoAccess";

export default function AccountPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  if (!isSignedIn) {
    return <NoAccess />;
  }

  return (
    <Container>
      <div className="py-8">
        <Title className="mb-8">My Account</Title>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button 
            variant="outline" 
            className="h-auto py-8 flex flex-col items-center"
            onClick={() => router.push("/account/addresses")}
          >
            <MapPin className="h-10 w-10 mb-3 text-shop_dark_green" />
            <h3 className="text-lg font-medium">My Addresses</h3>
            <p className="text-sm text-gray-500 mt-2">Manage your delivery addresses</p>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto py-8 flex flex-col items-center"
            onClick={() => router.push("/orders")}
          >
            <Package className="h-10 w-10 mb-3 text-shop_dark_green" />
            <h3 className="text-lg font-medium">My Orders</h3>
            <p className="text-sm text-gray-500 mt-2">Track your orders and purchases</p>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto py-8 flex flex-col items-center"
            onClick={() => router.push("/profile")}
          >
            <User className="h-10 w-10 mb-3 text-shop_dark_green" />
            <h3 className="text-lg font-medium">Profile Settings</h3>
            <p className="text-sm text-gray-500 mt-2">Update your personal information</p>
          </Button>
        </div>
      </div>
    </Container>
  );
} 