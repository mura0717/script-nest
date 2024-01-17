import { addDoc, collection, getFirestore } from "firebase/firestore";
import { createFirebaseApp } from "../config/firebaseServerConfig.js";
import { admin } from "../config/firebaseAdmin.js";
import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";

const app = createFirebaseApp()

const userServices = {

  getUser: async (userId) => {},
  
  getAllUsers: async () => {},
  
  editUser: catchAsync(async (userId, updates) => {
    console.log("userServices-editUser-userId & updates:", userId, updates)
    await admin.auth().updateUser(userId, updates);
    return { success: true };
  }),
  
  deleteUser: async (userId) => {}

};
export default userServices;

