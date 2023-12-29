import { writable } from "svelte/store";
import {
  getAuth,
  onAuthStateChanged,
  getIdTokenResult,
} from "firebase/auth";
import { AppError } from "../utils/ErrorHandling/AppError.js";
import { handleError } from "../utils/ErrorHandling/GlobalErrorHandlerClient.js";

const createUserStore = () => {
  const { subscribe, set } = writable({ user: null, isAdmin: false });
  const auth = getAuth();

  onAuthStateChanged(auth, async (firebaseUser) => {
    try {
      if (firebaseUser) {
        // Retrieve the ID token and its result to check for admin status
        const idTokenResult = await getIdTokenResult(firebaseUser);
        const isAdminStatus = !!idTokenResult.claims.isAdmin; // "!!" converts a truthy or falsy value to a strict boolean, ensuring isAdmin is a boolean regardless of the original type.

        console.log("idTokenResult:", idTokenResult);
        console.log("claims:", idTokenResult.claims);
        console.log("type:", typeof idTokenResult.claims.isAdmin);

        set({ user: firebaseUser, isAdmin: isAdminStatus });

        console.log(
          "idTokenResult.claims.isAdmin:",
          idTokenResult.claims.isAdmin
        );
        console.log("isAdminStatus:", isAdminStatus);
      } else {
        set({ user: null, isAdmin: false });
      }
    } catch (error) {
      handleError(error);
      throw new AppError(`An error occurred: ${error.message}`, {
        initialError: error,
      });
    }
  });

  return {
    subscribe,
  };
};

export const userStore = createUserStore();
