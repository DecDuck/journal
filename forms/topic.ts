import { type } from "arktype";
import { Forminator } from "./_form";

export const TopicForm = Forminator(
  type({
    name: "string",
    description: "string",
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
