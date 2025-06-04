import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Indian states mapping
const indianStates = [
  { title: 'Andhra Pradesh', code: 'AP' },
  { title: 'Arunachal Pradesh', code: 'AR' },
  { title: 'Assam', code: 'AS' },
  { title: 'Bihar', code: 'BR' },
  { title: 'Chhattisgarh', code: 'CG' },
  { title: 'Goa', code: 'GA' },
  { title: 'Gujarat', code: 'GJ' },
  { title: 'Haryana', code: 'HR' },
  { title: 'Himachal Pradesh', code: 'HP' },
  { title: 'Jharkhand', code: 'JH' },
  { title: 'Karnataka', code: 'KA' },
  { title: 'Kerala', code: 'KL' },
  { title: 'Madhya Pradesh', code: 'MP' },
  { title: 'Maharashtra', code: 'MH' },
  { title: 'Manipur', code: 'MN' },
  { title: 'Meghalaya', code: 'ML' },
  { title: 'Mizoram', code: 'MZ' },
  { title: 'Nagaland', code: 'NL' },
  { title: 'Odisha', code: 'OD' },
  { title: 'Punjab', code: 'PB' },
  { title: 'Rajasthan', code: 'RJ' },
  { title: 'Sikkim', code: 'SK' },
  { title: 'Tamil Nadu', code: 'TN' },
  { title: 'Telangana', code: 'TG' },
  { title: 'Tripura', code: 'TR' },
  { title: 'Uttar Pradesh', code: 'UP' },
  { title: 'Uttarakhand', code: 'UK' },
  { title: 'West Bengal', code: 'WB' },
  // Union Territories
  { title: 'Andaman and Nicobar Islands', code: 'AN' },
  { title: 'Chandigarh', code: 'CH' },
  { title: 'Dadra and Nagar Haveli and Daman and Diu', code: 'DN' },
  { title: 'Delhi', code: 'DL' },
  { title: 'Jammu and Kashmir', code: 'JK' },
  { title: 'Ladakh', code: 'LA' },
  { title: 'Lakshadweep', code: 'LD' },
  { title: 'Puducherry', code: 'PY' }
];

export const addressType = defineType({
  name: "address",
  title: "Addresses",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "name",
      title: "Address Name",
      type: "string",
      description: "A friendly name for this address (e.g. Home, Work)",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "email",
      title: "User Email",
      type: "email",
    }),
    defineField({
      name: "address",
      title: "Street Address",
      type: "string",
      description: "The street address including apartment/unit number",
      validation: (Rule) => Rule.required().min(5).max(100),
    }),
    defineField({
      name: "addressLine2",
      title: "Address Line 2",
      type: "string",
      description: "Apartment, suite, unit, building, floor, etc.",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "state",
      title: "State",
      type: "object",
      fields: [
        {
          name: 'title',
          title: 'State Name',
          type: 'string',
          options: {
            list: indianStates.map(state => ({ title: state.title, value: state.title }))
          }
        },
        {
          name: 'code',
          title: 'State Code',
          type: 'string'
        }
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "zip",
      title: "PIN Code",
      type: "string",
      description: "6-digit Indian PIN code",
      validation: (Rule) =>
        Rule.required()
          .regex(/^[1-9][0-9]{5}$/, {
            name: "pinCode",
            invert: false,
          })
          .custom((pin: string | undefined) => {
            if (!pin) {
              return "PIN code is required";
            }
            if (!pin.match(/^[1-9][0-9]{5}$/)) {
              return "Please enter a valid 6-digit PIN code";
            }
            return true;
          }),
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
      description: "10-digit mobile number",
      validation: (Rule) =>
        Rule.required()
          .regex(/^[6-9][0-9]{9}$/, {
            name: "phoneNumber",
            invert: false,
          })
          .custom((phone: string | undefined) => {
            if (!phone) {
              return "Phone number is required";
            }
            if (!phone.match(/^[6-9][0-9]{9}$/)) {
              return "Please enter a valid 10-digit mobile number";
            }
            return true;
          }),
    }),
    defineField({
      name: "default",
      title: "Default Address",
      type: "boolean",
      description: "Is this the default shipping address?",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "address",
      city: "city",
      state: "state.title",
      isDefault: "default",
    },
    prepare({ title, subtitle, city, state, isDefault }) {
      return {
        title: `${title} ${isDefault ? "(Default)" : ""}`,
        subtitle: `${subtitle}, ${city}, ${state}`,
      };
    },
  },
});
