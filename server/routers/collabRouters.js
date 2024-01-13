// ... Collaborator addition logic ...

// Example of adding a collaborator within ideaRouters
router.post(
  "/api/auth/ideas/:ideaId/collaborators",
  catchAsync(async (req, res) => {
    const ideaId = req.params.ideaId;
    const collaboratorData = req.body;
    await collaboratorServices.addCollaborator(ideaId, collaboratorData);
    res.status(201).json({ message: "Collaborator added successfully" });
  })
);

// Create and emit a notification
const notificationInfo = {
  type: "new_collaborator_invite",
  // other details
};
await notificationServices.createNotification(notificationInfo);
io.emit("notification", notificationInfo); // Using Socket.io to emit the notification

// Return response
res.status(201).json({ message: "Collaborator added and notification sent" });

// Notification collection example:
/* {
  "type": "new_collaborator_invitation",
  "targetUserId": "user123",
  "relatedIdeaId": "idea456",
  "message": "You have been invited to collaborate on Idea XYZ",
  "timestamp": "2021-01-01T00:00:00Z"
} */
