import { type } from "arktype";

export enum SigninMethod {
  Password = "password",
}

export const SigninPasswordValidator = type({
  hash: "string",
});