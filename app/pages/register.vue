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
          Create your account
        </h2>
      </div>
      <ArktypeForm
        :forminator="RegisterForm"
        endpoint="/api/v1/register"
        :opts="{ submitText: 'Register' }"
      />

      <p class="text-center text-sm/6 text-gray-500">
        Not a member?
        {{ " " }}
        <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500"
          >Start a 14-day free trial</a
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RegisterForm } from "~~/forms/register";

definePageMeta({
  layout: false,
});

useHead({
  title: "Register",
});
</script>
