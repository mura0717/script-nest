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
      const collaboratorsSnapshot = await ideaDocRef
        .collection("collaborators")
        .get();
      const collaborators = collaboratorsSnapshot.docs.map((doc) => doc.data());

      const isCollaborator = collaborators.some(
        (collab) => collab.uid === userId
      );

      if (ideaData.ownerId === userId || isCollaborator) {
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

  getAllCollaboratorIdeas: async (userId) => {
    try {
      const ideasCollectionRef = db.collection("ideas");
      const ideasListSnapshot = await ideasCollectionRef.get();
      let collaboratorIdeas = [];

      for (const doc of ideasListSnapshot.docs) {
        const collaboratorsSnapshot = await doc.ref
          .collection("collaborators")
          .where("uid", "==", userId)
          .get();

        if (!collaboratorsSnapshot.empty) {
          const ideaData = doc.data();
          collaboratorIdeas.push({ id: doc.id, ...ideaData });
        }
      }

      return collaboratorIdeas;
    } catch (error) {
      console.error("Error in getAllCollaboratorIdeas:", error);
      handleError(error);
      throw new AppError(
        "Error fetching collaborator ideas from Firestore.",
        error.status || 500,
        error
      );
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
