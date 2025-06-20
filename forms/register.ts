import { z } from "zod/v4";
import { Forminator } from "./_form";

export const RegisterForm = Forminator(
  z
    .object({
      displayName: z.string().nonempty(),
      username: z
        .string()
        .regex(/^[a-zA-Z0-9]+$/g)
        .min(5)
        .max(10)
        .transform((e) => e.toLowerCase()),
      email: z.string().regex(/^\S+@\S+\.\S+$/g),
      password: z.string().min(14),
      confirmPassword: z.string(),
      cftoken: z.string(),
    })
    .check((ctx) => {
      if (ctx.value.password !== ctx.value.confirmPassword) {
        ctx.issues.push({
          code: "custom",
          message: "Passwords don't match",
          input: ctx.value.confirmPassword,
          path: ["confirmPassword"],
        });
      }
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
    confirmPassword: {
      name: "Confirm Password",
      type: "password",
      description: "Must match your password.",
    },
    cftoken: {
      name: "",
      type: "hidden",
    },
  }
);
