import { defineType, defineField } from "sanity";

export const statusUpdateType = defineType({
  name: "statusUpdate",
  title: "Status Update",
  type: "object",
  fields: [
    defineField({
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
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      type: "string",
      title: "Location"
    }),
    defineField({
      name: "timestamp",
      type: "datetime",
      title: "Timestamp",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description"
    })
  ]
}); 