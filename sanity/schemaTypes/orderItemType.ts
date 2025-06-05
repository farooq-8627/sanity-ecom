import { defineType } from "sanity";

export const orderItemType = defineType({
  name: "orderItem",
  title: "Order Item",
  type: "object",
  fields: [
    {
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
    },
    {
      name: "quantity",
      title: "Quantity",
      type: "number",
    },
    {
      name: "size",
      title: "Size",
      type: "string",
    },
    {
      name: "price",
      title: "Price",
      type: "number",
    }
  ],
  preview: {
    select: {
      title: 'product.name',
      quantity: 'quantity',
      price: 'price'
    },
    prepare({ title, quantity, price }) {
      return {
        title: title || 'No product name',
        subtitle: `Qty: ${quantity || 0} • Price: ₹${price || 0}`
      }
    }
  }
}); 