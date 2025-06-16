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
  ],

  // https://devtools.nuxt.com
  devtools: { enabled: true },

  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: "2025-03-01",

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {},

  runtimeConfig: {
    public: {
      whitelabel: {
        title: "Journal",
      },
    },
    sessionSecret: "superdupersecretsuperuduperpdasudij"
  },

  vite: { plugins: [tailwindcss()] },
  css: ["~/assets/tailwind.css"],
});
