import { writable } from "svelte/store";
import { getAuth, onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { AppError } from "../utils/ErrorHandling/AppError.js";
import { handleError } from "../utils/ErrorHandling/GlobalErrorHandlerClient.js";

const createUserStore = () => {
  const { subscribe, set } = writable({
    user: null,
    isAdmin: false,
    isAuthInitialized: false,
  });

  const auth = getAuth();

  onAuthStateChanged(auth, async (firebaseUser) => {
    console.log("Authentication state changed", !!firebaseUser);
    try {
      let isAdminStatus = false;
      if (firebaseUser) {
        // Retrieve the ID token and its result to check for admin status
        const idTokenResult = await getIdTokenResult(firebaseUser);
        isAdminStatus = !!idTokenResult.claims.isAdmin; // "!!" converts a truthy or falsy value to a strict boolean, ensuring isAdmin is a boolean regardless of the original type.

        console.log("userStore-idTokenResult:", idTokenResult);
        console.log("userStore-idTokenResult claims:", idTokenResult.claims);
        console.log(
          "userStore-type idTokenResult claims:",
          typeof !!idTokenResult.claims.isAdmin
        );
        // set token in Local Storage
        const token = await firebaseUser.getIdToken();
        localStorage.setItem("firebaseAuthToken", token);

        console.log("userStore-localStorage token:", token);

        set({
          user: firebaseUser,
          isAdmin: isAdminStatus,
          isAuthInitialized: true,
        });

        console.log("userStore-Store set:", {
          user: firebaseUser,
          isAdmin: isAdminStatus,
          isAuthInitialized: true,
        });

        console.log(
          "userStore-idTokenResult.claims.isAdmin:",
          !!idTokenResult.claims.isAdmin
        );
        console.log("userStore-isAdminStatus:", isAdminStatus);
      } else {
        set({ user: null, isAdmin: false, isAuthInitialized: false });
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
