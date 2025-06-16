<template>
  <div
    class="flex min-h-screen flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-sm space-y-10">
      <div>
        <AppIcon class="mx-auto h-10 w-auto" />
        <h2
          class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
        >
          Sign in to your account
        </h2>
      </div>
      <ArktypeForm
        :forminator="SigninForm"
        endpoint="/api/v1/auth/password/signin"
        :opts="{ submitText: 'Sign in' }"
        @submit="() => onSignin()"
      />

      <p class="text-center text-sm/6 text-gray-500">
        Don't have an account?
        {{ " " }}
        <NuxtLink
          href="/register"
          class="font-semibold text-blue-600 hover:text-blue-500"
          >Create your account &rarr;</NuxtLink
        >
      </p>
      <p class="text-center">
        <NuxtLink
          href="/"
          class="text-xs font-semibold text-gray-400 hover:text-gray-500"
          >&larr; Back home </NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SigninForm } from "~~/forms/signin";

definePageMeta({
  layout: false,
});

useHead({
  title: "Sign in",
});

const router = useRouter();

async function onSignin() {
  await updateUser();
  router.push("/");
}
</script>
