import { defineField, defineType } from "sanity";

export const userAddressType = defineType({
  name: "userAddresses",
  title: "User Addresses",
  type: "document",
  fields: [
    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "addresses",
      title: "Addresses",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
      name: "addressName",
      title: "Address Name",
      type: "string",
              validation: (Rule) => Rule.required()
            },
            {
      name: "fullName",
      title: "Full Name",
      type: "string",
              validation: (Rule) => Rule.required()
            },
            {
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
              validation: (Rule) => Rule.required()
            },
            {
      name: "addressLine1",
      title: "Address Line 1",
      type: "string",
              validation: (Rule) => Rule.required()
            },
            {
      name: "addressLine2",
      title: "Address Line 2",
              type: "string"
            },
            {
      name: "city",
      title: "City",
      type: "string",
              validation: (Rule) => Rule.required()
            },
            {
      name: "state",
      title: "State",
              type: "object",
              validation: (Rule) => Rule.required(),
              fields: [
                {
                  name: "code",
                  title: "State Code",
                  type: "string",
                  validation: (Rule) => Rule.required()
                },
                {
                  name: "title",
                  title: "State Name",
      type: "string",
                  validation: (Rule) => Rule.required()
                }
              ]
            },
            {
      name: "pincode",
      title: "Pincode",
      type: "string",
              validation: (Rule) => Rule.required()
            },
            {
      name: "isDefault",
              title: "Is Default Address",
      type: "boolean",
              initialValue: false
            }
          ]
        }
      ]
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      initialValue: () => new Date().toISOString()
    })
  ],
  preview: {
    select: {
      title: 'clerkUserId',
      addresses: 'addresses'
    },
    prepare({ title, addresses }) {
      return {
        title: `Addresses for ${title}`,
        subtitle: `${addresses?.length || 0} addresses`
      };
    }
  }
}); 