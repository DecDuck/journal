import { z } from "zod/v4";
import { Forminator } from "./_form";

const maxIndividual = 2 * 1024 * 1024; // 2 MB
const maxTotal = 10 * 1024 * 1024; // 10 MB

export const PostForm = Forminator(
  z.object({
    title: z.string().nonempty(),
    content: z.string().nonempty().max(5000),
    tags: z.array(z.string()),
    attachments: z
      .array(z.unknown())
      .optional()
      .refine(
        (v) => {
          if (!v) return true;
          const files = v as unknown as File[];
          if (files.find((e) => e.size > maxIndividual)) {
            return false;
          }
          const total = files.reduce((a, b) => a + b.size, 0);
          if (total > maxTotal) {
            return false;
          }
          return true;
        },
        { error: "Attachments invalid." }
      ),
    cftoken: z.string(),
  }),
  {
    title: {
      name: "Title",
      placeholder: "My Post",
      description:
        "Your post title. Clearly explain the purpose of the post, or what the issue is. Do not use something like 'Help me' or 'What is this?'",
    },
    content: {
      name: "Body",
      type: "markdown",
      placeholder: "I was... ",
      description:
        "Your post body. Outline everything you want to address in your post. <5000 characters",
    },
    tags: {
      name: "Tags",
      type: "tags",
      description:
        "Please add the relevant tags to your post to help other users find it.",
    },
    attachments: {
      name: "Attachments",
      type: "attachments",
      description: "Upload relevant files to be attached to your post.",
      configuration: {
        maxIndividual,
        maxTotal,
      },
    },
    cftoken: {
      name: "",
      type: "hidden",
    },
  }
);
