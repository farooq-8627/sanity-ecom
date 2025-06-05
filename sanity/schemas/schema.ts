import { SchemaTypeDefinition } from 'sanity';

// Product Types
export interface ProductImage {
  _type: 'image';
  _key: string;
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface Product {
  _id: string;
  _type: 'product';
  name: string;
  slug: {
    current: string;
    _type: 'slug';
  };
  description: string;
  price: number;
  comparePrice?: number;
  images: ProductImage[];
  category: {
    _ref: string;
    _type: 'reference';
  };
  sizes?: string[];
  inStock: boolean;
  lowStock?: boolean;
  features?: string[];
  details?: string;
}

// Category Types
export interface Category {
  _id: string;
  _type: 'category';
  name: string;
  slug: {
    current: string;
    _type: 'slug';
  };
  description?: string;
  image?: ProductImage;
}

// Banner Types
export interface Banner {
  _id: string;
  _type: 'banner';
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  image: ProductImage;
  isActive: boolean;
  priority: number;
}

// User Address Types
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

export interface UserAddresses {
  _id: string;
  _type: 'userAddresses';
  clerkUserId: string;
  addresses: UserAddress[];
  updatedAt: string;
}

// Order Types
export interface OrderItem {
  _key: string;
  product: {
    _ref: string;
    _type: 'reference';
  };
  quantity: number;
  size?: string;
  price: number;
}

// PhonePe Payment Details Type
export interface PhonePePaymentDetails {
  merchantTransactionId: string;
  transactionId: string;
  paymentInstrument: {
    type: string;
    accountHolderName: string;
    accountType: string;
    cardNetwork: string | null;
    upiTransactionId: string;
    utr: string;
  };
}

export interface Order {
  _id: string;
  _type: 'order';
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
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  couponCode: string | null;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cod';
  orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'phonepe' | 'cod';
  paymentDetails?: PhonePePaymentDetails;
  createdAt: string;
  updatedAt: string;
}

// Coupon Types
export interface Coupon {
  _id: string;
  _type: 'coupon';
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumAmount: number;
  maximumDiscount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  usageLimit: number;
  applicableCategories?: {
    _ref: string;
    _type: 'reference';
  }[];
}

// Combined Schema Type
export type SanityDocument = Product | Category | Banner | UserAddresses | Order | Coupon;

// Schema Configuration
export const schemaTypes: SchemaTypeDefinition[] = [
  {
    name: 'product',
    title: 'Products',
    type: 'document',
    fields: [
      { name: 'name', type: 'string', title: 'Name', validation: (Rule) => Rule.required() },
      { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'name' }, validation: (Rule) => Rule.required() },
      { name: 'description', type: 'text', title: 'Description', validation: (Rule) => Rule.required() },
      { name: 'price', type: 'number', title: 'Price', validation: (Rule) => Rule.required().positive() },
      { name: 'comparePrice', type: 'number', title: 'Compare Price' },
      { name: 'images', type: 'array', title: 'Images', of: [{ type: 'image', options: { hotspot: true } }], validation: (Rule) => Rule.required().min(1) },
      { name: 'category', type: 'reference', title: 'Category', to: [{ type: 'category' }], validation: (Rule) => Rule.required() },
      { name: 'sizes', type: 'array', title: 'Sizes', of: [{ type: 'string' }] },
      { name: 'inStock', type: 'boolean', title: 'In Stock', initialValue: true },
      { name: 'lowStock', type: 'boolean', title: 'Low Stock' },
      { name: 'features', type: 'array', title: 'Features', of: [{ type: 'string' }] },
      { name: 'details', type: 'text', title: 'Details' }
    ]
  },
  {
    name: 'category',
    title: 'Categories',
    type: 'document',
    fields: [
      { name: 'name', type: 'string', title: 'Name', validation: (Rule) => Rule.required() },
      { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'name' }, validation: (Rule) => Rule.required() },
      { name: 'description', type: 'text', title: 'Description' },
      { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } }
    ]
  },
  {
    name: 'banner',
    title: 'Banners',
    type: 'document',
    fields: [
      { name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() },
      { name: 'subtitle', type: 'string', title: 'Subtitle' },
      { name: 'buttonText', type: 'string', title: 'Button Text' },
      { name: 'buttonLink', type: 'string', title: 'Button Link' },
      { name: 'image', type: 'image', title: 'Image', options: { hotspot: true }, validation: (Rule) => Rule.required() },
      { name: 'isActive', type: 'boolean', title: 'Is Active', initialValue: true },
      { name: 'priority', type: 'number', title: 'Priority', validation: (Rule) => Rule.required().integer() }
    ]
  },
  {
    name: 'order',
    title: 'Orders',
    type: 'document',
    fields: [
      { name: 'orderNumber', type: 'string', title: 'Order Number', validation: (Rule) => Rule.required() },
      { name: 'customerName', type: 'string', title: 'Customer Name', validation: (Rule) => Rule.required() },
      { name: 'customerEmail', type: 'string', title: 'Customer Email', validation: (Rule) => Rule.required() },
      { name: 'clerkUserId', type: 'string', title: 'Clerk User ID', validation: (Rule) => Rule.required() },
      {
        name: 'address',
        type: 'object',
        title: 'Shipping Address',
        fields: [
          { name: 'name', type: 'string', title: 'Full Name' },
          { name: 'address', type: 'string', title: 'Address' },
          { name: 'addressLine2', type: 'string', title: 'Address Line 2' },
          { name: 'city', type: 'string', title: 'City' },
          { name: 'state', type: 'string', title: 'State' },
          { name: 'zip', type: 'string', title: 'ZIP Code' },
          { name: 'phoneNumber', type: 'string', title: 'Phone Number' }
        ]
      },
      {
        name: 'items',
        type: 'array',
        title: 'Order Items',
        of: [{
          type: 'object',
          fields: [
            { 
              name: '_key', 
              type: 'string',
              title: 'Key',
              validation: (Rule) => Rule.required(),
              initialValue: () => `item_${Date.now()}`
            },
            { name: 'product', type: 'reference', to: [{ type: 'product' }] },
            { name: 'quantity', type: 'number' },
            { name: 'size', type: 'string' },
            { name: 'price', type: 'number' }
          ]
        }]
      },
      { name: 'totalAmount', type: 'number', title: 'Total Amount', validation: (Rule) => Rule.required() },
      { name: 'discountAmount', type: 'number', title: 'Discount Amount', initialValue: 0 },
      { name: 'couponCode', type: 'string', title: 'Coupon Code' },
      {
        name: 'paymentStatus',
        type: 'string',
        title: 'Payment Status',
        options: {
          list: [
            { title: 'Pending', value: 'pending' },
            { title: 'Paid', value: 'paid' },
            { title: 'Failed', value: 'failed' },
            { title: 'COD', value: 'cod' }
          ]
        },
        validation: (Rule) => Rule.required()
      },
      {
        name: 'orderStatus',
        type: 'string',
        title: 'Order Status',
        options: {
          list: [
            { title: 'Pending', value: 'pending' },
            { title: 'Confirmed', value: 'confirmed' },
            { title: 'Shipped', value: 'shipped' },
            { title: 'Delivered', value: 'delivered' },
            { title: 'Cancelled', value: 'cancelled' }
          ]
        },
        validation: (Rule) => Rule.required()
      },
      {
        name: 'paymentMethod',
        type: 'string',
        title: 'Payment Method',
        options: {
          list: [
            { title: 'PhonePe', value: 'phonepe' },
            { title: 'Cash on Delivery', value: 'cod' }
          ]
        },
        validation: (Rule) => Rule.required()
      },
      {
        name: 'paymentDetails',
        type: 'object',
        title: 'Payment Details',
        fields: [
          { name: 'merchantTransactionId', type: 'string', title: 'Merchant Transaction ID' },
          { name: 'transactionId', type: 'string', title: 'Transaction ID' },
          {
            name: 'paymentInstrument',
            type: 'object',
            title: 'Payment Instrument',
            fields: [
              { name: 'type', type: 'string', title: 'Type' },
              { name: 'accountHolderName', type: 'string', title: 'Account Holder Name' },
              { name: 'accountType', type: 'string', title: 'Account Type' },
              { name: 'cardNetwork', type: 'string', title: 'Card Network', },
              { name: 'upiTransactionId', type: 'string', title: 'UPI Transaction ID' },
              { name: 'utr', type: 'string', title: 'UTR' }
            ]
          }
        ]
      },
      { name: 'createdAt', type: 'datetime', title: 'Created At' },
      { name: 'updatedAt', type: 'datetime', title: 'Updated At' }
    ]
  }
];
