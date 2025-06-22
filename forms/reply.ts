import { z } from "zod/v4";
import { Forminator } from "./_form";

const maxIndividual = 2 * 1024 * 1024; // 2 MB
const maxTotal = 10 * 1024 * 1024; // 10 MB

export const ReplyForm = Forminator(
  z.object({
    content: z.string().nonempty().max(5000),
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
  }),
  {
    content: {
      name: "Body",
      type: "shortMarkdown",
      placeholder: "I was... ",
      description:
        "Your reply body. Outline everything you want to address in your reply. <5000 characters.",
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
