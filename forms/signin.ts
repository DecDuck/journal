import { type } from "arktype";
import { Forminator } from "./_form";

export const SigninForm = Forminator(
  type({
    usernameEmail: "string > 0",
    password: "string > 0",
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
