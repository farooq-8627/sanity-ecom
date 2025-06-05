"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { nanoid } from "nanoid";
import { client } from "@/sanity/lib/client";

// GET endpoint to fetch all addresses for a user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const addresses = await client.fetch(
      `*[_type == "userAddresses" && clerkUserId == $userId][0]{
        _id,
        addresses
      }`,
      { userId: session.userId },
      { cache: 'no-store' }  // Disable caching to always get fresh data
    );

    if (!addresses) {
      return NextResponse.json({ addresses: [] });
    }
    
    return NextResponse.json({ addresses: addresses.addresses || [] }, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error("[ADDRESSES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
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
    
    // Check if user already has an addresses document
    const existingDoc = await backendClient.fetch(
      `*[_type == "userAddresses" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: user.id }
    );
    
    const newAddress = {
      _key: nanoid(),
      addressName: data.addressName,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || "",
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      isDefault: data.isDefault || false
    };

    if (existingDoc) {
      // If this address is set as default, unset any existing defaults
      if (newAddress.isDefault) {
        const updatedAddresses = existingDoc.addresses.map((addr: any) => ({
          ...addr,
          isDefault: false
        }));
        updatedAddresses.push(newAddress);

        const updatedDoc = await backendClient
          .patch(existingDoc._id)
          .set({
            addresses: updatedAddresses,
            updatedAt: new Date().toISOString()
          })
          .commit();

        return NextResponse.json({ address: newAddress, document: updatedDoc });
      } else {
        // Just add the new address
        const updatedDoc = await backendClient
          .patch(existingDoc._id)
          .set({
            addresses: [...existingDoc.addresses, newAddress],
            updatedAt: new Date().toISOString()
          })
          .commit();
    
        return NextResponse.json({ address: newAddress, document: updatedDoc });
      }
    } else {
      // Create new document with first address (make it default)
      newAddress.isDefault = true;
      const newDoc = await backendClient.create({
        _type: "userAddresses",
        clerkUserId: user.id,
        addresses: [newAddress],
        updatedAt: new Date().toISOString()
      });

      return NextResponse.json({ address: newAddress, document: newDoc });
    }
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
    const { addressKey, ...addressData } = data;
    
    if (!addressKey) {
      return NextResponse.json(
        { error: "Address key is required" },
        { status: 400 }
      );
    }
    
    // Get user's addresses document
    const userDoc = await backendClient.fetch(
      `*[_type == "userAddresses" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: user.id }
    );
    
    if (!userDoc) {
      return NextResponse.json(
        { error: "Addresses not found" },
        { status: 404 }
      );
    }

    // Find the address to update
    const addressIndex = userDoc.addresses.findIndex((addr: any) => addr._key === addressKey);
    if (addressIndex === -1) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }
    
    // If setting as default, unset other defaults
    if (addressData.isDefault) {
      userDoc.addresses = userDoc.addresses.map((addr: any) => ({
        ...addr,
        isDefault: addr._key === addressKey
      }));
    } else {
      // Update just the specified address
      userDoc.addresses[addressIndex] = {
        ...userDoc.addresses[addressIndex],
        ...addressData
      };
    }
    
    // Update the document
    const updatedDoc = await backendClient
      .patch(userDoc._id)
      .set({
        addresses: userDoc.addresses,
        updatedAt: new Date().toISOString()
      })
      .commit();
    
    return NextResponse.json({ 
      address: userDoc.addresses[addressIndex],
      document: updatedDoc 
    });
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
    const addressKey = url.searchParams.get('key');
    
    if (!addressKey) {
      return NextResponse.json(
        { error: "Address key is required" },
        { status: 400 }
      );
    }
    
    // Get user's addresses document
    const userDoc = await backendClient.fetch(
      `*[_type == "userAddresses" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: user.id }
    );
    
    if (!userDoc) {
      return NextResponse.json(
        { error: "Addresses not found" },
        { status: 404 }
      );
    }
    
    // Find the address to delete
    const addressToDelete = userDoc.addresses.find((addr: any) => addr._key === addressKey);
    if (!addressToDelete) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    // Remove the address from the array
    const updatedAddresses = userDoc.addresses.filter((addr: any) => addr._key !== addressKey);

    // If we deleted the default address, make another address default if possible
    if (addressToDelete.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    
    // Update the document
    await backendClient
      .patch(userDoc._id)
      .set({
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      })
      .commit();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
} 