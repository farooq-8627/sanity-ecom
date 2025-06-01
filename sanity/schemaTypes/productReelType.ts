import { PlayIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productReelType = defineType({
  name: "productReel",
  title: "Product Reels",
  type: "document",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "video",
      title: "Reel Video",
      type: "file",
      options: {
        accept: "video/*"
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Reel Thumbnail",
      type: "image",
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: "likes",
      title: "Likes Count",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "views",
      title: "Views Count",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "likedBy",
      title: "Liked By",
      type: "array",
      description: "Users who have liked this reel",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "userId",
              title: "User ID",
              type: "string",
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: "likedAt",
              title: "Liked At",
              type: "datetime",
              initialValue: () => new Date().toISOString()
            })
          ]
        }
      ],
      options: {
        sortable: false
      }
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: {
      title: "product.name",
      media: "thumbnail",
      likes: "likes",
      views: "views",
    },
    prepare(selection) {
      const { title, media, likes, views } = selection;
      return {
        title: title || "Untitled Reel",
        subtitle: `👍 ${likes || 0} • 👁️ ${views || 0}`,
        media: media || PlayIcon,
      };
    },
  },
}); 