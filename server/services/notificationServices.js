import { db } from "../config/firebaseAdmin.js";

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
    console.log("notifId", notificationId)
    console.log("ideaId", ideaId)
    const notificationsRef = db
      .collection("notifications")
      .doc(notificationId)
      .collection("ideas")
      .doc(ideaId);
    await notificationsRef.delete();
    return notificationId;
  },
};

export default notificationServices;
