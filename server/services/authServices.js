import admin from "../config/firebaseAdmin.js";
import AppError from '../utils/error_handling/AppError.js';

export const signupServices = {
  registerUserWithFirebase: async (newUser) => {
    console.log("registerUserWithFirebase is hit.")
    const { name, email, password } = newUser;
    try {
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: name,
      });
      console.log("userRecord:", userRecord);
      return userRecord;
    } catch (error) {
      console.log(error);
      throw new AppError("Error registering user.", 500);
    }
  },
};

export const loginServices = {
  verifyIdToken: async (idToken) => {
    console.log("loginServices is hit.");
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.log(error);
      throw new AppError("Error logging user in.", 500);
    }
  },
};
