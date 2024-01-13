import { admin, db } from "../config/firebaseAdmin.js";
import AppError from "../utils/ErrorHandling/AppError.js";
import {
  handleError,
  catchAsync,
} from "../utils/ErrorHandling/GlobalErrorHandler.js";

export const ideaServices = {
  getIdea: catchAsync(async (ideaId, userId) => {
    console.log("ideaServices get idea is hit.");
    const ideaDocRef = db.collection("ideas").doc(ideaId);
    const ideaSnapshot = await ideaDocRef.get();
    if (ideaSnapshot.exists) {
      const ideaData = ideaSnapshot.data();
      if (
        ideaData.owner.uid === userId ||
        ideaData.collaborators.some((collab) => collab.uid === userId)
      ) {
        return { id: ideaSnapshot.id, ...ideaData };
      } else {
        console.log("ideaServices-getIdea Error: not authorized");
        throw new AppError("Access unauthorized", 401);
      }
    } else {
      console.log("ideaServices-getIdea Error: Idea not found");
      throw new AppError("Idea not found", 404);
    }
  }),

  getAllIdeas: catchAsync(async (ownerId) => {
    console.log("ideaServices get all ideas is hit.");
    const ideasCollectionRef = db.collection("ideas");
    const query = ideasCollectionRef.where("owner.uid", "==", ownerId);
    const ideasListSnapshot = await query.get();
    if (!ideasListSnapshot.empty) {
      let ideas = [];
      ideasListSnapshot.forEach((doc) => {
        ideas.push({ id: doc.id, ...doc.data() });
      });
      return ideas;
    } else {
      console.log("ideaServices-getAllIdeas Error: Ideas not found");
      throw new AppError("Idea not found", 404);
    }
  }),

  getAllSharedIdeas: catchAsync(async (collaboratorId) => {
    console.log("ideaServices get all shared ideas is hit.");
    const ideasCollectionRef = db.collection("ideas");
    const ideasListSnapshot = await ideasCollectionRef.get();

    if (!ideasListSnapshot.empty) {
      let sharedIdeas = [];
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
      console.log(
        "ideaServices-getAllSharedIdeas Error: Shared ideas not found"
      );
      throw new AppError("Shared ideas not found", 404);
    }
  }),

  createIdea: async (ideaData) => {
    console.log("ideaServices create idea is hit.");
    const ideasColRef = db.collection("ideas");
    const newDocRef = await ideasColRef.add(newIdea);
    return newDocRef.id;
  },

  editIdea: async (ideaId, updatedIdeaData) => {
    console.log("ideaServices edit idea is hit.");
    const ideaDocRef = db.collection("ideas").doc(ideaId);
    await ideaDocRef.update(updatedIdeaData);
    return ideaId;
  },

  deleteIdea: async (ideaId) => {
    console.log("ideaServices delete idea is hit.");
    const ideaDocRef = db.collection("ideas").doc(ideaId);
    await ideaDocRef.delete();
    return ideaId;
  },
}

/* export const testDB = async () => {
  const colRef = collection(db, collectionName);

  users.forEach(async (u) => {
    await addDoc(colRef, u).catch((err) => console.log(err));
  });
}; */

export default ideaServices;
