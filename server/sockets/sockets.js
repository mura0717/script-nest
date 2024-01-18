import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { sessionMiddleware } from "../app.js";


let usersConnected = [];

export let io;

export const socketServer = (app) => {
  const server = http.createServer(app);
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["*"],
    },
  });

  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);
  io.use(wrap(sessionMiddleware));

  io.on("connection", (socket) => {
    socket.on("user-connect", (connectData) => {
      if (usersConnected.some((conn) => conn.socketId === socket.id)) {
        return;
      }
      usersConnected.push({ userId: connectData.userId, socketId: socket.id });
    });

    socket.on("disconnect", () => {
      console.log(usersConnected);
      usersConnected = usersConnected.filter(
        (conn) => conn.socketId !== socket.id
      );
    });

    socket.on("invite-accepted", ({ notificationData }) => {
    });

    socket.on("invite-declined", ({ notificationData }) => {
    });
  });
  return server;
};

export function sendInvitationNotification(io, notificationData) {
  console.log(
    "socket.js/Sending invitation with notificationData:",
    notificationData
  );
  const targetUserConn = connectionByUserId(notificationData.targetUserId);
  if (!targetUserConn) return;
  io.to(targetUserConn.socketId).emit("invite-collaborator", {
    targerUserName: notificationData.targerUserName,
    respondingUsername: notificationData.respondingUserName,
    respondingUserId: notificationData.respondingUserId,
    notificationId: notificationData.notificationId,
    invitationId: notificationData.invitationId,
    inviterInfo: notificationData.inviterInfo,
    ideaTitle: notificationData.ideaTitle,
    ideaId: notificationData.ideaId,
    message: notificationData.message,
    invitationId: notificationData.invitationId,
    timestamp: notificationData.timestamp,
    type: notificationData.type,
    targetUserId: notificationData.targetUserId,
  });
}

export function sendAcceptResponseNotification(io, notificationData) {
  const targetUserConn = connectionByUserId(notificationData.targetUserId);
  if (!targetUserConn) return;
  const acceptResponseData = {
    message: `"${notificationData.displayName.displayName}" accepted your invitation for "${notificationData.ideaTitle}"`,
    ideaTitle: notificationData.ideaTitle,
    targetUserId: notificationData.targetUserId,
    respondingUserId: notificationData.displayName.uid,
    respondingUserName: notificationData.displayName.displayName,
    ideaId: notificationData.ideaId,
  };
  io.to(targetUserConn.socketId).emit("accept-invite", acceptResponseData);
}

export function sendDeclineResponseNotification(io, notificationData) {
  const targetUserConn = connectionByUserId(notificationData.targetUserId);
  if (!targetUserConn) return;
  const declineResponseData = {
    message: `"${notificationData.respondingUserName}" declined your invitation for "${notificationData.ideaTitle}".`,
    invitationId: notificationData.invitationId,
    ideaTitle: notificationData.ideaTitle,
    targetUserId: notificationData.targetUserId,
    respondingUserId: notificationData.respondingUserId,
    respondingUserName: notificationData.respondingUserName,
    ideaId: notificationData.ideaId,
  };
  io.to(targetUserConn.socketId).emit("decline-invite", declineResponseData);
}

const connectionByUserId = (userId) => {
  return usersConnected.find((conn) => conn.userId === userId);
};
