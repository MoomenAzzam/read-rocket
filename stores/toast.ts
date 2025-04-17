// stores/toast.ts
import { defineStore } from "pinia";

export const useToastStore = defineStore("toast", () => {
  const { $toast } = useNuxtApp();

  function info(msg: string) {
    return $toast.info(msg);
  }

  function error(msg: string) {
    return $toast.error(msg);
  }

  function success(msg: string) {
    return $toast.success(msg);
  }

  function warning(msg: string) {
    return $toast.warning(msg);
  }

  return {
    info,
    error,
    success,
    warning,
  };
});
