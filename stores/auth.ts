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
import {
  doc,
  setDoc,
  getDocs,
  collection,
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import type { FirebaseError } from "firebase/app";
import { toast } from "vue3-toastify";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  isInitialized: boolean;
  isResolvingAuth: boolean;
  unsubscribeAuthListener: (() => void) | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isLoading: false,
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
    async initAuthListener(): Promise<void> {
      try {
        const auth = this.getAuth();
        const config = useRuntimeConfig();

        if (!auth) {
          throw new Error("Firebase auth not initialized");
        }

        this.isInitialized = true;
        this.isResolvingAuth = true;

        return new Promise((resolve) => {
          this.unsubscribeAuthListener = onAuthStateChanged(
            auth,
            async (user) => {
              try {
                this.user = user;
                this.isAdmin = user
                  ? config.public.adminId === user.uid
                  : false;

                if (user) {
                  await this.createUserDocument(user);
                }
                this.isResolvingAuth = false;
                resolve();
              } catch (error) {
                toast.error("Error processing auth state");
                this.setError(error.message);
                this.isResolvingAuth = false;
                resolve();
              }
            }
          );
        });
      } catch (error) {
        toast.error("Failed to initialize auth listener");
        this.isInitialized = false;
        this.isResolvingAuth = false;
        this.setError(error.message);
        throw error;
      }
    },

    cleanupAuthListener() {
      if (this.unsubscribeAuthListener) {
        this.unsubscribeAuthListener();
        this.unsubscribeAuthListener = null;
      }
      this.isInitialized = false;
    },

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
        toast.error("Error creating user document");
        throw error;
      }
    },

    async register(email: string, password: string): Promise<UserCredential> {
      return this.handleAuthOperation(async () => {
        const auth = this.getAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await this.createUserDocument(userCredential.user);
        toast.success("Registration successful");
        return userCredential;
      });
    },

    async login(email: string, password: string): Promise<UserCredential> {
      return this.handleAuthOperation(async () => {
        const auth = this.getAuth();
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        toast.success("Login successful");
        return userCredential;
      });
    },

    async loginWithGoogle(): Promise<UserCredential> {
      return this.handleAuthOperation(async () => {
        const auth = this.getAuth();
        const { $googleProvider } = useNuxtApp();
        const googleProvider = $googleProvider || new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, googleProvider);
        await this.createUserDocument(userCredential.user);
        toast.success("Google login successful");
        return userCredential;
      });
    },

    async signInAnonymously(): Promise<UserCredential> {
      return this.handleAuthOperation(async () => {
        const auth = this.getAuth();
        const userCredential = await signInAnonymously(auth);
        await this.createUserDocument(userCredential.user);
        toast.info("Signed in anonymously");
        return userCredential;
      });
    },

    async upgradeToEmailPassword(
      email: string,
      password: string
    ): Promise<UserCredential> {
      if (!this.user?.isAnonymous) {
        toast.error("Only anonymous accounts can be upgraded");
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
        toast.success("Account upgraded with email/password");
        return userCredential;
      });
    },

    async upgradeWithGoogle(): Promise<UserCredential> {
      if (!this.user?.isAnonymous) {
        toast.error("Only anonymous accounts can be upgraded");
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

    async logout(): Promise<void> {
      return this.handleAuthOperation(async () => {
        const auth = this.getAuth();
        await signOut(auth);
        toast.info("Logged out successfully");
      });
    },

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
      toast.error(message);
    },

    setUser(user: User | null): void {
      this.user = user;
      this.isResolvingAuth = false;
    },

    async handleAuthOperation<T>(operation: () => Promise<T>): Promise<T> {
      try {
        this.isLoading = true;
        this.error = null;
        return await operation();
      } catch (error) {
        this.handleAuthError(error as FirebaseError);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    handleAuthError(error: FirebaseError): void {
      let errorMessage = error.message;

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
        case "auth/popup-closed-by-user":
          errorMessage = "Sign in was cancelled";
          break;
        case "auth/popup-blocked":
          errorMessage = "Popup was blocked. Please allow popups for this site";
          break;
        case "auth/unauthorized-domain":
          errorMessage = "This domain is not authorized for sign-in";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Google sign-in is not enabled for this project";
          break;
      }

      this.setError(errorMessage);
    },

    async getUserTestResults(userId: string) {
      const { $db } = useNuxtApp();
      if (!$db) {
        toast.error("Firestore not initialized");
        throw new Error("Firestore not initialized");
      }

      try {
        const testResultsRef = collection($db, "users", userId, "testResults");
        const querySnapshot = await getDocs(testResultsRef);

        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || null,
        }));

        return results;
      } catch (error: any) {
        toast.error("Error fetching test results");
        throw error;
      }
    },
  },
});
