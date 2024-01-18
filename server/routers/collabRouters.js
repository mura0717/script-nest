import { Router } from "express";
import collabServices from "../services/collabServices.js";
import notificationServices from "../services/notificationServices.js";
import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";
import { sendInvitationNotification, sendAcceptResponseNotification } from "../sockets/sockets.js";
import { io } from "../sockets/sockets.js";
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
      console.log(
        "collabRouters/collaboratorsFetched.length:",
        collaborators.length
      );
      res.json(collaborators);
    } catch (error) {
      console.error("Error fetching collaborators:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

router.post(
  "/api/auth/ideas/:ideaId/add-collaborator",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const ideaId = req.params.ideaId;
    const collabData = req.body; //BURADA EKSIK
    console.log("collabRouters/add-collab collabData:", collabData);
    await collabServices.addCollaborator(ideaId, collabData);
    sendAcceptResponseNotification(io, collabData);
    res.status(201).json({ message: "Collaborator added." });
  })
);

router.post(
  "/api/auth/ideas/:ideaId/invite-collaborator",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const ideaId = req.params.ideaId;
    const collabData = req.body;
    console.log("collabRouter/post - collabData:", ideaId);
    console.log("collabRouter/post - collabData:", collabData);

    const notificationData = {
      type: "collaborator-invite",
      //inviterInfo: collabData.inviterInfo,
      respondingUserName: collabData.inviterInfo.displayName,
      respondingUserId: collabData.inviterInfo.uid,
      targetUserId: collabData.uid,
      targetUserName: collabData.displayName,
      ideaId: ideaId,
      ideaTitle: collabData.ideaTitle,
      invitationId: uuidv4(),
      message: `New invite from "${collabData.inviterInfo.displayName}" for: "${collabData.ideaTitle}". `,
      timestamp: new Date(),
    };
    console.log("Sending invite - notificationData:", notificationData);

    await notificationServices.addNotification(
      collabData.uid,
      notificationData
    );
    sendInvitationNotification(io, notificationData);
    res.status(201).json({ message: "Invitation sent." });
  })
);

router.delete(
  "/api/auth/ideas/:ideaId/remove-collaborator/:collaboratorId",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const { ideaId, collaboratorId } = req.params;
    const deleteResult = await collabServices.removeCollaborator(
      ideaId,
      collaboratorId
    );
    res.status(200).json(deleteResult);
  })
);

export default router;
