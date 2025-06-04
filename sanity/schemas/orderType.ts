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
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    },
    {
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
    },
    {
      name: 'clerkUserId',
      title: 'Clerk User ID',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Shipping Address',
      type: 'address',
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
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
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
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Cash on Delivery', value: 'cod' },
          { title: 'PhonePe', value: 'phonepe' },
        ],
      },
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
          { title: 'Failed', value: 'failed' },
          { title: 'COD', value: 'cod' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'phonepeDetails',
      title: 'PhonePe Payment Details',
      type: 'object',
      hidden: ({ document }: { document: { paymentMethod?: string } }) => document?.paymentMethod !== 'phonepe',
      fields: [
        {
          name: 'merchantTransactionId',
          title: 'Merchant Transaction ID',
          type: 'string',
        },
        {
          name: 'providerReferenceId',
          title: 'Provider Reference ID',
          type: 'string',
        },
        {
          name: 'paymentState',
          title: 'Payment State',
          type: 'string',
        },
        {
          name: 'payResponseCode',
          title: 'Payment Response Code',
          type: 'string',
        }
      ]
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