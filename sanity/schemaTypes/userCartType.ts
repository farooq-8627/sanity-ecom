import { defineField, defineType } from "sanity";

export const userCartType = defineType({
  name: 'userCart',
  title: 'User Cart',
  type: 'document',
  fields: [
    defineField({
      name: 'clerkUserId',
      title: 'Clerk User ID',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Cart Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule: any) => Rule.required().min(1),
            }),
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string',
              description: 'Selected size for the product (if applicable)',
            }),
          ],
          preview: {
            select: {
              productName: 'product.name',
              quantity: 'quantity',
              size: 'size',
              productImage: 'product.images.0'
            },
            prepare({ productName, quantity, size, productImage }) {
              return {
                title: productName || 'Unknown Product',
                subtitle: `Qty: ${quantity || 0}${size ? ` - Size: ${size}` : ''}`,
                media: productImage
              };
            }
          }
        }
      ]
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    })
  ],
  preview: {
    select: {
        title: 'clerkUserId',
        subtitle: 'updatedAt',
        items: 'items'
      },
      prepare(selection: Record<string, any>) {
        const { title, subtitle, items } = selection;
        return {
          title: `Cart: ${title || 'Unknown'}`,
          subtitle: `${items?.length || 0} items - Last updated: ${new Date(subtitle).toLocaleString()}`
        };
      }
  }
}); 