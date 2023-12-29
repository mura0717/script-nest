import { Router } from "express";
const router = Router();

import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { ideaServices } from "../services/ideaServices.js";

//GET ALL IDEAS
router.get('/api/ideas', catchAsync(async (req, res) => {
    const userId = req.user.uid; // User's UID
    // Add code to fetch all ideas from Firestore for the given userId
    // Return ideas in response
}));

// GET A SINGLE IDEA
router.get('/api/ideas/ideaId', catchAsync(async (req, res) => {
    const userId = req.user.uid;
    // Add code to fetch an idea from Firestore for the given userId
    // Return idea in response
}))

//G
router.post('/api/ideas/create', catchAsync(async (req, res) => {
    const userId = req.user.uid;
    const ideaData = req.body;
    // Add code to save ideaData to Firestore under the userId
    // Return success response
}))

router.patch('/api/ideas', catchAsync(async (req, res) => {
    const userId = req.user.uid; // User's UID
    // Add code to edit ideas from Firestore for the given userId
    // Return success response
}));

router.delete('api/ideas', catchAsync(async (req, res) => {
  const userId = req.user.uid;
  // Add code to delete an idea from Firestore for the given userId
  // Return success response
}))

export default router;