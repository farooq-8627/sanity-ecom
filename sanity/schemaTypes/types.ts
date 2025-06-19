// Type definitions for Sanity schema types

import { productType } from "./productType";
import { categoryType } from "./categoryType";
import { orderType } from "./orderType";
import { orderItemType } from "./orderItemType";
import { couponType } from "./couponType";
import { userAddressType } from "./userAddressType";

// Export type interfaces for the schemas
export type ProductType = typeof productType;
export type CategoryType = typeof categoryType;
export type OrderType = typeof orderType;
export type OrderItemType = typeof orderItemType;
export type CouponType = typeof couponType;
export type UserAddressType = typeof userAddressType;
export type SanityDocument = ProductType | CategoryType | OrderType | CouponType | UserAddressType;

// Base product interface used in the application
export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images?: { url?: string }[];
  slug: { current: string };
  discount?: number;
  hasSizes?: boolean;
  sizes?: { _key: string; size: string; isEnabled: boolean }[];
  [key: string]: any;
}

// Export a BannerType for the application
export interface BannerType {
  _id: string;
  title: string;
  subtitle?: string;
  image?: any;
  buttonText?: string;
  buttonLink?: string;
}

// Define SanityUserAddress for form use
export interface SanityUserAddress {
  _key?: string;
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