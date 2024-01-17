import { Router } from "express";
import collabServices from "../services/collabServices.js";
import notificationServices from "../services/notificationServices.js";
import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";
import { handleNotification } from "../app.js";
import { io } from "../app.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();

//notification needs to be removed from here.

router.post(
  "/api/auth/ideas/:ideaId/collaborators",
  catchAsync(async (req, res) => {
    const ideaId = req.params.ideaId;
    const collabData = req.body;
    console.log("collabData:", collabData) 

    await collabServices.addCollaborator(ideaId, collabData);
    console.log("collabData:", collabData);

    const notificationData = {
      type: "collaborator-invite",
      inviterInfo: collabData.inviterInfo,
      targetUserId: collabData.uid,
      targetUserName: collabData.displayName,
      targetUserPhotoUrl: collabData.photoUrl,
      ideaId: ideaId,
      ideaTitle: collabData.ideaTitle,
      invitationId: uuidv4(),
      message: `New invite from ${collabData.inviterInfo.displayName} for: "${collabData.ideaTitle}". `,
      timestamp: new Date(),
    }; 

    console.log("targetUserId:", notificationData.targetUserId);

    await notificationServices.addNotification(
      collabData.uid,
      notificationData
    );
    
    handleNotification(io, notificationData);

    res.status(201).json({ message: "Collaborator added and notification sent." });
  })
);

// Export the router
export default router;
