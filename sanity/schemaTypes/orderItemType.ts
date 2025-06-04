import { defineType, defineField } from "sanity";

export const orderItemType = defineType({
  name: "orderItem",
  title: "Order Item",
  type: "object",
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (Rule) => Rule.required(),
      weak: false
    }),
    defineField({
      name: "quantity",
      title: "Quantity",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required(),
    })
  ],
  preview: {
    select: {
      productName: 'product.name',
      quantity: 'quantity',
      size: 'size',
      price: 'price'
    },
    prepare(selection) {
      const { productName, quantity, size, price } = selection;
      return {
        title: productName || 'No Product Name',
        subtitle: `Qty: ${quantity || 0} ${size ? `| Size: ${size}` : ''} | Price: ${price || 0}`
      };
    }
  }
}); 