import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const couponType = defineType({
  name: "coupon",
  title: "Coupons",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "code",
      title: "Coupon Code",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "discountType",
      title: "Discount Type",
      type: "string",
      options: {
        list: [
          { title: "Percentage", value: "percentage" },
          { title: "Fixed Amount", value: "fixed" }
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "discountValue",
      title: "Discount Value",
      type: "number",
      validation: (Rule) => Rule.required().positive()
    }),
    defineField({
      name: "minimumAmount",
      title: "Minimum Cart Amount",
      type: "number",
      validation: (Rule) => Rule.required().positive()
    }),
    defineField({
      name: "maximumDiscount",
      title: "Maximum Discount Amount",
      type: "number",
      validation: (Rule) => Rule.required().positive()
    }),
    defineField({
      name: "validFrom",
      title: "Valid From",
      type: "datetime",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "validUntil",
      title: "Valid Until",
      type: "datetime",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true
    }),
    defineField({
      name: "usageLimit",
      title: "Usage Limit Per User",
      type: "number",
      validation: (Rule) => Rule.required().positive().integer()
    }),
    defineField({
      name: "applicableCategories",
      title: "Applicable Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }]
    })
  ],
  preview: {
    select: {
      title: "code",
      discount: "discountValue",
      type: "discountType"
    },
    prepare({ title, discount, type }) {
      return {
        title,
        subtitle: `${type === "percentage" ? discount + "%" : "₹" + discount} off`
      };
    }
  }
}); 