import type { JournalSession } from "#imports";
import { SigninForm } from "~~/forms/signin";
import { readJournalValidatedBody, throwyZod } from "~~/server/validation";
import { user, userSigninMethods } from "~~/server/database/schema";
import { first } from "~~/server/utils/drizzle";

export default defineEventHandler(async (h3) => {
  const body = await readJournalValidatedBody(h3, SigninForm.validator);

  const drizzle = useDrizzle();

  function fail() {
    return createError({
      statusCode: 403,
      statusMessage: "Invalid username, email, or password.",
    });
  }

  const fetchedUser = await first(
    drizzle
      .select()
      .from(user)
      .where(
        or(
          eq(user.email, body.usernameEmail),
          eq(user.username, body.usernameEmail)
        )
      )
      .limit(1)
  );
  if (!fetchedUser) throw fail();

  const signinMethod = await first(
    drizzle
      .select()
      .from(userSigninMethods)
      .where(
        and(
          eq(userSigninMethods.userId, fetchedUser.id),
          eq(userSigninMethods.method, SigninMethod.Password)
        )
      )
      .limit(1)
  );

  if (!signinMethod) throw fail();

  const rawData = JSON.parse(signinMethod.data);
  const data = throwyZod(SigninPasswordValidator.safeParse(rawData));

  const valid = await verifyPassword(data.hash, body.password);
  if (!valid) throw fail();

  // We've signed in at the point
  const session = await useSession<JournalSession>(h3, GLOBAL_SESSION_CONFIG);

  await session.update({ userId: fetchedUser.id });

  await setResponseStatus(h3, 201);

  return;
});
