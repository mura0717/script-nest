import { writable } from "svelte/store";
import { getAuth, onAuthStateChanged, getIdTokenResult } from "firebase/auth";

const createUserStore = () => {
  const { subscribe, set } = writable({ user: null, isAdmin: false });

  const auth = getAuth();

  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Retrieve the ID token and its result to check for admin status
      const idTokenResult = await getIdTokenResult(firebaseUser);
      console.log("idTokenResult:", idTokenResult);
      console.log("claims:", idTokenResult.claims);
      console.log("type:", typeof idTokenResult.claims.isAdmin);

      /*   let isAdminStatus =
        typeof idTokenResult.claims.isAdmin !== "undefined"
          ? idTokenResult.claims.isAdmin
          : false; */

      let isAdminStatus = !!idTokenResult.claims.isAdmin || false;// "!!" converts a truthy or falsy value to a strict boolean, ensuring isAdmin is a boolean regardless of the original type.
      console.log(
        "idTokenResult.claims.isAdmin:",
        idTokenResult.claims.isAdmin
      );
      console.log("isAdminStatus:", isAdminStatus);
      set({ user: firebaseUser, isAdmin: isAdminStatus });
    } else {
      set({ user: null, isAdmin: false });
    }
  });

  return {
    subscribe
  };
};

export const userStore = createUserStore();
