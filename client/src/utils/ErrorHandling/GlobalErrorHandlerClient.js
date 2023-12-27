import { writable } from "svelte/store";
import { toast } from "svelte-french-toast";

export const errorMessage = writable("");

export function handleError(error) {
  errorMessage.set(error.message);
  toast.error(error.message, {
    duration: 3000,
    position: "top-center",
  });
  console.log(error.message);
}
