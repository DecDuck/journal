import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    "@nuxthub/core",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/scripts",
  ],

  // https://devtools.nuxt.com
  devtools: { enabled: true },

  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: "2025-03-01",

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {
    blob: true,
    database: true,
  },

  runtimeConfig: {
    public: {
      whitelabel: {
        title: "Journal",
      },
      turnstileSitekey: "1x00000000000000000000AA",
    },
    sessionSecret: "superdupersecretsuperuduperpdasudij",
    turnstileSecret: "1x0000000000000000000000000000000AA",
  },

  vite: { plugins: [tailwindcss()] },
  css: ["~/assets/tailwind.css"],

  app: {
    head: {
      script: [
        {
          src: "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
        },
      ],
    },
  },
});
