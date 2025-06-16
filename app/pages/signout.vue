<template>
  <div>
    <div v-if="user" class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2
          class="text-2xl font-semibold tracking-tight text-balance text-gray-900 sm:text-3xl"
        >
          Are you sure you want to sign out?
        </h2>
        <p class="mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-gray-600">
          You will have to sign in again if you want to access your account.
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <LoadingButton :loading="signoutLoading" @click="() => signout()"
            >Sign out &rarr;</LoadingButton
          >
        </div>
      </div>
    </div>
    <div v-else class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2
          class="text-2xl font-semibold tracking-tight text-balance text-gray-900 sm:text-3xl"
        >
          You are signed out.
        </h2>
        <p class="mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-gray-600">
          Please sign in if you want to access your account.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useUser();

const signoutLoading = ref(false);
async function signout() {
  signoutLoading.value = true;
  try {
    await $journalFetch("/api/v1/auth/signout", { method: "POST" });
  } catch (e) {
    // Throw smth
          createErrorNotification("Failed to sign you out.", e);

  }
  await updateUser();
  signoutLoading.value = false;
}
</script>
