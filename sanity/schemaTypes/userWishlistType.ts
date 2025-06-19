import { defineField, defineType } from "sanity";

export const userWishlistType = defineType({
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
      name: 'items',
      title: 'Wishlist Items',
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
              name: 'productName',
              title: 'Product Name',
              type: 'string',
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'addedAt',
              title: 'Added At',
              type: 'datetime',
              validation: (Rule) => Rule.required()
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
      title: 'Last Updated',
      type: 'datetime'
    })
  ],
  preview: {
    select: {
      title: 'userId',
      items: 'items'
    },
    prepare(selection) {
      const { title, items } = selection;
      return {
        title: `Wishlist: ${title || 'Unknown User'}`,
        subtitle: `${items?.length || 0} items`
      };
    }
  }
}); 