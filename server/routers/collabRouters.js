import { Router } from "express";
import collabServices from "../services/collabServices.js";
import notificationServices from "../services/notificationServices.js";
import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";
import { handleNotification } from "../app.js";
import { io } from "../app.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();

router.post(
  "/api/auth/ideas/:ideaId/collaborators",
  catchAsync(async (req, res) => {
    const ideaId = req.params.ideaId;
    console.log("ideaId", ideaId);
    const collabData = req.body;

    await collabServices.addCollaborator(ideaId, collabData);
    console.log("collabData.uid:", collabData.uid);
    console.log("collabData.inviter.displayName:", collabData.inviter.displayName);

    const notificationInfo = {
      type: "collaborator-invite",
      inviter: collabData.inviter,
      targetUserId: collabData.uid,
      targetUserName: collabData.displayName,
      relatedIdeaId: ideaId,
      relatedIdeaTitle: collabData.ideaTitle,
      invitationId: uuidv4(),
      message: `New invite from ${collabData.inviter.displayName} for: "${collabData.ideaTitle}". `,
      timestamp: new Date(),
    }; 

    console.log("targetUserId:", notificationInfo.targetUserId);

    await notificationServices.addNotification(
      collabData.uid,
      notificationInfo
    );
    
    handleNotification(io, notificationInfo);

    res.status(201).json({ message: "Collaborator added and notification sent." });
  })
);

// Export the router
export default router;
