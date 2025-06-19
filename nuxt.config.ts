export default defineNuxtConfig({
  css: ["@/assets/scss/main.scss", "bootstrap-icons/font/bootstrap-icons.css"],

  // Konfigurasi untuk scss & vite
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

  // ✅ Runtime config untuk API dan lingkungan
  runtimeConfig: {
    // Server-only (tidak terlihat di browser)
    API_AUTH: process.env.API_AUTH || 'http://api-auth:8888',
    ENDPOINT: process.env.ENDPOINT || 'http://api-bssopt:5000',
    URL: process.env.URL || 'http://influxdb:8086',

    // Public config (bisa diakses dari browser)
    public: {
      API_AUTH_PUBLIC: process.env.NUXT_PUBLIC_API_AUTH || 'http://localhost:8888',
      SITE_URL: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      ORG: process.env.ORG || 'upmh-tahuna',
      BUCKET: process.env.BUCKET || 'ipc-tahuna',
      TOKEN: process.env.TOKEN || ''
    }
  },

  // ✅ Jalankan Nuxt dalam mode server untuk SSR + cookie
  ssr: true,

  // ✅ Nitro preset node
  nitro: {
    preset: 'node'
  },

  // ✅ Middleware global jika perlu (opsional)
  routeRules: {
    // contoh: '/dashboard/**': { ssr: true }
  },

  // ✅ Enable CORS jika Nuxt bertindak sebagai proxy (opsional)
  // jika Anda ingin proxy request API
  // devServer: {
  //   proxy: {
  //     '/api': 'http://api-auth:8888'
  //   }
  // }
});
