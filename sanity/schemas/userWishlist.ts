import { defineField, defineType } from "sanity";

export default defineType({
  name: 'userWishlist',
  title: 'User Wishlist',
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
      name: 'products',
      title: 'Wishlist Products',
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
              name: 'addedAt',
              title: 'Added At',
              type: 'datetime',
              initialValue: () => new Date().toISOString()
            })
          ],
          preview: {
            select: {
              productId: 'productId',
              addedAt: 'addedAt'
            },
            prepare({ productId, addedAt }) {
              return {
                title: `Product: ${productId || 'Unknown'}`,
                subtitle: addedAt ? new Date(addedAt).toLocaleString() : 'Unknown date'
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
        title: `Wishlist: ${title || 'Unknown User'}`
      };
    }
  }
}); 