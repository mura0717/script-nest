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
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["*"],
  },
});

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));

import { eventEmitter } from "./events/eventEmitter.js";
io.on("connection", (socket) => {
  console.log("Socket connected with id:", socket.id);
  eventEmitter.on("new-notification", (data) => {
    socket.emit("new-notification", data);
  });

  // Don't forget to handle disconnection
  /*   socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
  }); */
});

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

// Firestore DB test
/* import { testDB } from "./services/userServices.js";
app.get("/createdummyusers", (req, res) => {
    testDB();
    res.send("200");
}) */

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
