import { defineStore } from "pinia";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  linkWithCredential,
  linkWithPopup,
  EmailAuthProvider,
  GoogleAuthProvider,
  type User,
  type Auth,
  type UserCredential,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import type { FirebaseError } from "firebase/app";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null,
    isAdmin: false,
  }),

  actions: {
    // Initialize auth state listener
    initAuthListener() {
      const { $auth } = useNuxtApp();
      const config = useRuntimeConfig();

      if (!$auth) {
        this.error = "Auth not initialized";
        return;
      }

      onAuthStateChanged($auth, async (user) => {
        this.user = user;
        if (user) {
          this.isAdmin = config.public.adminId === user.uid;
          // Create user doc if it doesn't exist
          await this.createUserDocument(user);
        } else {
          this.isAdmin = false;
        }
      });
    },

    // Helper to create/update user document
    async createUserDocument(user: User) {
      const { $db } = useNuxtApp();
      const userRef = doc($db, "users", user.uid);

      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email,
          isAnonymous: user.isAnonymous,
          lastLogin: new Date(),
          createdAt: user.metadata.creationTime,
        },
        { merge: true }
      );
    },

    // Email/Password Registration
    async register(email: string, password: string) {
      const { $auth, $db } = useNuxtApp();
      if (!this.isAnonymous) {
        try {
          this.loading = true;
          this.error = null;

          const userCredential = await createUserWithEmailAndPassword(
            $auth as Auth,
            email,
            password
          );

          await this.createUserDocument(userCredential.user);
          return userCredential;
        } catch (error) {
          this.handleAuthError(error as FirebaseError);
          throw error;
        } finally {
          this.loading = false;
        }
      } else {
        return this.upgradeToEmailPassword(email, password);
      }
    },

    // Email/Password Login
    async login(email: string, password: string) {
      const { $auth } = useNuxtApp();
      try {
        this.loading = true;
        this.error = null;

        const userCredential = await signInWithEmailAndPassword(
          $auth as Auth,
          email,
          password
        );

        return userCredential;
      } catch (error) {
        this.handleAuthError(error as FirebaseError);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Google Login
    async loginWithGoogle() {
      const { $auth, $googleProvider } = useNuxtApp();
      if (!this.isAnonymous) {
        try {
          this.loading = true;
          this.error = null;

          const userCredential = await signInWithPopup(
            $auth as Auth,
            $googleProvider
          );

          await this.createUserDocument(userCredential.user);
          return userCredential;
        } catch (error) {
          this.handleAuthError(error as FirebaseError);
          throw error;
        } finally {
          this.loading = false;
        }
      } else {
        return this.upgradeWithGoogle();
      }
    },

    // Anonymous Sign In
    async signInAnonymously() {
      const { $auth, $db } = useNuxtApp();
      try {
        this.loading = true;
        this.error = null;

        const userCredential = await signInAnonymously($auth as Auth);
        await this.createUserDocument(userCredential.user);
        return userCredential;
      } catch (error) {
        this.handleAuthError(error as FirebaseError);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Upgrade anonymous to email/password
    async upgradeToEmailPassword(email: string, password: string) {
      if (!this.user?.isAnonymous) {
        throw new Error("Only anonymous accounts can be upgraded");
      }

      const { $auth } = useNuxtApp();
      try {
        this.loading = true;
        this.error = null;

        const credential = EmailAuthProvider.credential(email, password);
        const userCredential = await linkWithCredential(
          $auth.currentUser!,
          credential
        );

        // Update user document
        await this.createUserDocument(userCredential.user);
        return userCredential;
      } catch (error) {
        this.handleAuthError(error as FirebaseError);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Upgrade anonymous to Google account
    async upgradeWithGoogle() {
      if (!this.user?.isAnonymous) {
        throw new Error("Only anonymous accounts can be upgraded");
      }

      const { $auth, $googleProvider } = useNuxtApp();
      try {
        this.loading = true;
        this.error = null;

        const userCredential = await linkWithPopup(
          $auth.currentUser!,
          $googleProvider
        );

        // Update user document
        await this.createUserDocument(userCredential.user);
        return userCredential;
      } catch (error) {
        this.handleAuthError(error as FirebaseError);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Logout
    async logout() {
      const { $auth } = useNuxtApp();
      try {
        this.loading = true;
        this.error = null;
        await signOut($auth as Auth);
      } catch (error) {
        this.handleAuthError(error as FirebaseError);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Error handling helper
    handleAuthError(error: FirebaseError) {
      console.error("Auth error:", error);
      this.error = error.message;
      // You can add more specific error handling here
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAnonymous: (state) => state.user?.isAnonymous ?? false,
  },
});
