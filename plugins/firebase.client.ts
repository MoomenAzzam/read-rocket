import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const firebaseConfig = {
    apiKey: "AIzaSyCC6xq_lS1pSq0oXYOrok8wiGpb6aR7HHk",
    authDomain: "vue3-85ba6.firebaseapp.com",
    projectId: "vue3-85ba6",
    storageBucket: "vue3-85ba6.firebasestorage.app",
    messagingSenderId: "949769607410",
    appId: "1:949769607410:web:c4be64b58f887f3bbdd86b",
    measurementId: "G-H2MW3VJ4DS",
  };

  const app = initializeApp(firebaseConfig);

  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  nuxtApp.vueApp.provide("auth", auth);
  nuxtApp.provide("auth", auth);

  nuxtApp.vueApp.provide("firestore", firestore);
  nuxtApp.provide("firestore", firestore);
});
