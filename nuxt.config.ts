import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },
  modules: ["@pinia/nuxt"],
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FB_AUTH_DOMAIN,
      projectId: process.env.FB_PROJECT_ID,
      storageBucket: process.env.FB_STORAGE_BUCKET,
      messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
      appId: process.env.FB_APP_ID,
      measurementId: process.env.FB_MEASUREMENT_ID,
      adminId: process.env.NUXT_PUBLIC_ADMIN_ID,
    },
  },
  app: {
    head: {
      title: "ReadSpeed: Multilingual Reading Speed Test App",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Measure and improve your reading speed (WPM) in multiple languages with ReadSpeed. Track progress, test comprehension, and challenge yourself with diverse topics.",
        },
        {
          name: "keywords",
          content:
            "reading speed test, WPM calculator, multilingual reading, language learning, reading comprehension",
        },
        {
          property: "og:title",
          content: "ReadSpeed: Multilingual Reading Speed Test App",
        },
        {
          property: "og:description",
          content:
            "A web app to test and improve your reading speed across languages and topics.",
        },
        { property: "og:type", content: "website" },

        // Twitter Card
        { name: "twitter:card", content: "summary" },
        {
          name: "twitter:title",
          content: "ReadSpeed: Multilingual Reading Speed Test App",
        },
        {
          name: "twitter:description",
          content:
            "Test your reading speed in multiple languages and track your progress!",
        },
      ],
      link: [],
    },
  },

  modules: ["@pinia/nuxt"],
});
