import { writable } from "svelte/store";

export const notificationsStore = writable({
  notifications: [],
  hasUnread: false,
});
