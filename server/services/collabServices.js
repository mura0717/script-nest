import { db } from "../config/firebaseAdmin.js";
import AppError from "../utils/ErrorHandling/AppError.js";
import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";

export const collabServices = {
  addCollaborator: async (ideaId, collaboratorData) => {
    const collaboratorRef = db
      .collection("ideas")
      .doc(ideaId)
      .collection("collaborators");
    await collaboratorRef.add(collaboratorData);
  },

  getCollaborators: async (ideaId) => {
    const collaboratorsRef = db
      .collection("ideas")
      .doc(ideaId)
      .collection("collaborators");
    const snapshot = await collaboratorsRef.get();
    let collaborators = [];
    snapshot.forEach((doc) =>
      collaborators.push({ id: doc.id, ...doc.data() })
    );
    return collaborators;
  },

  removeCollaborator: async (ideaId, collaboratorDocId) => {
    const collaboratorDocRef = db
      .collection("ideas")
      .doc(ideaId)
      .collection("collaborators")
      .doc(collaboratorDocId);
    await collaboratorDocRef.delete();
    return collaboratorDocId; // Optionally, return the ID of the removed collaborator
  },
};

export default collabServices;