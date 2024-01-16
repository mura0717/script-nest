import { db } from "../config/firebaseAdmin.js";

export const collabServices = {
  addCollaborator: async (ideaId, collabData) => {
    console.log("Received notification ideaId:", ideaId);
    console.log("Received notification collabData:", collabData);
    const collaboratorRef = db
      .collection("ideas")
      .doc(ideaId)
      .collection("collaborators");
    await collaboratorRef.add(collabData);
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
    return collaboratorDocId;
  },
};

export default collabServices;