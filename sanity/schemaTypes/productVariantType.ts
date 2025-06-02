import { defineField, defineType } from "sanity";

export default defineType({
  name: "productVariant",
  title: "Product Variant",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      description: "URL-friendly value (e.g., 'home-kitchen')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
  ],
  preview: {
    select: {
      title: "title",
      value: "value",
      media: "icon",
    },
    prepare({ title, value, media }) {
      return {
        title,
        subtitle: value,
        media,
      };
    },
  },
}); 