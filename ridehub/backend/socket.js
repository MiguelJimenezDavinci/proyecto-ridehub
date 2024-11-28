// socket.js
import User from "./models/User.js";
import Message from "./models/Message.js";
import Conversation from "./models/Conversations.js";

import { Server } from "socket.io";
import jwt from "jsonwebtoken"; // Asegúrate de tener jwt importado

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token; // El token se pasa en el handshake

  if (!token) {
    return next(new Error("No token provided"));
  }

  jwt.verify(token, "SECRET_KEY", (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error"));
    }
    socket.user = decoded; // Aquí adjuntas el usuario al socket
    next();
  });
}; // Asegúrate de ajustar la ruta si es necesario

// Función para configurar y manejar la lógica de Socket.IO
const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Permitir solicitudes desde tu frontend
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true, // Si necesitas cookies o sesiones
    },
  });

  io.use(authenticateSocket);

  // Socket.io
  let users = [];
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    socket.on("addUser", (userId) => {
      const isUserExist = users.find((user) => user.userId === userId);
      if (!isUserExist) {
        const user = { userId, socketId: socket.id };
        users.push(user);
        io.emit("getUsers", users);
      }
    });

    socket.on(
      "sendMessage",
      async ({ senderId, receiverId, message, conversationId }) => {
        const receiver = user.find((user) => user.userId === receiverId);
        const sender = user.find((user) => user.userId === senderId);
        const user = await User.findById(senderId);
        console.log("sender :>> ", sender, receiver);
        if (receiver) {
          io.to(receiver.socketId)
            .to(sender.socketId)
            .emit("getMessage", {
              senderId,
              message,
              conversationId,
              receiverId,
              user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
              },
            });
        } else {
          io.to(sender.socketId).emit("getMessage", {
            senderId,
            message,
            conversationId,
            receiverId,
            user: { id: user._id, fullName: user.fullName, email: user.email },
          });
        }
      }
    );

    socket.on("disconnect", () => {
      users = users.filter((user) => user.socketId !== socket.id);
      io.emit("getUsers", users);
    });
    // io.emit('getUsers', socket.userId);
  });

  return io;
};

export default configureSocket;
