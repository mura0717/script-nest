import { Router } from "express";
const router = Router();
import AppError from "../utils/errorHandling/AppError.js";
import { catchAsync } from "../utils/errorHandling/errorHandlers.js";
import userServices from "../services/userServices.js";
import isAdmin from "../middleware/isAdmin.js";

 // User name fetch
router.get("/api/auth/user/profile", catchAsync(async (req, res, next) => {
  const { displayName } = req.query;
  if (!displayName) {  
    return next(new AppError("User's name couldn't fetched.", 401));
  } else {
    res.status(200).json({ success: true, message: "User's name fetched.", data: displayName  });
  }
}));

// All users fetch
router.get("/api/auth/admin", isAdmin, async (req, res) => {
  try {
    const results = await usersService.getAllUsers();
    if (results.allUsers && results.allUsers.length >= 0) {
      res
        .status(200)
        .json({ data: results.allUsers, message: "All users fetched." });
    } else {
      res.status(404).json({ status: 404, message: "No users found." });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
});

export default router;