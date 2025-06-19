import { z } from "zod/v4";
import { Forminator } from "./_form";

export const SigninForm = Forminator(
  z.object({
    usernameEmail: z.string().nonempty(),
    password: z.string().nonempty(),
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
