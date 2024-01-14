import { writable } from "svelte/store";
import { toast } from "svelte-french-toast";

export const errorMessage = writable("");

export function handleError(error) {
  if (error instanceof SyntaxError) {
    console.error("Received a non-JSON response from the server.");
  }
  errorMessage.set(error.message);
  toast.error(error.message, {
    duration: 3000,
    position: "top-center",
  });
  console.log(errorMessage);
}
