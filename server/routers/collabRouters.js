import { Router } from "express";
import collabServices from "../services/collabServices.js";
import notificationServices from "../services/notificationServices.js";
import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";
import { io } from "../app.js";

const router = Router();

router.post(
  "/api/auth/ideas/:ideaId/collaborators",
  catchAsync(async (req, res) => {
    const ideaId = req.params.ideaId;
    console.log("ideaId", ideaId)
    const collabData = req.body;

    await collabServices.addCollaborator(ideaId, collabData);

    const notificationInfo = {
      type: "new_collaborator_invite",
      targetUserId: collabData.uid,
      relatedIdeaId: ideaId,
      message: `${collabData.inviterName} invited you to ${collabData.ideaTitle}. `,
      timestamp: new Date().toISOString(),
    };

    await notificationServices.addNotification(
      collabData.uid,
      notificationInfo
    );

    io.to(collabData.uid).emit("notification", notificationInfo);

    res
      .status(201)
      .json({ message: "Collaborator added and notification sent" });
  })
);

// Export the router
export default router;