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
      console.log("ideaServics/getIdea, ideaSnapshot:", ideaSnapshot.data());
      const ideaData = ideaSnapshot.data();
      console.log("ideaServics/getIdea, ideaData:", ideaData);
      if (
        ideaData.ownerId === userId ||
        ideaData.collaborators.some((collab) => collab.uid === userId)
      ) {
        return { id: ideaSnapshot.id, ...ideaData };
      } else {
        console.log("Not authorized to see this idea.");
        throw new AppError("Access unauthorized", 401);
      }
    } else {
      console.log("Idea not found.");
      throw new AppError("Idea not found", 404);
    }
  },

  getAllIdeas: async (ownerId) => {
    try {
      const ideasCollectionRef = db.collection("ideas");
      const query = ideasCollectionRef.where("owner.uid", "==", ownerId);
      console.log("owner id:", ownerId);
      const ideasListSnapshot = await query.get();
      let ideas = [];
      if (!ideasListSnapshot.empty) {
        ideasListSnapshot.forEach((doc) => {
          console.log("docs:", doc.id);
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
    console.log("ideaServices create idea is hit.");
    const ideasColRef = db.collection("ideas");
    const newDocRef = await ideasColRef.add(newIdeaData);
    return newDocRef.id;
  },

  editIdea: async (ideaId, updatedIdeaData) => {
    console.log("ideaServices edit idea is hit.");
    const ideaDocRef = db.collection("ideas").doc(ideaId);
    console.log("ideaServices edit, ideaDocRef:", ideaDocRef);
    await ideaDocRef.update(updatedIdeaData);
    return ideaId;
  },

  deleteIdea: async (ideaId) => {
    console.log("ideaServices delete idea is hit.");
    const ideaDocRef = db.collection("ideas").doc(ideaId);
    console.log("ideaServices delete, ideaDocRef:", ideaDocRef);
    await ideaDocRef.delete();
    return ideaId;
  },
};

/* export const testDB = async () => {
  const colRef = collection(db, collectionName);

  users.forEach(async (u) => {
    await addDoc(colRef, u).catch((err) => console.log(err));
  });
}; */

export default ideaServices;
