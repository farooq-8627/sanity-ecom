import { defineType, defineField } from "sanity";

export const orderItemType = defineType({
  name: "orderItem",
  title: "Order Item",
  type: "object",
  fields: [
    defineField({
      name: "product",
      type: "reference",
      to: [{ type: "product" }],
    }),
    defineField({
      name: "quantity",
      type: "number",
    }),
    defineField({
      name: "size",
      type: "string",
    }),
    defineField({
      name: "price",
      type: "number",
    }),
  ],
  preview: {
    select: {
      productName: 'product.name',
      quantity: 'quantity',
      size: 'size',
    },
    prepare(selection) {
      const { productName, quantity, size } = selection;
      return {
        title: productName || 'No Product Name',
        subtitle: `Qty: ${quantity}${size ? `, Size: ${size}` : ''}`
      };
    },
  },
}); 