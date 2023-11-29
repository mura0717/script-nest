import { writable } from "svelte/store";
import { getAuth, onAuthStateChanged, getIdTokenResult } from "firebase/auth";

const createUserStore = () => {
  const { subscribe, set } = writable({ user: null, isAdmin: false });

  const auth = getAuth();

  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Retrieve the ID token and its result to check for admin status
      const idTokenResult = await getIdTokenResult(firebaseUser);
      const isAdmin = idTokenResult.claims.isAdmin || false;
      set({ user: firebaseUser, isAdmin });
    } else {
      set({ user: null, isAdmin: false });
    }
  });

  return {
    subscribe
  };
};

export const userStore = createUserStore();
