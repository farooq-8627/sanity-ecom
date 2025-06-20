import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Define the document type for TypeScript
interface SanityDocument {
  hasSizes?: boolean;
  [key: string]: any;
}

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "hasSizes",
      title: "Has Size Options?",
      type: "boolean",
      description: "Toggle on if this product has different sizes",
      initialValue: false,
    }),
    defineField({
      name: "sizes",
      title: "Available Sizes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "size",
              title: "Size",
              type: "string",
              validation: (Rule) => Rule.required(),
              options: {
                list: [
                  { title: "XS", value: "XS" },
                  { title: "S", value: "S" },
                  { title: "M", value: "M" },
                  { title: "L", value: "L" },
                  { title: "XL", value: "XL" },
                  { title: "XXL", value: "XXL" },
                  { title: "XXXL", value: "XXXL" },
                ],
              },
            }),
            defineField({
              name: "isEnabled",
              title: "Enable Size",
              type: "boolean",
              description: "Toggle off to mark this size as out of stock",
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              size: "size",
              isEnabled: "isEnabled",
            },
            prepare({ size, isEnabled }) {
              return {
                title: `${size} - ${isEnabled ? "Available" : "Out of Stock"}`,
              };
            },
          },
        },
      ],
      hidden: ({ parent }) => !parent?.hasSizes,
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.min(0),
      hidden: ({ parent }) => parent?.hasSizes,
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: { type: "brand" },
    }),
    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Hot", value: "hot" },
          { title: "Sale", value: "sale" },
        ],
      },
    }),
    defineField({
      name: "variant",
      title: "Product Type",
      type: "reference",
      to: { type: "productVariant" },
      description: "Select a product variant from the list",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Toggle to Featured on or off",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images",
      subtitle: "price",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      const image = media && media[0];
      return {
        title: title,
        subtitle: `$${subtitle}`,
        media: image,
      };
    },
  },
});
