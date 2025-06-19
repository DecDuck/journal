export async function validateTurnstile(token: string) {
  const runtimeConfig = useRuntimeConfig();

  const formData = new FormData();
  formData.append("secret", runtimeConfig.turnstileSecret);
  formData.append("response", token);
  try {
    const result = await $fetch<{ success: boolean }>(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        body: formData,
        method: "POST",
      }
    );
    return result.success;
  } catch (e) {
    console.warn(e);
    return false;
  }
}
