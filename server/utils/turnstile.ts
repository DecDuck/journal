import { FetchError } from "ofetch";

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
    const error = e as FetchError;
    console.warn(error, error.data);
    return false;
  }
}
