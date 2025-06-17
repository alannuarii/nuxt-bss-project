// nuxt.config.ts
export default defineNuxtConfig({
  css: ["@/assets/scss/main.scss", "bootstrap-icons/font/bootstrap-icons.css"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ["node_modules"],
          silenceDeprecations: ["import", "mixed-decls", "color-functions", "global-builtin"],
        },
      },
    },
  },
});
