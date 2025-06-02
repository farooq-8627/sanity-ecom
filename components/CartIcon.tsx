"use client";
import useStore from "@/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";

const CartIcon = () => {
  const { items } = useStore();
  const { isSignedIn } = useUser();
  
  const cartCount = isSignedIn && items?.length ? items.length : 0;
  
  const icon = (
    <div className="relative">
      <ShoppingBag className="w-5 h-5 hover:text-shop_light_green hoverEffect" />
      <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
        {cartCount}
      </span>
    </div>
  );
  
  // Always use Link regardless of authentication status
  return (
    <Link href={"/cart"} className="group relative">
      {icon}
    </Link>
  );
};

export default CartIcon;
