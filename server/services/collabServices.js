import { db } from "../config/firebaseAdmin.js";

export const collabServices = {
  addCollaborator: async (ideaId, collabData) => {
    console.log("Collabservices/addCollaborator ideaId:", collabData.ideaId);
    console.log("CollabSercies/addCollaborator collabData:", collabData);
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
    console.log("getCollaborators/collabServices: collaborators.length:", collaborators.length);
    return collaborators;
  },

  removeCollaborator: async (ideaId, collaboratorDocId) => {
    const collaboratorDocRef = db
      .collection("ideas")
      .doc(ideaId)
      .collection("collaborators")
      .doc(collaboratorDocId);
    await collaboratorDocRef.delete();
        return {
          success: true,
          message: "Collaborator deleted successfully",
          id: collaboratorDocId,
        };
  },
};

export default collabServices;