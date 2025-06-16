import { type } from "arktype";
import { Forminator } from "./_form";

export const SigninForm = Forminator(
  type({
    usernameEmail: "string",
    password: "string",
  }),
  {
    usernameEmail: {
      name: "Username or email",
    },
    password: {
      name: "Password",
      type: "password",
    },
  }
);
