import { defineStore } from "pinia";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth"; // Explicit type import

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null,
    isAdmin: false,
  }),

  actions: {
    // Email/Password Registration
    async register(email: string, password: string) {
      const { $auth } = useNuxtApp();
      if (!$auth) throw new Error("Auth not initialized");
      try {
        this.loading = true;
        const userCredential = await createUserWithEmailAndPassword(
          $auth,
          email,
          password
        );
        this.user = userCredential.user;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    // Email/Password Login
    async login(email: string, password: string) {
      const { $auth } = useNuxtApp();
      const config = useRuntimeConfig();

      if (!$auth) throw new Error("Auth not initialized");
      try {
        this.loading = true;
        const userCredential = await signInWithEmailAndPassword(
          $auth,
          email,
          password
        );
        this.user = userCredential.user;
        if (config.public.adminId == this.user.uid) {
          this.isAdmin == true;
        }
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    // Google Login
    async loginWithGoogle() {
      const config = useRuntimeConfig();

      const { $auth, $googleProvider } = useNuxtApp();
      if (!$auth) throw new Error("Auth not initialized");
      try {
        this.loading = true;
        const userCredential = await signInWithPopup($auth, $googleProvider);
        this.user = userCredential.user;
        if (config.public.adminId == this.user.uid) {
          this.isAdmin == true;
        }
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    // Logout
    async logout() {
      const { $auth } = useNuxtApp();
      if (!$auth) throw new Error("Auth not initialized");
      try {
        this.loading = true;
        await signOut($auth);
        this.user = null;
        this.isAdmin == false;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    // Initialize auth state listener
    async initAuth() {
      const { $auth } = useNuxtApp(); // Add this line to get $auth
      if (!$auth) {
        this.error = "Auth not initialized";
        return Promise.resolve(null); // Handle the case where auth isn’t ready
      }
      return new Promise<User | null>((resolve) => {
        // Returns the unsubscribe function - we don't need it here
        const unsubscribe = onAuthStateChanged($auth, (user) => {
          this.user = user;
          this.loading = false;
          resolve(user);
        });
      });
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
  },
});
