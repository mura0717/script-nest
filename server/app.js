import "dotenv/config";

//===================EXPRESS SETUP=====================//
import express from "express";
const app = express();
//app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//===================ERROR HANDLING=====================//
import errorMiddleware from "./middleware/errorMiddleware.js";
app.use(errorMiddleware);

//===================SESSION SECRET CREATION=======================//

// Use it to create a session secret.
/* import crypto from "crypto";
const sessionSecret = crypto.randomBytes(64).toString("hex");
console.log(sessionSecret); */

//===================SESSION SETUP=======================//

import session from "express-session";
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});
app.use(sessionMiddleware);

//===================SOCKET IO SETUP=====================//
import http from "http";
import { Server as SocketIOServer } from "socket.io";
const server = http.createServer(app);
export const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["*"],
  },
});

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));

let userToSocketMap = {};

 io.on("connection", (socket) => {
  console.log("Socket connected with id:", socket.id);

  socket.on("register-user", (userId) => {
    userToSocketMap[userId] = socket.id;
    console.log("register-user id:", userId, "Socket ID:", socket.id);
  });

  socket.on("disconnect", () => {
    // Remove the user from the map on disconnect
    for (let userId in userToSocketMap) {
      if (userToSocketMap[userId] === socket.id) {
        delete userToSocketMap[userId];
        console.log("Socket disconnected with id:", socket.id);
        break;
      }
    }
  });

  // Register the event listener for 'client-send-a-notification' here
  socket.on("client-send-a-notification", (notificationInfo) => {
    console.log("Received notification for forwarding:", notificationInfo);
    handleNotification(io, notificationInfo);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected with id:", socket.id);
  });
});

export function handleNotification(io, notificationInfo) {
    io.emit("server-send-a-notification", notificationInfo);
} 

/*  io.on("connection", (socket) => {
   console.log("Socket connected with id:", socket.id);
   /*   eventEmitter.on("new-notification", (data) => {
     socket.emit("new-notification", data);
   }); 

   socket.on("client-choose-a-color", (data) => {
     console.log("Received data:", data); // Debugging
     io.emit("server-sent-a-color", data);
   });

   // Don't forget to handle disconnection
   socket.on("disconnect", () => {
     console.log("Socket disconnected", socket.id);
   });
 });*/

//===================CORS SETUP=====================//
import cors from "cors";
/* app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 204,
})); */
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

//===================ROUTERS=====================//
import authRouters from "./routers/authRouters.js";
app.use(authRouters);

import adminRouters from "./routers/adminRouters.js";
app.use(adminRouters);

import userRouters from "./routers/userRouters.js";
app.use(userRouters);

import ideaRouters from "./routers/ideaRouters.js";
app.use(ideaRouters);

import apiRouters from "./routers/apiRouters.js";
app.use(apiRouters);

import collabRouters from "./routers/collabRouters.js";
app.use(collabRouters);

//Server Endpoint Test
app.get("/test", (req, res) => {
  res.send("Test endpoint is working.");
});

//===================SERVER===================//
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server is running on port ", PORT));

const SOCKET_PORT = process.env.SOCKET_PORT || 3000;
server.listen(
  SOCKET_PORT,
  console.log("Server is listening on port:", SOCKET_PORT)
);
