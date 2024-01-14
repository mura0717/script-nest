import { Router } from "express";
const router = Router();

import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import ideaServices from "../services/ideaServices.js";

//GET ALL IDEAS
router.get(
  "/api/auth/ideas",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const userId = req.user.uid;
    console.log("ideaRouters/getAllIdeas userId:", userId)
    const ideas = await ideaServices.getAllIdeas(userId);
    res.json(ideas);
  })
);

// GET A SINGLE IDEA
router.get(
  "/api/auth/ideas/{ideaId}",
  isAuthenticated,
  catchAsync(async (req, res) => {
    console.log("ideaRouters/ getIdea is hit.");
    const userId = req.user.uid;
    const ideaId = req.params.ideaId;
    console.log("ideaRouters/getIdea userId:", userId);
    console.log("ideaRouters/getIdea ideaId:", ideaId);
    const idea = await ideaServices.getIdea(ideaId, userId);
    if (idea) {
      res.json(idea);
    } else {
      res.status(404).send("Idea not found");
    }
  })
);

//SAVE NEW IDEA
router.post(
  "/api/auth/ideas",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const userId = req.user.uid;
    const ideaData = req.body;
    const newIdeaId = await ideaServices.createIdea({
      ...ideaData,
      ownerId: userId,
    });
    res.status(201).json({ id: newIdeaId });
  })
);

//EDIT IDEA
router.patch(
  "/api/auth/ideas/{ideaId}",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const ideaId = req.params.ideaId;
    const updatedIdeaData = req.body;
    await ideaServices.editIdea(ideaId, updatedIdeaData);
    res.status(200).send("Idea updated successfully");
  })
);

//DELETE IDEA
router.delete(
  "api/auth/ideas/{ideaId}",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const ideaId = req.params.ideaId;
    await ideaServices.deleteIdea(ideaId);
    res.status(200).send("Idea deleted successfully");
  })
);

export default router;
