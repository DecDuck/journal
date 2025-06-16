import { RegisterForm } from "~~/forms/register";
import { readJournalValidatedBody, throwingArktype } from "~~/server/arktype";

export default defineEventHandler<{
  body: typeof RegisterForm.validator.infer;
}>(async (h3) => {
    const body = await readJournalValidatedBody(h3, RegisterForm.validator.configure(throwingArktype));
});
