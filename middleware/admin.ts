export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  await authStore.initAuth(); // Wait for auth to initialize
  console.log(authStore);

  // If not authenticated and trying to access protected route
  if (!authStore.user && to.path !== "/login") {
    return navigateTo("/auth");
  }

  // If authenticated but trying to access login page
  if (authStore.isAdmin && to.path === "/login") {
    return navigateTo("/admin");
  }
});
