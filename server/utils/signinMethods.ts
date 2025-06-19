import { z } from "zod/v4";

export enum SigninMethod {
  Password = "password",
}

export const SigninPasswordValidator = z.object({
  hash: z.string(),
});
