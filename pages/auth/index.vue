<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <div class="bg-white rounded-xl shadow-2xl p-8">
        <!-- Tabs -->
        <div class="flex mb-8 border-b border-gray-200">
          <button
            @click="activeTab = 'login'"
            :class="{
              'text-blue-600 border-blue-600': activeTab === 'login',
              'text-gray-500 hover:text-gray-700': activeTab !== 'login',
            }"
            class="flex-1 py-2 font-medium text-sm border-b-2 focus:outline-none transition-colors"
          >
            Sign In
          </button>
          <button
            @click="activeTab = 'register'"
            :class="{
              'text-blue-600 border-blue-600': activeTab === 'register',
              'text-gray-500 hover:text-gray-700': activeTab !== 'register',
            }"
            class="flex-1 py-2 font-medium text-sm border-b-2 focus:outline-none transition-colors"
          >
            Sign Up
          </button>
        </div>

        <!-- Login Form -->
        <form
          v-if="activeTab === 'login'"
          @submit.prevent="handleLogin"
          class="space-y-6"
        >
          <div>
            <label
              for="login-email"
              class="block text-sm font-medium text-gray-700"
              >Email</label
            >
            <input
              id="login-email"
              v-model="loginForm.email"
              type="email"
              required
              class="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <div class="flex justify-between items-center">
              <label
                for="login-password"
                class="block text-sm font-medium text-gray-700"
                >Password</label
              >
              <a href="#" class="text-sm text-blue-600 hover:text-blue-500"
                >Forgot password?</a
              >
            </div>
            <input
              id="login-password"
              v-model="loginForm.password"
              type="password"
              required
              class="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
          >
            <span v-if="!loading">Sign In</span>
            <svg
              v-else
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            @click="signInWithGoogle"
            :disabled="loading"
            class="w-full flex items-center justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
          >
            <svg
              class="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.7663 12.2764C23.7663 11.4607 23.7001 10.6406 23.559 9.83807H12.2402V14.4591H18.722C18.453 15.9494 17.5888 17.2678 16.3233 18.1056V21.1039H20.1903C22.4611 19.0139 23.7663 15.9274 23.7663 12.2764Z"
                fill="#4285F4"
              />
              <path
                d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z"
                fill="#34A853"
              />
              <path
                d="M5.50277 14.3003C5.00011 12.8099 5.00011 11.1961 5.50277 9.70575V6.61481H1.51674C-0.185266 10.0056 -0.185266 14.0004 1.51674 17.3912L5.50277 14.3003Z"
                fill="#FBBC04"
              />
              <path
                d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>
        </form>

        <!-- Register Form -->
        <form v-else @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label
              for="register-email"
              class="block text-sm font-medium text-gray-700"
              >Email</label
            >
            <input
              id="register-email"
              v-model="registerForm.email"
              type="email"
              required
              class="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              for="register-password"
              class="block text-sm font-medium text-gray-700"
              >Password</label
            >
            <input
              id="register-password"
              v-model="registerForm.password"
              type="password"
              required
              class="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="••••••••"
            />
            <p class="mt-1 text-xs text-gray-500">
              Use 8 or more characters with a mix of letters, numbers & symbols
            </p>
          </div>

          <div>
            <label
              for="register-confirm-password"
              class="block text-sm font-medium text-gray-700"
              >Confirm Password</label
            >
            <input
              id="register-confirm-password"
              v-model="registerForm.confirmPassword"
              type="password"
              required
              class="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
          >
            <span v-if="!loading">Sign Up</span>
            <svg
              v-else
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          <button
            type="button"
            @click="signInWithGoogle"
            :disabled="loading"
            class="w-full flex items-center justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
          >
            <svg
              class="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.7663 12.2764C23.7663 11.4607 23.7001 10.6406 23.559 9.83807H12.2402V14.4591H18.722C18.453 15.9494 17.5888 17.2678 16.3233 18.1056V21.1039H20.1903C22.4611 19.0139 23.7663 15.9274 23.7663 12.2764Z"
                fill="#4285F4"
              />
              <path
                d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z"
                fill="#34A853"
              />
              <path
                d="M5.50277 14.3003C5.00011 12.8099 5.00011 11.1961 5.50277 9.70575V6.61481H1.51674C-0.185266 10.0056 -0.185266 14.0004 1.51674 17.3912L5.50277 14.3003Z"
                fill="#FBBC04"
              />
              <path
                d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </button>
        </form>

        <div
          v-if="error"
          class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm"
        >
          {{ error }}
        </div>
      </div>

      <div class="mt-6 text-center text-sm text-gray-600">
        <p v-if="activeTab === 'login'">
          Don't have an account?
          <button
            @click="activeTab = 'register'"
            class="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign up
          </button>
        </p>
        <p v-else>
          Already have an account?
          <button
            @click="activeTab = 'login'"
            class="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "blank",
});

const authStore = useAuthStore();

// Define reactive state for the active tab with TypeScript type
const activeTab = ref<"login" | "register">("login");

// Loading state for form submissions
const loading = ref(false);

// Error message state
const error = ref<string | null>(null);

// Login form reactive data
const loginForm = ref({
  email: "",
  password: "",
});

// Register form reactive data
const registerForm = ref({
  email: "",
  password: "",
  confirmPassword: "",
});

// Handle login submission
const handleLogin = async () => {
  // Uncomment and implement with Firebase if needed
  if (!loginForm.value.email || !loginForm.value.password) {
    error.value = "Please fill in all fields";
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    await authStore.login(loginForm.value.email, loginForm.value.password);
    if (authStore.isAuthenticated) {
      navigateTo("/");
    }
  } catch (err: any) {
    error.value = getFirebaseError(err.code);
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  // Basic validation
  if (
    !registerForm.value.email ||
    !registerForm.value.password ||
    !registerForm.value.confirmPassword
  ) {
    error.value = "Please fill in all fields";
    return;
  }
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    error.value = "Passwords do not match";
    return;
  }
  if (registerForm.value.password.length < 8) {
    error.value = "Password must be at least 8 characters";
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    await authStore.register(
      registerForm.value.email,
      registerForm.value.password
    );

    if (authStore.isAuthenticated) {
      navigateTo("/");
    }
  } catch (err: any) {
    error.value = getFirebaseError(err.code);
    console.error("Registration error:", err);
  } finally {
    loading.value = false;
  }
};

// Handle Google sign-in
const signInWithGoogle = async () => {
  // Uncomment and implement with Firebase if needed
  loading.value = true;
  error.value = null;
  try {
    await authStore.loginWithGoogle();
    if (authStore.isAuthenticated) {
      navigateTo("/");
    }
  } catch (err: any) {
    error.value = getFirebaseError(err.code);
  } finally {
    loading.value = false;
  }
};

// Convert Firebase error codes to user-friendly messages
const getFirebaseError = (code: string): string => {
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/user-disabled":
      return "This account has been disabled";
    case "auth/user-not-found":
      return "No account found with this email";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/email-already-in-use":
      return "Email already in use";
    case "auth/weak-password":
      return "Password is too weak";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled";
    case "auth/popup-closed-by-user":
      return "Sign in popup was closed";
    default:
      return "An error occurred. Please try again";
  }
};
</script>
