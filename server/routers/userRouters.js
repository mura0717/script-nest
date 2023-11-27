import { Router } from "express";
const router = Router();
import userServices from "../services/userServices.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

/* // User name fetch
router.get("/api/auth/user/profile", async (req, res) => {
  const userName = req.session.user;
  if (userName) {
    res.send(200).json({ message: "User's name fetched.", data: userName });
  } else {
    res.send(401).json({ message: "User's name couldn't fetched." });
  }
});

// All users fetch
router.get("/api/auth/admin", requireAdmin, async (req, res) => {
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

export default router; */