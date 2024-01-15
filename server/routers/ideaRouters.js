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
    const ideas = await ideaServices.getAllIdeas(userId);
    res.json(ideas);
  })
);

// GET A SINGLE IDEA
router.get(
  "/api/auth/ideas/:ideaId",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const userId = req.user.uid;
    const ideaId = req.params.ideaId;
    console.log("ideaRouters/getIdea userId:", userId);
    console.log("ideaRouters/getIdea ideaId:", ideaId);
    const idea = await ideaServices.getIdea(ideaId, userId);
    if (idea) {
      res.json(idea);
    } else {
      res.status(404).json({ message: "Idea not found." });
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
  "/api/auth/ideas/:ideaId",
  isAuthenticated,
  catchAsync(async (req, res) => {
    console.log("ideaRouter/patch is hit.");
    const ideaId = req.params.ideaId;
    console.log("ideaRouter/patch ideaId;", ideaId);
    const updatedIdeaData = req.body;
    console.log("ideaRouter/patch updatedIdeaData;", updatedIdeaData);
    await ideaServices.editIdea(ideaId, updatedIdeaData);
    res.status(200).json({ message: "Idea updated successfully" });
  })
);

//DELETE IDEA
router.delete(
  "/api/auth/ideas/:ideaId",
  isAuthenticated,
  catchAsync(async (req, res) => {
    console.log("ideaRouter/delete is hit.");
    const ideaId = req.params.ideaId;
    console.log("ideaRouter/delete ideaId;", ideaId);
    await ideaServices.deleteIdea(ideaId);
    res.status(200).json({ message: "Idea deleted successfully"});
  })
);

export default router;
