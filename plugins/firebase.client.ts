// plugins/firebase.client.ts
import { defineNuxtPlugin } from "#app";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

export default defineNuxtPlugin((nuxtApp) => {
  // Access runtime config within the plugin
  const config = useRuntimeConfig();
  console.log("Runtime Config:", config.public);

  const firebaseConfig = {
    apiKey:
      config.public.firebaseApiKey || "AIzaSyCC6xq_lS1pSq0oXYOrok8wiGpb6aR7HHk", // Fallback for testing
    authDomain: config.public.authDomain,
    projectId: config.public.projectId,
    storageBucket: config.public.storageBucket,
    messagingSenderId: config.public.messagingSenderId,
    appId: config.public.appId,
    measurementId: config.public.measurementId,
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  // Set persistence
  setPersistence(auth, browserLocalPersistence);

  // Provide Firebase instances to the app
  nuxtApp.provide("auth", auth);
  nuxtApp.provide("googleProvider", googleProvider);
});
