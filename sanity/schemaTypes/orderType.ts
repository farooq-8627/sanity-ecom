import { BasketIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Orders",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customer",
      title: "Customer",
      type: "object",
      fields: [
        { name: "name", type: "string", title: "Name" },
        { name: "email", type: "string", title: "Email" },
        { name: "clerkUserId", type: "string", title: "Clerk User ID" },
      ],
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      fields: [
        { name: "name", type: "string", title: "Full Name" },
        { name: "address", type: "string", title: "Address" },
        { name: "addressLine2", type: "string", title: "Address Line 2" },
        { name: "city", type: "string", title: "City" },
        { name: "state", type: "string", title: "State" },
        { name: "zip", type: "string", title: "ZIP Code" },
        { name: "phoneNumber", type: "string", title: "Phone Number" },
      ],
    }),
    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      of: [{ type: "orderItem" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "totalAmount",
      title: "Total Amount",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "discountAmount",
      title: "Discount Amount",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "couponCode",
      title: "Coupon Code",
      type: "string",
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
          { title: "COD", value: "cod" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "orderStatus",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Processing", value: "processing" },
          { title: "Packed", value: "packed" },
          { title: "Shipped", value: "shipped" },
          { title: "Out for Delivery", value: "out for delivery" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: [
          { title: "PhonePe", value: "phonepe" },
          { title: "Cash on Delivery", value: "cod" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paymentDetails",
      title: "Payment Details",
      type: "object",
      fields: [
        { 
          name: "merchantTransactionId", 
          type: "string", 
          title: "Merchant Transaction ID"
        },
        { 
          name: "transactionId", 
          type: "string", 
          title: "Transaction ID"
        },
        {
          name: "paymentInstrument",
          type: "object",
          title: "Payment Instrument",
          fields: [
            { name: "type", type: "string", title: "Type" },
            { name: "accountHolderName", type: "string", title: "Account Holder Name" },
            { name: "accountType", type: "string", title: "Account Type" },
            { name: "cardNetwork", type: "string", title: "Card Network" },
            { name: "upiTransactionId", type: "string", title: "UPI Transaction ID" },
            { name: "utr", type: "string", title: "UTR" }
          ]
        }
      ]
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: 'orderNumber',
      subtitle: 'orderStatus',
    },
  },
});
