import { RegisterForm } from "~~/forms/register";
import { readJournalValidatedBody, throwingArktype } from "~~/server/arktype";
import { user, userSigninMethods } from "~~/server/database/schema";
import { randomUUID } from "~~/server/utils/uuid";
import * as jdenticon from "jdenticon";
import type { SigninPasswordValidator } from "~~/server/utils/signinMethods";
import { SigninMethod } from "~~/server/utils/signinMethods";
import { hashPassword } from "~~/server/utils/password";
import { validateTurnstile } from "~~/server/utils/turnstile";

export default defineEventHandler<{
  body: typeof RegisterForm.validator.infer;
}>(async (h3) => {
  const body = await readJournalValidatedBody(
    h3,
    RegisterForm.validator.configure(throwingArktype)
  );

  // Turnstile validation
  const turnstileResult = await validateTurnstile(body.cftoken);

  if (!turnstileResult)
    throw createError({
      statusCode: 400,
      statusMessage: "Failed to validate Turnstile token.",
    });

  // Create user
  const drizzle = useDrizzle();

  // Check existing
  const existing = await drizzle
    .select()
    .from(user)
    .where(eq(user.username, body.username))
    .limit(1);
  if (existing.length != 0)
    throw createError({
      statusCode: 400,
      statusMessage: "User already exists with that username.",
    });

  const blob = hubBlob();

  const userId = randomUUID();

  // https://github.com/cloudflare/workers-sdk/issues/5771
  const avatarBlob = new Blob([
    jdenticon.toPng(userId, 256) as unknown as ArrayBuffer,
  ]);
  const avatar = await blob.put(userId, avatarBlob, {
    prefix: "avatar",
    customMetadata: {
      permissions: "anonymous:read",
    },
  });

  const newUser = {
    id: userId,
    avatar: avatar.pathname,
    createdAt: new Date(),
    displayName: body.displayName,
    username: body.username,
    email: body.email,
  } satisfies typeof user.$inferInsert;

  const [newlyCreatedUser] = await drizzle
    .insert(user)
    .values(newUser)
    .returning();

  const passwordAuth = {
    hash: await hashPassword(body.password),
  } satisfies typeof SigninPasswordValidator.infer;

  const signinMethod = {
    userId: newlyCreatedUser.id,
    method: SigninMethod.Password,
    data: JSON.stringify(passwordAuth),
  } satisfies typeof userSigninMethods.$inferInsert;

  await drizzle.insert(userSigninMethods).values(signinMethod);

  await setResponseStatus(h3, 201);

  return;
});
