import { RegisterForm } from "~~/forms/register";
import { readJournalValidatedBody } from "~~/server/validation";
import { user, userSigninMethods } from "~~/server/database/schema";
import { randomUUID } from "~~/server/utils/uuid";
import type { SigninPasswordValidator } from "~~/server/utils/signinMethods";
import { SigninMethod } from "~~/server/utils/signinMethods";
import { hashPassword } from "~~/server/utils/password";
import { validateTurnstile } from "~~/server/utils/turnstile";
import type { z } from "zod/v4";
import { generateFromString } from "generate-avatar";

export default defineEventHandler(async (h3) => {
  const body = await readJournalValidatedBody(h3, RegisterForm.validator);

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

  const avatarStr = generateFromString(userId);
  const avatar = await blob.put(userId, avatarStr, {
    prefix: "avatar",
    customMetadata: {
      permissions: "anonymous:read",
    },
    contentType: "image/svg+xml",
  });

  const newUser = {
    id: userId,
    avatar: avatar.pathname,
    createdAt: new Date(),
    displayName: body.displayName,
    username: body.username,
    email: body.email,
  } satisfies typeof user.$inferInsert;

  const newlyCreatedUser = await first(
    drizzle.insert(user).values(newUser).returning()
  );
  if (!newlyCreatedUser) throw createError({ statusCode: 500 });

  const passwordAuth = {
    hash: await hashPassword(body.password),
  } satisfies z.infer<typeof SigninPasswordValidator>;

  const signinMethod = {
    userId: newlyCreatedUser.id,
    method: SigninMethod.Password,
    data: JSON.stringify(passwordAuth),
  } satisfies typeof userSigninMethods.$inferInsert;

  await drizzle.insert(userSigninMethods).values(signinMethod);

  await setResponseStatus(h3, 201);

  return;
});
