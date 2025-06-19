import { z } from "zod/v4";
import { Forminator } from "./_form";

export const TagForm = Forminator(
  z.object({
    name: z.string().nonempty(),
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
