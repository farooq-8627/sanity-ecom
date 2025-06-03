export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
    },
    {
      name: 'invoice',
      title: 'Invoice',
      type: 'object',
      fields: [
        {
          name: 'id',
          title: 'ID',
          type: 'string',
        },
        {
          name: 'number',
          title: 'Number',
          type: 'string',
        },
        {
          name: 'hosted_invoice_url',
          title: 'Hosted Invoice URL',
          type: 'string',
        },
      ],
    },
    {
      name: 'stripeCheckoutSessionId',
      title: 'Stripe Checkout Session ID',
      type: 'string',
    },
    {
      name: 'stripeCustomerId',
      title: 'Stripe Customer ID',
      type: 'string',
    },
    {
      name: 'clerkUserId',
      title: 'Clerk User ID',
      type: 'string',
    },
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'stripePaymentIntentId',
      title: 'Stripe Payment Intent ID',
      type: 'string',
    },
    {
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        {
          type: 'object',
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
              description: 'Selected size for the product (if applicable)',
            },
          ],
        },
      ],
    },
    {
      name: 'totalPrice',
      title: 'Total Price',
      type: 'number',
    },
    {
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'USD',
    },
    {
      name: 'amountDiscount',
      title: 'Discount Amount',
      type: 'number',
    },
    {
      name: 'address',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Name',
          type: 'string',
        },
        {
          name: 'address',
          title: 'Address',
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
          title: 'ZIP Code',
          type: 'string',
        },
      ],
    },
    {
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Paid', value: 'paid' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Out for Delivery', value: 'out_for_delivery' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
    },
    {
      name: 'orderDate',
      title: 'Order Date',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'orderNumber',
      subtitle: 'status',
    },
  },
}; 