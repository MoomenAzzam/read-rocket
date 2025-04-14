export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  await authStore.initAuth(); // Wait for auth to initialize
  if (!authStore.user && to.path !== "/login") {
    // return navigateTo("/auth");
  }

  // If authenticated and trying to access login page
  if (authStore.user && to.path === "/login") {
    // return navigateTo("/");
  }
});
