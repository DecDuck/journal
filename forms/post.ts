import { type } from "arktype";
import { Forminator } from "./_form";

const maxIndividual = 2 * 1024 * 1024; // 2 MB
const maxTotal = 10 * 1024 * 1024; // 10 MB

export const PostForm = Forminator(
  type({
    title: "string > 0",
    content: "string > 0",
    tags: "string[]",
    attachments: "object[]?",
    cftoken: "string",
  }).narrow((v, ctx) => {
    if (v.attachments) {
      const files = v.attachments as File[];
      if (files.find((e) => e.size > maxIndividual)) {
        return ctx.reject({
          path: ["attachments"],
          expected: `less than ${maxIndividual} bytes`,
          actual: "",
        });
      }
      const total = files.reduce((a, b) => a + b.size, 0);
      if (total > maxTotal) {
        return ctx.reject({
          path: ["attachments"],
          expected: `total less than ${maxTotal} bytes`,
          actual: total.toString(),
        });
      }
    }
    return true;
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
        "Your post body. Outline everything you want to address in your post. ",
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
