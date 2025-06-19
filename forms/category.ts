import { z } from "zod/v4";
import { Forminator } from "./_form";

export const CategoryForm = Forminator(
  z.object({
    name: z.string().nonempty(),
    description: z.string().nonempty(),
    readPermission: z.number().default(-1),
    writePermission: z.number().default(0),
    adminPermission: z.number().default(900),
    repository: z.string().optional(),
  }),
  {
    name: {
      name: "Name",
      description: "Public name of your category.",
      placeholder: "Annoucements",
    },
    description: {
      name: "Description",
      description:
        "Description of your categroy. Recommended to keep it under 250 words.",
      placeholder: "A place for all the important information.",
    },
    readPermission: {
      name: "Read Permission",
      description:
        "Permission level required to view this category. -1 for public access, 0 for logged-in, and 1-999 for custom permission levels.",
      type: "number",
      placeholder: "-1",
      default: -1,
    },
    writePermission: {
      name: "Post Permission",
      description:
        "Permission level required to post in this category. 0 for logged-in, and 1-999 for custom permission levels. Regardless of permission level, users will have to be logged in to post.",
      type: "number",
      placeholder: "0",
      default: 0,
    },
    adminPermission: {
      name: "Admin Permission",
      type: "number",
      placeholder: "900",
      default: 900,
      description:
        "Permission level required to delete and edit other posts in this category. ",
    },
    repository: {
      name: "GitHub repository",
      placeholder: "https://github.com/.../...",
      description:
        "Tie this category and the posts in it to a GitHub repository. Automatically convert forum threads to issues. ",
    },
  }
);
