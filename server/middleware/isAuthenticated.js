import admin from "../config/firebaseAdmin.js";

 async function isAuthenticated(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }
    // Extract the token from 'Bearer <token>'
    const idToken = token.split(" ")[1];
    await admin.auth().verifyIdToken(idToken);
    next();
  } catch (error) {
    console.error("Error in authentication:", error);
    res.status(401).json({ message: "Not authenticated." });
  }
}

export default isAuthenticated;
