import type {
  ProductImage,
  Product,
  Category,
  Banner,
  UserAddress as SanityUserAddress,
  UserAddresses,
  OrderItem,
  Order,
  Coupon,
  SanityDocument
} from '@/sanity/schemas/schema';

// Re-export types with aliases to avoid conflicts
export type {
  ProductImage,
  Product,
  Category,
  Banner,
  UserAddresses,
  OrderItem,
  Order,
  Coupon,
  SanityDocument
};

// Additional application types
export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface CheckoutMetadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
  address: {
    name: string;
    address: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
    phoneNumber: string;
  };
  discountAmount?: number;
  couponCode?: string | null;
}

export interface AppliedCoupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  value: number;
}

// State Types
export interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  getGroupedItems: () => CartItem[];
}

export interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form Types
export interface AddressFormData extends Omit<SanityUserAddress, '_key'> {
  _key?: string;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type PaymentMethod = 'cod' | 'prepaid';

export interface UserAddress {
  _key: string;
  addressName: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: {
    code: string;
    title: string;
  };
  pincode: string;
  isDefault: boolean;
}

export interface UserAddressDocument {
  _id: string;
  _type: "userAddresses";
  clerkUserId: string;
  addresses: UserAddress[];
  updatedAt: string;
} 