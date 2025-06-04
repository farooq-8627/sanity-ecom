export const orderType = {
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    {
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'customer',
      title: 'Customer',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Name',
          type: 'string',
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
        },
        {
          name: 'clerkUserId',
          title: 'Clerk User ID',
          type: 'string',
        },
      ],
    },
    {
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'orderItem',
          fields: [
            {
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
            },
            {
              name: 'size',
              title: 'Size',
              type: 'string',
            },
            {
              name: 'price',
              title: 'Price',
              type: 'number',
            },
          ],
        },
      ],
    },
    {
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Full Name',
          type: 'string',
        },
        {
          name: 'address',
          title: 'Address Line 1',
          type: 'string',
        },
        {
          name: 'addressLine2',
          title: 'Address Line 2',
          type: 'string',
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
        },
        {
          name: 'state',
          title: 'State',
          type: 'string',
        },
        {
          name: 'zip',
          title: 'ZIP/Postal Code',
          type: 'string',
        },
        {
          name: 'phoneNumber',
          title: 'Phone Number',
          type: 'string',
        },
      ],
    },
    {
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Cash on Delivery', value: 'cod' },
          { title: 'Failed', value: 'failed' },
          { title: 'Refunded', value: 'refunded' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Stripe', value: 'stripe' },
          { title: 'Cash on Delivery', value: 'cod' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'orderStatus',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'stripeCheckoutId',
      title: 'Stripe Checkout Session ID',
      type: 'string',
    },
    {
      name: 'stripePaymentIntentId',
      title: 'Stripe Payment Intent ID',
      type: 'string',
    },
    {
      name: 'stripeCustomerId',
      title: 'Stripe Customer ID',
      type: 'string',
    },
    {
      name: 'stripeInvoiceId',
      title: 'Stripe Invoice ID',
      type: 'string',
    },
    {
      name: 'stripeInvoiceUrl',
      title: 'Stripe Invoice URL',
      type: 'url',
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'orderNumber',
      subtitle: 'customer.name',
      media: 'customer.image',
    },
  },
} 