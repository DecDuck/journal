export async function validateTurnstile(token: string) {
  const runtimeConfig = useRuntimeConfig();
  const result = await $fetch<{ success: boolean }>(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      body: {
        secret: runtimeConfig.turnstileSecret,
        response: token,
      },
      method: "POST",
    }
  );
  return result.success;
}
