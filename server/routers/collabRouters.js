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
    const collabData = req.body;
    console.log("collabData:", collabData) 

    await collabServices.addCollaborator(ideaId, collabData);
    console.log("collabData.uid:", collabData.uid);
    console.log("collabData.displayName:", collabData.displayName);
    console.log(
      "collabData.owner:",
      collabData.inviterInfo
    );

    const notificationData = {
      type: "collaborator-invite",
      inviterInfo: collabData.inviterInfo,
      targetUserId: collabData.uid,
      targetUserName: collabData.displayName,
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
