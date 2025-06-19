import "~~/server/arktype";
import { type } from "arktype";
import { Forminator } from "./_form";

export const AdminForm = Forminator(
  type({
    about: "string?",
    privacyPolicy: "string?",
    codeOfConduct: "string?",
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
