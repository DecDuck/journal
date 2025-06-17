import { type } from "arktype";
import { Forminator } from "./_form";

export const TagForm = Forminator(
  type({
    name: "string",
  }),
  {
    name: {
      name: "Tag Name",
      placeholder: "bug",
      description:
        "The name of the tag. Recommended to choose something generic and short, usually one or two words. ",
    },
  }
);
