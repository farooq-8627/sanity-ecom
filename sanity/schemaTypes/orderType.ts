import { BasketIcon } from "@sanity/icons";
import { defineField, defineType, SanityDocument } from "sanity";

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
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerEmail",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "address",
      title: "Shipping Address",
      type: "object",
      fields: [
        { name: "name", type: "string" },
        { name: "address", type: "string" },
        { name: "addressLine2", type: "string" },
        { name: "city", type: "string" },
        { name: "state", type: "object", fields: [
          { name: "title", type: "string" },
          { name: "code", type: "string" }
        ]},
        { name: "zip", type: "string" },
        { name: "phoneNumber", type: "string" }
      ]
    }),
    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      of: [{ type: "orderItem" }]
    }),
    defineField({
      name: "totalAmount",
      title: "Total Amount",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "orderStatus",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Packed", value: "packed" },
          { title: "Shipped", value: "shipped" },
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
          { title: "Cash on Delivery", value: "cod" },
          { title: "Online Payment", value: "prepaid" },
        ],
      },
      validation: (Rule) => Rule.required(),
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
      name: "phonepeDetails",
      title: "PhonePe Payment Details",
      type: "object",
      hidden: ({ document }) => {
        const doc = document as SanityDocument & { paymentMethod?: string };
        return doc?.paymentMethod !== "phonepe";
      },
      fields: [
        {
          name: "merchantTransactionId",
          title: "Merchant Transaction ID",
          type: "string",
        },
        {
          name: "providerReferenceId",
          title: "Provider Reference ID",
          type: "string",
        },
        {
          name: "paymentState",
          title: "Payment State",
          type: "string",
        },
        {
          name: "payResponseCode",
          title: "Payment Response Code",
          type: "string",
        }
      ]
    }),
    defineField({
      name: "updates",
      title: "Status Updates",
      type: "array",
      of: [{
        type: "statusUpdate"
      }]
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      name: "customerName",
      amount: "totalAmount",
      orderId: "orderNumber",
      email: "customerEmail",
    },
    prepare(select) {
      const orderIdSnippet = `${select.orderId.slice(0, 5)}...${select.orderId.slice(-5)}`;
      return {
        title: `${select.name} (${orderIdSnippet})`,
        subtitle: `${select.amount}`,
        media: BasketIcon,
      };
    },
  },
});
