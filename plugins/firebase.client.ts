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

  // Firebase configuration with fallbacks
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey || "AIzaSyCC6xq_lS1pSq0oXYOrok8wiGpb6aR7HHk",
    authDomain: config.public.authDomain || "read-rocket.web.app",
    projectId: config.public.projectId || "read-rocket",
    storageBucket: config.public.storageBucket || "read-rocket.appspot.com",
    messagingSenderId: config.public.messagingSenderId || "123456789",
    appId: config.public.appId || "1:123456789:web:abcdef123456",
    measurementId: config.public.measurementId || "G-XXXXXXXXXX",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Auth
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  
  // Configure Google provider
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
  
  setPersistence(auth, browserLocalPersistence);

  // Initialize Firestore
  const db = getFirestore(app);

  // Provide services to the app
  nuxtApp.provide("auth", auth);
  nuxtApp.provide("db", db);
  nuxtApp.provide("googleProvider", googleProvider);
});
