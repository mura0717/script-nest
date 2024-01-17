import { admin, db } from "../config/firebaseAdmin.js";
import AppError from "../utils/ErrorHandling/AppError.js";
import {
  handleError,
  catchAsync,
} from "../utils/ErrorHandling/GlobalErrorHandler.js";

export const ideaServices = {
  getIdea: async (ideaId, userId) => {
    const ideaDocRef = db.collection("ideas").doc(ideaId);
    const ideaSnapshot = await ideaDocRef.get();
    if (ideaSnapshot.exists) {
      const ideaData = ideaSnapshot.data();
      if (
        ideaData.ownerId === userId ||
        ideaData.collaborators.some((collab) => collab.uid === userId)
      ) {
        return { id: ideaSnapshot.id, ...ideaData };
      } else {
        throw new AppError("Access unauthorized", 401);
      }
    } else {
      throw new AppError("Idea not found", 404);
    }
  },

  getAllIdeas: async (userId) => {
    try {
      const ideasCollectionRef = db.collection("ideas");
      const query = ideasCollectionRef.where("ownerId", "==", userId);
      const ideasListSnapshot = await query.get();
      let ideas = [];
      if (!ideasListSnapshot.empty) {
        ideasListSnapshot.forEach((doc) => {
          ideas.push({ id: doc.id, ...doc.data() });
        });
        return ideas;
      } else {
        console.log("No ideas found for the user.");
        return [];
      }
    } catch (error) {
      handleError(error);
      throw new AppError("Error fetching ideas from Firestore.", 404);
    }
  },

  getAllSharedIdeas: async (collaboratorId) => {
    try {
      const ideasCollectionRef = db.collection("ideas");
      const ideasListSnapshot = await ideasCollectionRef.get();
      let sharedIdeas = [];
      if (!ideasListSnapshot.empty) {
        ideasListSnapshot.forEach((doc) => {
          const ideaData = doc.data();
          const isCollaborator = ideaData.collaborators.some(
            (collab) => collab.uid === collaboratorId
          );
          if (isCollaborator) {
            sharedIdeas.push({ id: doc.id, ...ideaData });
          }
        });
        return sharedIdeas;
      } else {
        console.log("No shared ideas found for the user.");
        return [];
      }
    } catch (error) {
      handleError(error);
      throw new AppError("Error fetching shared ideas from Firestore.", 404);
    }
  },

  createIdea: async (newIdeaData) => {
    const ideasColRef = db.collection("ideas");
    const newDocRef = await ideasColRef.add(newIdeaData);
    return newDocRef.id;
  },

  editIdea: async (ideaId, updatedIdeaData) => {
    const ideaDocRef = db.collection("ideas").doc(ideaId);
    console.log("ideaServices edit, ideaDocRef:", ideaDocRef);
    console.log("updatedIdeaData:", updatedIdeaData);
    await ideaDocRef.update(updatedIdeaData);
    return ideaId;
  },

  deleteIdea: async (ideaId) => {
    const ideaDocRef = db.collection("ideas").doc(ideaId);
    await ideaDocRef.delete();
    return ideaId;
  },
};

export default ideaServices;
