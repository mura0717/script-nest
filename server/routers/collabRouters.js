import { Router } from "express";
import collabServices from "../services/collabServices.js";
import notificationServices from "../services/notificationServices.js";
import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";
import { handleNotification } from "../app.js";
import { io } from "../app.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();

router.post(
  "/api/auth/ideas/:ideaId/add-collaborator",
  catchAsync(async (req, res) => {
    const ideaId = req.params.ideaId;
    const collabData = req.body;
    console.log("Adding collaborator - collabData:", collabData);
    await collabServices.addCollaborator(ideaId, collabData);
    res.status(201).json({ message: "Collaborator added." });
  })
);

router.post(
  "/api/auth/ideas/:ideaId/invite-collaborator",
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

router.delete("/api/auth/ideas/:ideaId/invite-collaborator", catchAsync(async (req, res) => {
  
}));

export default router;
