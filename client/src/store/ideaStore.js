import { writable } from "svelte/store";
import { userStore } from "./userStore.js";
import { AppError } from "../utils/ErrorHandling/AppError.js";
import { handleError } from "../utils/ErrorHandling/GlobalErrorHandlerClient.js";

const createIdeaStore = () => {
  const defaultIdeaState = {
    id: null,
    owner: {
      photoURL: null,
      displayName: "",
      uid: "",
    },
    title: "",
    logline: "",
    selectedOrigin: "",
    sourceMaterial: "",
    authors: "",
    selectedGenres: [],
    timePeriod: "",
    setting: "",
    premise: "",
    synopsis: "",
    literatureReferences: [
      {
        coverImageUrl: "",
        title: "",
        authors: "",
        publishedDate: "",
      },
    ],
    movieReferences: [
      {
        coverImageUrl: "",
        title: "",
        releaseDate: "",
      },
    ],
    comments: [
      {
        commentatorName: "",
        commentText: "",
        commentDate: "",
      },
    ],
    collaborators: [
      {
        photoURL: "",
        displayName: "",
        uid: "",
      },
    ],
  };

  const { subscribe, set, update } = writable(defaultIdeaState);

  return {
    subscribe,
    setIdea: (idea) => set(idea),
    updateIdea: (idea) => update(idea),
    resetIdea: () => {
      const currentUser = $userStore.user;
      set({
        ...defaultIdeaState,
        owner: {
          photoURL: currentUser.photoURL,
          displayName: currentUser.displayName,
          uid: currentUser.uid,
        },
      });
    },
  };
};

export const ideaStore = createIdeaStore();
