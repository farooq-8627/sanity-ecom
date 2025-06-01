import { defineField, defineType } from "sanity";

export default defineType({
  name: 'userCart',
  title: 'User Cart',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'Clerk user ID',
      validation: (Rule) => Rule.required()
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
              name: 'productId',
              title: 'Product ID',
              type: 'string',
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule) => Rule.required().min(1)
            }),
            defineField({
              name: 'addedAt',
              title: 'Added At',
              type: 'datetime',
              initialValue: () => new Date().toISOString()
            })
          ],
          preview: {
            select: {
              productId: 'productId',
              quantity: 'quantity',
              addedAt: 'addedAt'
            },
            prepare({ productId, quantity, addedAt }) {
              return {
                title: `Product: ${productId || 'Unknown'}`,
                subtitle: `Qty: ${quantity || 0} - Added: ${addedAt ? new Date(addedAt).toLocaleString() : 'Unknown'}`
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
      title: 'userId'
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: `Cart: ${title || 'Unknown User'}`
      };
    }
  }
}); 