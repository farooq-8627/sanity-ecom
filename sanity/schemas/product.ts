export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image' }],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'discount',
      title: 'Discount (%)',
      type: 'number',
      validation: (Rule: any) => Rule.min(0).max(100),
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
        },
      ],
    },
    {
      name: 'hasSizes',
      title: 'Has Size Options?',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'size',
              title: 'Size',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
              options: {
                list: [
                  { title: 'XS', value: 'XS' },
                  { title: 'S', value: 'S' },
                  { title: 'M', value: 'M' },
                  { title: 'L', value: 'L' },
                  { title: 'XL', value: 'XL' },
                  { title: 'XXL', value: 'XXL' },
                ],
              },
            },
            {
              name: 'isEnabled',
              title: 'Enable Size',
              type: 'boolean',
              initialValue: true,
            }
          ],
          preview: {
            select: {
              size: 'size',
              isEnabled: 'isEnabled'
            },
            prepare({ size, isEnabled }: { size: string; isEnabled: boolean }) {
              return {
                title: `${size} - ${isEnabled ? 'Enabled' : 'Disabled'}`
              }
            }
          }
        }
      ],
      hidden: ({ document }: { document: any }) => !document?.hasSizes,
    },
    {
      name: 'stock',
      title: 'Stock',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
      hidden: ({ document }: { document: any }) => document?.hasSizes,
    },
    {
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{ type: 'brand' }],
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Hot', value: 'hot' },
          { title: 'Sale', value: 'sale' },
        ],
      },
    },
    {
      name: 'variant',
      title: 'Variant',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'value',
          title: 'Value',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
        },
      ],
    },
    {
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    },
  ],
}; 