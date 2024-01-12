import { addDoc, collection, getFirestore } from "firebase/firestore";
import { createFirebaseApp } from "../config/firebaseServerConfig.js";
import { admin } from "../config/firebaseAdmin.js";
import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";

const app = createFirebaseApp()
const db = getFirestore(app)

const userServices = {

  getUser: async (userId) => {

  },
  
  getAllUsers: async () => {
  
  },
  
  /* export const createUser = async (userData) => {
   
  } */
  
  editUser: catchAsync(async (userId, updates) => {
    console.log("userServices-editUser-userId & updates:", userId, updates)
    await admin.auth().updateUser(userId, updates);
    return { success: true };
  }),
  
  deleteUser: async (userId) => {
   
  }

};


//firebase collection
const collectionName = "users";

//dummy user creator
const createUser = (Name, Email, Password, isAdmin) => {
  return {
    Name,
    Email,
    Password,
    isAdmin,
  };
};





export default userServices;

