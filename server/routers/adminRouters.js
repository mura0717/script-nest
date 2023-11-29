import { Router } from "express";
const router = Router();

import admin from 'firebase-admin';
import isAdmin from '../middleware/isAdmin.js'
import isAuthenticated from "../middleware/isAuthenticated.js";

router.post('/api/auth/set-admin', isAuthenticated, isAdmin, catchAsync(async (req,res, next) => {
    const { uid } = req.body;
    if (!uid) {
        return next(new AppError("UID is missing from the request.", 400));
      }
      await admin.auth().setCustomUserClaims(uid, { isAdmin: true });
      res.status(200).json({ success: true, message: "Admin claims set successfully." });
}));
 

router.post("/admin/create");
router.get("/admin/users");


export default router;