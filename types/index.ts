import type {
  ProductType,
  CategoryType,
  OrderItemType,
  OrderType,
  CouponType,
  SanityDocument,
  UserAddressType,
  Product as SanityProduct,
  BannerType,
  SanityUserAddress
} from '@/sanity/schemaTypes/types';

// Re-export types with aliases to avoid conflicts
export type {
  ProductType,
  CategoryType,
  BannerType,
  OrderItemType,
  OrderType,
  CouponType,
  SanityDocument,
  UserAddressType,
};

// Additional application types
export interface CartItem {
  product: SanityProduct;
  quantity: number;
  size?: string;
}

export interface WishlistItem {
  product: SanityProduct;
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
  addItem: (product: SanityProduct) => void;
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

export interface AddressInfo {
  name: string;
  address: string;
  addressLine2: string;
  city: string;
  state: {
    code: string;
    title: string;
  };
  zip: string;
  phoneNumber: string;
}

export interface Product extends SanityProduct  {
  _id: string;
  _type: "product";
  name: string;
  slug: { current: string };
  images: { url: string }[];
  description: string;
  price: number;
  discount: number;
  categories: string[];
  stock: number;
  brand: string;
  status: string;
  variant: string;
  isFeatured: boolean;
  hasSizes: boolean;
  sizes: ProductSize[];
  productReels: ProductReel[];
}

export type ProductReel = {
  _id: string;
  video: {
    url: string;
  };
  product: {
    _id: string;
    name: string;
    description: string;
    images: {
      asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
      };
      hotspot?: {
        x?: number;
        y?: number;
        height?: number;
        width?: number;
      };
      crop?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
      };
      _type: "image";
      _key: string;
    }[];
    stock: number;
    price: number;
    slug: {
      current: string;
    };
    discount?: number;
    hasSizes?: boolean;
    sizes?: {
      _key: string;
      size: string;
      isEnabled: boolean;
    }[];
  };
  likes: number;
  views: number;
  tags: string[];
} 

export type ProductSize = {
  _key: string;
  size: string;
  isEnabled: boolean;
}