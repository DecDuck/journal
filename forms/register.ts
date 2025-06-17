import { type } from "arktype";
import { Forminator } from "./_form";

export const RegisterForm = Forminator(
  type({
    displayName: "string > 0",
    username: "5 <= string.alphanumeric <= 10",
    email: "string.email",
    password: "string >= 14",
    cftoken: "string > 0",
  }),
  {
    displayName: {
      name: "Display Name",
      description: "Your display name, shown everywhere and can be anything.",
    },
    username: {
      name: "Username",
      description:
        "Used to sign in. Must be between 5 and 10 characters, of lowercase letters and numbers",
    },
    email: {
      name: "Email",
      description: "A valid email. We do not send promotional material.",
    },
    password: {
      name: "Password",
      type: "password",
      description: "At least 14 characters.",
    },
    cftoken: {
      name: "",
      type: "hidden",
    },
  }
);
