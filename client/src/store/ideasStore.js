import { writable } from "svelte/store";

const createIdeasStore = () => {
  const { subscribe, set, update } = writable([]);
  let activeIdeaId = null;

  return {
    subscribe,
    setIdea: (ideas) => set(ideas),
    addIdea: (idea) => update((ideas) => [...ideas, idea]),
    updateIdea: (updatedIdea) =>
      update((ideas) => {
        const index = ideas.findIndex((idea) => idea.id === updatedIdea.id);
        if (index !== -1) {
          ideas[index] = updatedIdea;
        }
        return ideas;
      }),
    setActiveIdea: (ideaId) => {
      activeIdeaId = ideaId;
    },
    getActiveIdea: () => {
      return activeIdeaId
        ? ideas.find((idea) => idea.id === activeIdeaId)
        : null;
    },
    resetIdeas: () => set([]),
  };
};

export const ideasStore = createIdeasStore();
