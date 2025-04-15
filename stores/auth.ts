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
  getAuth,
  type User,
  type Auth,
  type UserCredential,
} from "firebase/auth";
import { doc, setDoc, getFirestore, type Firestore } from "firebase/firestore";
import type { FirebaseError } from "firebase/app";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  isInitialized: boolean;
  isResolvingAuth: boolean;
  unsubscribeAuthListener: (() => void) | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null,
    isAdmin: false,
    isInitialized: false,
    isResolvingAuth: true,
    unsubscribeAuthListener: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAnonymous: (state) => state.user?.isAnonymous ?? false,
  },

  actions: {
    // Initialize auth state listener with Promise interface
    async initAuthListener(): Promise<void> {
      try {
        const auth = this.getAuth();
        const config = useRuntimeConfig();

        if (!auth) {
          throw new Error("Firebase auth not initialized");
        }

        console.log("Initializing auth listener...");
        this.isInitialized = true;
        this.isResolvingAuth = true;

        return new Promise((resolve) => {
          this.unsubscribeAuthListener = onAuthStateChanged(
            auth,
            async (user) => {
              try {
                // Update user state
                this.user = user;
                this.isAdmin = user
                  ? config.public.adminId === user.uid
                  : false;

                // Create user document if authenticated
                if (user) {
                  await this.createUserDocument(user);
                }

                // Mark resolution as complete
                this.isResolvingAuth = false;
                console.log("Auth state updated", {
                  user,
                  isAdmin: this.isAdmin,
                });
                resolve();
              } catch (error) {
                console.error("Error processing auth state:", error);
                this.setError(error.message);
                this.isResolvingAuth = false;
                resolve();
              }
            }
          );
        });
      } catch (error) {
        console.error("Failed to initialize auth listener:", error);
        this.isInitialized = false;
        this.isResolvingAuth = false;
        this.setError(error.message);
        throw error;
      }
    },

    // Cleanup auth listener
    cleanupAuthListener() {
      if (this.unsubscribeAuthListener) {
        this.unsubscribeAuthListener();
        this.unsubscribeAuthListener = null;
      }
      this.isInitialized = false;
    },

    // Helper to create/update user document
    async createUserDocument(user: User) {
      try {
        const db = this.getFirestore();
        const userRef = doc(db, "users", user.uid);

        await setDoc(
          userRef,
          {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isAnonymous: user.isAnonymous,
            lastLogin: new Date(),
            createdAt: user.metadata.creationTime,
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error creating user document:", error);
        throw error;
      }
    },

    // Email/Password Registration
    async register(email: string, password: string): Promise<UserCredential> {
      return this.handleAuthOperation(async () => {
        const auth = this.getAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await this.createUserDocument(userCredential.user);
        return userCredential;
      });
    },

    // Email/Password Login
    async login(email: string, password: string): Promise<UserCredential> {
      return this.handleAuthOperation(async () => {
        const auth = this.getAuth();
        return await signInWithEmailAndPassword(auth, email, password);
      });
    },

    // Google Login
    async loginWithGoogle(): Promise<UserCredential> {
      return this.handleAuthOperation(async () => {
        const auth = this.getAuth();
        const googleProvider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, googleProvider);
        await this.createUserDocument(userCredential.user);
        return userCredential;
      });
    },

    // Anonymous Sign In
    async signInAnonymously(): Promise<UserCredential> {
      return this.handleAuthOperation(async () => {
        const auth = this.getAuth();
        const userCredential = await signInAnonymously(auth);
        await this.createUserDocument(userCredential.user);
        return userCredential;
      });
    },

    // Upgrade anonymous to email/password
    async upgradeToEmailPassword(
      email: string,
      password: string
    ): Promise<UserCredential> {
      if (!this.user?.isAnonymous) {
        throw new Error("Only anonymous accounts can be upgraded");
      }

      return this.handleAuthOperation(async () => {
        const auth = this.getAuth();
        const credential = EmailAuthProvider.credential(email, password);
        const userCredential = await linkWithCredential(
          auth.currentUser!,
          credential
        );
        await this.createUserDocument(userCredential.user);
        return userCredential;
      });
    },

    // Upgrade anonymous to Google account
    async upgradeWithGoogle(): Promise<UserCredential> {
      if (!this.user?.isAnonymous) {
        throw new Error("Only anonymous accounts can be upgraded");
      }

      return this.handleAuthOperation(async () => {
        const auth = this.getAuth();
        const googleProvider = new GoogleAuthProvider();
        const userCredential = await linkWithPopup(
          auth.currentUser!,
          googleProvider
        );
        await this.createUserDocument(userCredential.user);
        return userCredential;
      });
    },

    // Logout
    async logout(): Promise<void> {
      return this.handleAuthOperation(async () => {
        const auth = this.getAuth();
        await signOut(auth);
      });
    },

    // Helper methods
    getAuth(): Auth {
      const { $app } = useNuxtApp();
      return getAuth($app);
    },

    getFirestore(): Firestore {
      const { $app } = useNuxtApp();
      return getFirestore($app);
    },

    setError(message: string): void {
      this.error = message;
      console.error("Auth error:", message);
    },

    setUser(user: User | null): void {
      this.user = user;
      this.isResolvingAuth = false;
    },

    async handleAuthOperation<T>(operation: () => Promise<T>): Promise<T> {
      try {
        this.loading = true;
        this.error = null;
        return await operation();
      } catch (error) {
        this.handleAuthError(error as FirebaseError);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    handleAuthError(error: FirebaseError): void {
      let errorMessage = error.message;

      // Map Firebase error codes to user-friendly messages
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect email or password";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later";
          break;
      }

      this.setError(errorMessage);
    },
  },
});
