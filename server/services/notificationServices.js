import { db } from "../config/firebaseAdmin.js";
import { eventEmitter } from "../events/eventEmitter.js";
import AppError from "../utils/ErrorHandling/AppError.js";
import { catchAsync } from "../utils/ErrorHandling/GlobalErrorHandler.js";

export const notificationServices = {
  addNotification: async (notificationId, notificationData) => {
    const notificationsRef = db
      .collection("notifications")
      .doc(notificationId)
      .collection("ideas");
    await notificationsRef.add(notificationData);
  },

  getNotification: async (notificationId, limit = 5) => {
    const notificationsRef = db
      .collection("notifications")
      .doc(notificationId)
      .collection("ideas")
      .orderBy("timestamp", "desc")
      .limit(limit);
    const snapshot = await notificationsRef.get();
    let notifications = [];
    snapshot.forEach((doc) =>
      notifications.push({ id: doc.id, ...doc.data() })
    );
    return notifications;
  },

  deleteNotification: async (notificationId, ideaId) => {
    const notificationsRef = db
      .collection("ideas")
      .doc(notificationId)
      .collection("ideas")
      .doc(ideaId);
    await notificationsRef.delete();
    return notificationId;
  },
};

export default notificationServices;
