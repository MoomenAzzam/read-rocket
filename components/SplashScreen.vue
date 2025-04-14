<template>
  <Transition
    enter-active-class="transition-opacity duration-500"
    leave-active-class="transition-opacity duration-500"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 bg-white flex items-center justify-center"
    >
      <div
        class="splash-screen fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 transition-opacity duration-500"
        :class="{ 'opacity-0 pointer-events-none': !show }"
      >
        <div class="text-center">
          <div class="w-32 h-32 mx-auto mb-4">
            <img
              src="https://media.istockphoto.com/id/931875514/vector/rocket-icon.jpg?s=612x612&w=0&k=20&c=LlP2NxmnbASGWIU7QErpeRl95a-OJUwygsKxu5mPUpw="
              alt="Logo"
              class="w-full h-full object-contain animate-pulse"
            />
          </div>
          <p class="text-gray-800 dark:text-gray-200 text-lg font-medium">
            Loading...
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const authStore = useAuthStore();

const show = ref(true);

onMounted(async () => {
  setTimeout(async () => {
    show.value = false;
    await authStore.initAuthListener();
  }, 2000);
});
</script>
