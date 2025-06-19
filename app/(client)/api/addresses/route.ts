// app/(client)/api/addresses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { v4 as uuidv4 } from 'uuid';
import { backendClient } from '@/sanity/lib/backendClient';
import { getUserAddresses } from '@/sanity/queries';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Query for user addresses
    const userAddresses = await getUserAddresses(userId);

    return NextResponse.json({ 
      success: true, 
      addresses: userAddresses?.addresses || [] 
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const addressData = await req.json();
    
    // Ensure the address has a unique key
    if (!addressData._key) {
      addressData._key = uuidv4();
    }
    
    // Check if this is being set as default
    const isDefault = !!addressData.isDefault;
    
    // Get existing user addresses document
    const userAddresses = await getUserAddresses(userId);

    if (userAddresses) {
      // If setting as default, unset default on all other addresses
      let addresses = [...(userAddresses.addresses || [])];
      
      if (isDefault) {
        addresses = addresses.map(addr => ({
          ...addr,
          isDefault: false
        }));
      }
      
      // Add new address
      addresses.push(addressData);
      
      await backendClient
        .patch(userAddresses._id)
        .set({ 
          addresses,
          updatedAt: new Date().toISOString()
        })
        .commit();
    } else {
      // Create new user addresses document
      await backendClient.create({
        _type: 'userAddresses',
        clerkUserId: userId,
        addresses: [addressData],
        updatedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ 
      success: true,
      data: { _key: addressData._key }
    });
  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add address' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { _key, ...addressData } = await req.json();
    
    if (!_key) {
      return NextResponse.json(
        { success: false, error: 'Address key is required' },
        { status: 400 }
      );
    }
    
    // Get existing user addresses document
    const userAddresses = await getUserAddresses(userId);

    if (!userAddresses) {
      return NextResponse.json(
        { success: false, error: 'User addresses not found' },
        { status: 404 }
      );
    }

    // Find address index by key
    const addresses = [...(userAddresses.addresses || [])];
    const addressIndex = addresses.findIndex(addr => addr._key === _key);
    
    if (addressIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }
    
    // If setting as default, unset default on all other addresses
    if (addressData.isDefault) {
      addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // Update address
    addresses[addressIndex] = {
      ...addresses[addressIndex],
      ...addressData,
      _key
    };
    
    await backendClient
      .patch(userAddresses._id)
      .set({ 
        addresses,
        updatedAt: new Date().toISOString()
      })
      .commit();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const key = url.searchParams.get('key');
    
    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Address key is required' },
        { status: 400 }
      );
    }
    
    // Get existing user addresses document
      const userAddresses = await getUserAddresses(userId);

    if (!userAddresses) {
      return NextResponse.json(
        { success: false, error: 'User addresses not found' },
        { status: 404 }
      );
    }

    // Filter out the address with the given key
    const addresses = (userAddresses.addresses || []).filter((addr: any) => addr._key !== key);
    
    await backendClient
      .patch(userAddresses._id)
      .set({ 
        addresses,
        updatedAt: new Date().toISOString()
      })
      .commit();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}