import type { User } from "~~/server/utils/drizzle";
import { FetchError } from "ofetch";
import type { SerializeObject } from "nitropack";

// User = signed in
// null = not signed in
// undefined = needs check
export const useUser = () =>
  useState<SerializeObject<User> | undefined | null>(undefined);

export async function updateUser() {
  const user = useUser();
  try {
    const freshUser = await $journalFetch("/api/v1/user");
    user.value = freshUser;
  } catch (e) {
    if (e instanceof FetchError) {
      if (e.statusCode == 403) {
        user.value = null;
        return;
      }
    }
    throw e; // Let someone else handle it
  }
}
