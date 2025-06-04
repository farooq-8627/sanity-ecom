"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

// GET endpoint to fetch all addresses for a user
export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Query to fetch all addresses for the current user
    const query = `*[_type == "userAddress" && clerkUserId == $clerkUserId] | order(isDefault desc, createdAt desc)`;
    const addresses = await backendClient.fetch(query, { clerkUserId: user.id });
    
    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new address
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await req.json();
    
    // Check if this is the first address for the user
    const existingAddresses = await backendClient.fetch(
      `*[_type == "userAddress" && clerkUserId == $clerkUserId]`,
      { clerkUserId: user.id }
    );
    
    // If it's the first address, make it default
    const isDefault = data.isDefault === true || existingAddresses.length === 0;
    
    // If this address is set as default, unset any existing defaults
    if (isDefault && existingAddresses.length > 0) {
      for (const address of existingAddresses) {
        if (address.isDefault) {
          await backendClient
            .patch(address._id)
            .set({ isDefault: false })
            .commit();
        }
      }
    }
    
    // Create the new address
    const newAddress = await backendClient.create({
      _type: "userAddress",
      clerkUserId: user.id,
      addressName: data.addressName,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || "",
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      isDefault,
      createdAt: new Date().toISOString(),
    });
    
    return NextResponse.json({ address: newAddress });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update an existing address
export async function PATCH(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { addressId, ...addressData } = data;
    
    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }
    
    // Verify that the address belongs to the current user
    const address = await backendClient.fetch(
      `*[_type == "userAddress" && _id == $addressId && clerkUserId == $clerkUserId][0]`,
      { addressId, clerkUserId: user.id }
    );
    
    if (!address) {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 404 }
      );
    }
    
    // If setting as default, unset other defaults
    if (addressData.isDefault) {
      const otherAddresses = await backendClient.fetch(
        `*[_type == "userAddress" && clerkUserId == $clerkUserId && _id != $addressId]`,
        { clerkUserId: user.id, addressId }
      );
      
      for (const otherAddress of otherAddresses) {
        if (otherAddress.isDefault) {
          await backendClient
            .patch(otherAddress._id)
            .set({ isDefault: false })
            .commit();
        }
      }
    }
    
    // Update the address
    const updatedAddress = await backendClient
      .patch(addressId)
      .set(addressData)
      .commit();
    
    return NextResponse.json({ address: updatedAddress });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove an address
export async function DELETE(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const url = new URL(req.url);
    const addressId = url.searchParams.get('id');
    
    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }
    
    // Verify that the address belongs to the current user
    const address = await backendClient.fetch(
      `*[_type == "userAddress" && _id == $addressId && clerkUserId == $clerkUserId][0]`,
      { addressId, clerkUserId: user.id }
    );
    
    if (!address) {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 404 }
      );
    }
    
    // If deleting a default address, make another address default if possible
    if (address.isDefault) {
      const nextAddress = await backendClient.fetch(
        `*[_type == "userAddress" && clerkUserId == $clerkUserId && _id != $addressId][0]`,
        { clerkUserId: user.id, addressId }
      );
      
      if (nextAddress) {
        await backendClient
          .patch(nextAddress._id)
          .set({ isDefault: true })
          .commit();
      }
    }
    
    // Delete the address
    await backendClient.delete(addressId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
} 