export const orderItemType = {
  name: 'orderItem',
  title: 'Order Item',
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
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
  ],
}; 