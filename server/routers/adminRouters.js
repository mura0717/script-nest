import { Router } from "express";
const router = Router();

import admin from 'firebase-admin';
import isAdmin from '../middleware/isAdmin.js'
import isAuthenticated from "../middleware/isAuthenticated.js";
import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";

// SET ADMIN
router.post('/api/auth/set-admin', isAuthenticated, isAdmin, catchAsync(async (req,res, next) => {
    const { uid } = req.body;
    if (!uid) {
        return next(new AppError("UID is missing from the request.", 400));
      }
      await admin.auth().setCustomUserClaims(uid, { isAdmin: true });
      res.status(200).json({ success: true, message: "Admin claims set successfully." });
}));

// ADMIN LOGIN CHECK
router.post(
  "/api/auth/login/guard/admin", isAuthenticated, isAdmin, catchAsync(async (req, res, next) => {
    console.log("Admin login check endpoint is hit.")
    const { idToken } = req.body;
    if (!idToken) {
      return next(new AppError("ID token is missing. Not logged in.", 400));
    } else {
      res.status(200).json({ success: true, message: "Admin logged in" });
    }
  })
);

// ALL USERS FETCH
router.get("/api/auth/admin/allusers", isAdmin, async (req, res) => {
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

router.post("/api/auth/admin/create");
router.get("/api/auth/set-admin") //super admin

export default router;