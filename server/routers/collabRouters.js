import { Router } from "express";
import collabServices from "../services/collabServices.js";
import notificationServices from "../services/notificationServices.js";
import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";
import { handleNotification } from "../app.js";
import { io } from "../app.js";
import { v4 as uuidv4 } from "uuid";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = Router();

router.get(
  "/api/auth/ideas/:ideaId/collaborators",
  isAuthenticated,
  async (req, res) => {
    try {
      const ideaId = req.params.ideaId;
      const collaborators = await collabServices.getCollaborators(ideaId);
      console.log("collabRouters/collaboratorsFetched.length:", collaborators.length);
      res.json(collaborators);
    } catch (error) {
      console.error("Error fetching collaborators:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

router.post(
  "/api/auth/ideas/:ideaId/add-collaborator", isAuthenticated,
  catchAsync(async (req, res) => {
    const ideaId = req.params.ideaId;
    const collabData = req.body;
    console.log("Adding collaborator - collabData:", collabData);
    await collabServices.addCollaborator(ideaId, collabData);
    res.status(201).json({ message: "Collaborator added." });
  })
);

router.post(
  "/api/auth/ideas/:ideaId/invite-collaborator", isAuthenticated,
  catchAsync(async (req, res) => {
    const ideaId = req.params.ideaId;
    const collabData = req.body;
    console.log("Inviting collaborator - collabData:", collabData);

    const notificationData = {
      type: "collaborator-invite",
      inviterInfo: collabData.inviterInfo,
      targetUserId: collabData.uid,
      targetUserName: collabData.displayName,
      targetUserPhotoUrl: collabData.photoUrl || null,
      ideaId: ideaId,
      ideaTitle: collabData.ideaTitle,
      invitationId: uuidv4(),
      message: `New invite from "${collabData.inviterInfo.displayName}" for: "${collabData.ideaTitle}". `,
      timestamp: new Date(),
    };
    console.log(
      "Sending invite - targetUserId:",
      notificationData.targetUserId
    );
    await notificationServices.addNotification(
      collabData.uid,
      notificationData
    );
    handleNotification(io, notificationData);
    res.status(201).json({ message: "Invitation sent." });
  })
);

router.delete("/api/auth/ideas/:ideaId/invite-collaborator", isAuthenticated, catchAsync(async (req, res) => {
const ideaId = req.params.ideaId;
const collaboratorId = req.body;
  console.log("Deleting collaborator - collaboratorId:", collaboratorId);
  await collabServices.removeCollaborator(ideaId, collaboratorId);
}));

export default router;
