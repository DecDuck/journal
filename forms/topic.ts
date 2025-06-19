import { Forminator } from "./_form";
import { z } from "zod/v4";

export const TopicForm = Forminator(
  z.object({
    name: z.string().nonempty(),
    description: z.string().nonempty(),
  }),
  {
    name: {
      name: "Name",
      description: "Name of the topic.",
      placeholder: "Support",
    },
    description: {
      name: "Description",
      description:
        "Description of the topic. Recommended to keep under 70 words.",
      placeholder: "Post here if you are having issues with the project.",
    },
  }
);
