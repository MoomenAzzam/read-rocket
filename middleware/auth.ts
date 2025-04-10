export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const user = await authStore.initAuth(); // Wait for auth to initialize

  // If not authenticated and trying to access protected route
  if (!user && to.path !== "/login") {
    return navigateTo("/auth");
  }

  // If authenticated but trying to access login page
  if (user && to.path === "/login") {
    return navigateTo("/");
  }
});
