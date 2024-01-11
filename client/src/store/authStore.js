import { writable } from "svelte/store";
import { userStore } from "./userStore.js";

const createAuthStore = () => {
  const { subscribe, set } = writable({
    isLoggedIn: false,
    isAuthInitialized: false,
  });

  userStore.subscribe(($userStore) => {
    set({
      isLoggedIn: !!$userStore.user,
      isAuthInitialized: $userStore.isAuthInitialized,
    });
  });

  return {
    subscribe,
  };
};

export const authStore = createAuthStore();
