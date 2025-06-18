import { type } from "arktype";
import { Forminator } from "./_form";

const maxIndividual = 2 * 1024 * 1024; // 2 MB
const maxTotal = 10 * 1024 * 1024; // 10 MB

export const ReplyForm = Forminator(
  type({
    content: "string > 0",
    attachments: "object[]?",
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
    content: {
      name: "Body",
      type: "shortMarkdown",
      placeholder: "I was... ",
      description:
        "Your reply body. Outline everything you want to address in your reply. ",
    },
    attachments: {
      name: "Attachments",
      type: "attachments",
      description: "Upload relevant files to be attached to your reply.",
      configuration: {
        maxIndividual,
        maxTotal,
      },
    },
  }
);
