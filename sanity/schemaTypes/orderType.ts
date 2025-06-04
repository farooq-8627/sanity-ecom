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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      of: [{ type: "orderItem" }],
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      fields: [
        { name: "name", type: "string", title: "Name" },
        { name: "address", type: "string", title: "Address" },
        { name: "addressLine2", type: "string", title: "Address Line 2" },
        { name: "city", type: "string", title: "City" },
        { name: "state", type: "string", title: "State" },
        { name: "zip", type: "string", title: "ZIP Code" },
        { name: "phoneNumber", type: "string", title: "Phone Number" },
      ],
    }),
    defineField({
      name: "totalAmount",
      title: "Total Amount",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: ["pending", "paid", "cod", "failed", "refunded"],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: ["stripe", "cod"],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "orderStatus",
      title: "Order Status",
      type: "string",
      options: {
        list: ["pending", "processing", "shipped", "delivered", "cancelled"],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tracking",
      title: "Tracking Information",
      type: "object",
      fields: [
        {
          name: "carrier",
          type: "string",
          title: "Shipping Carrier",
          options: {
            list: [
              "DTDC",
              "Delhivery",
              "BlueDart",
              "FedEx",
              "IndiaPost",
              "Other"
            ],
          },
        },
        {
          name: "trackingNumber",
          type: "string",
          title: "Tracking Number"
        },
        {
          name: "trackingUrl",
          type: "url",
          title: "Tracking URL"
        },
        {
          name: "estimatedDelivery",
          type: "date",
          title: "Estimated Delivery Date"
        },
        {
          name: "updates",
          type: "array",
          title: "Status Updates",
          of: [{
            type: "object",
            fields: [
              {
                name: "status",
                type: "string",
                title: "Status",
                options: {
                  list: [
                    "Order Placed",
                    "Order Confirmed",
                    "Processing",
                    "Packed",
                    "Shipped",
                    "Out for Delivery",
                    "Delivered",
                    "Delayed",
                    "Failed Delivery Attempt",
                    "Exception"
                  ]
                }
              },
              {
                name: "location",
                type: "string",
                title: "Location"
              },
              {
                name: "timestamp",
                type: "datetime",
                title: "Timestamp"
              },
              {
                name: "description",
                type: "text",
                title: "Description"
              }
            ]
          }]
        }
      ]
    }),
    defineField({
      name: "stripeCheckoutId",
      title: "Stripe Checkout ID",
      type: "string",
    }),
    defineField({
      name: "stripePaymentIntentId",
      title: "Stripe Payment Intent ID",
      type: "string",
    }),
    defineField({
      name: "stripeCustomerId",
      title: "Stripe Customer ID",
      type: "string",
    }),
    defineField({
      name: "stripeInvoiceId",
      title: "Stripe Invoice ID",
      type: "string",
    }),
    defineField({
      name: "stripeInvoiceUrl",
      title: "Stripe Invoice URL",
      type: "string",
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
      name: "customer.name",
      amount: "totalAmount",
      orderId: "orderNumber",
      email: "customer.email",
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
