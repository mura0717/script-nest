import { readable } from "svelte/store";

export const API_BASE_URL = readable(import.meta.env.VITE_API_URL);
export const API_BASE_URL_JS = import.meta.env.VITE_API_URL;
