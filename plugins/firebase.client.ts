// plugins/firebase.client.ts
import { defineNuxtPlugin } from "#app";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin((nuxtApp) => {
  // Access runtime config
  const config = useRuntimeConfig();

  // Firebase configuration
  const firebaseConfig = {
    apiKey:
      config.public.firebaseApiKey || "AIzaSyCC6xq_lS1pSq0oXYOrok8wiGpb6aR7HHk",
    authDomain: config.public.authDomain,
    projectId: config.public.projectId,
    storageBucket: config.public.storageBucket,
    messagingSenderId: config.public.messagingSenderId,
    appId: config.public.appId,
    measurementId: config.public.measurementId,
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Auth
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  setPersistence(auth, browserLocalPersistence);

  // Initialize Firestore
  const db = getFirestore(app);

  // Provide services to the app
  nuxtApp.provide("auth", auth);
  nuxtApp.provide("googleProvider", googleProvider);
  nuxtApp.provide("db", db);
});
