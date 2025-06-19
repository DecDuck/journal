import { Forminator } from "./_form";
import { z } from "zod/v4";

export const AdminForm = Forminator(
  z.object({
    about: z.string().optional(),
    privacyPolicy: z.string().optional(),
    codeOfConduct: z.string().optional(),
  }),
  {
    about: {
      name: "About",
      type: "markdown",
      description:
        "What is this forum about? Provide useful links, information, etc.",
    },
    privacyPolicy: {
      name: "Privacy Policy",
      type: "markdown",
      description: "Provide a privacy policy (if you need one).",
    },
    codeOfConduct: {
      name: "Code of Conduct",
      type: "markdown",
      description: "Outline how your users should behave on your site.",
    },
  }
);
