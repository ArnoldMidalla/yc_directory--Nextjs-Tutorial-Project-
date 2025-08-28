import { defineField, defineType } from "sanity";

export const startup = defineType({
  name: "startup",
  title: "Startup",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug", //slug is unique name. can be used as unique link
      type: "slug",
      options: {
        source: "title", //auto generated slug by sanity e.g. this-is-auto-from-title
      },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "views",
      type: "number",
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "category",
      type: "string",
      validation: (Rule) =>
        Rule.min(1).max(20).required().error("Please enter a category"),
    }),
    defineField({
      name: "bio",
      type: "text",
    }),
    defineField({
      name: "image",
      type: "url",
      validation: (Rule)=> Rule.required()
    }),
    defineField({
      name: "pitch",
      type: "markdown", //npm install sanity-plugin-markdown cos markdown is a custom sanity smth. then add it to sanity.config>plugins (2)
    }),
  ],
});
