import { defineField, defineType } from "sanity";
import { ComposeIcon } from "@sanity/icons";

export const colorGroupType = defineType({
  name: "colorGroup",
  title: "Color Groups",
  type: "document",
  icon: ComposeIcon,
  fields: [
    defineField({
      name: "name",
      title: "Group Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Name to identify this group of color variants (e.g. 'Basic Cotton Tee Colors')",
    }),
    defineField({
      name: "products",
      title: "Color Variants",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
          options: {
            filter: ({ document }) => ({
              filter: "_id != $id",
              params: { id: document._id }
            })
          }
        }
      ],
      validation: (Rule) => Rule.required().min(1),
      description: "Add all color variants of the product to this group",
    }),
  ],
  preview: {
    select: {
      title: "name",
      products: "products",
    },
    prepare({ title, products }) {
      const variantCount = Array.isArray(products) ? products.length : 0;
      return {
        title: title || "Unnamed Color Group",
        subtitle: `${variantCount} color variant${variantCount === 1 ? "" : "s"}`,
      };
    },
  },
}); 