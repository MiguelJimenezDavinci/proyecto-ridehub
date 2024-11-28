import Conversation from "../models/Conversations.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { senderId, receiverId } = req.query;

    // Función para obtener los mensajes con datos de usuario
    const fetchMessagesWithUserData = async (conversationId) => {
      const messages = await Message.find({ conversationId });

      // Obtener todos los usuarios involucrados en los mensajes
      const userIds = [...new Set(messages.map((message) => message.senderId))]; // Distintos usuarios
      const users = await User.find({ _id: { $in: userIds } });

      const messageUserData = messages.map((message) => {
        const user = users.find(
          (u) => u._id.toString() === message.senderId.toString()
        );
        return {
          user: { id: user._id, email: user.email, fullName: user.fullName },
          message: message.message,
        };
      });

      return messageUserData;
    };

    // Verificación de la conversación o creación de una nueva
    if (conversationId === "New") {
      // Buscar si ya existe una conversación entre los dos usuarios
      const existingConversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
      });

      if (existingConversation) {
        // Si existe, obtenemos los mensajes
        const messages = await fetchMessagesWithUserData(
          existingConversation._id
        );
        return res.status(200).json(messages);
      } else {
        // Si no existe, crear una nueva conversación
        const newConversation = new Conversation({
          members: [senderId, receiverId],
        });
        await newConversation.save();

        // Devolver conversación vacía ya que no tiene mensajes aún
        return res.status(200).json([]);
      }
    } else {
      // Si la conversación ya existe, simplemente obtenemos los mensajes
      const messages = await fetchMessagesWithUserData(conversationId);
      return res.status(200).json(messages);
    }
  } catch (error) {
    console.error("Error en getMessages:", error);
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
};
export const sendMessage = async (req, res) => {
  const { conversationId, senderId, message } = req.body;

  // Verificar que los campos necesarios estén presentes
  if (!senderId || !message) {
    return res.status(400).json({
      error: "Faltan datos requeridos (senderId, message)",
    });
  }

  try {
    // Si conversationId es "New", crear una nueva conversación
    if (conversationId === "New") {
      // Crear una nueva conversación
      const newConversation = new Conversation({
        members: [senderId], // Asumiendo que solo se tiene un miembro al principio
      });

      // Guardar la nueva conversación en la base de datos
      const savedConversation = await newConversation.save();

      // Establecer el nuevo conversationId en la solicitud
      const conversationId = savedConversation._id;

      // Crear el mensaje con el nuevo conversationId
      const newMessage = new Message({
        conversationId,
        senderId,
        message,
      });

      // Guardar el mensaje en la base de datos
      await newMessage.save();

      // Responder con el mensaje y el ID de la conversación
      return res.status(200).json({ message: newMessage, conversationId });
    }

    // Si no es "New", continuar con el flujo normal para enviar el mensaje
    const existingConversation = await Conversation.findById(conversationId);
    if (!existingConversation) {
      return res.status(400).json({
        error: "La conversación no existe",
      });
    }

    // Crear el mensaje
    const newMessage = new Message({
      conversationId,
      senderId,
      message,
    });

    // Guardar el mensaje en la base de datos
    await newMessage.save();

    // Enviar el mensaje como respuesta
    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error al enviar el mensaje:", error);
    res
      .status(500)
      .json({ error: "Error al enviar mensaje", details: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({ _id: { $ne: userId } });
    const usersData = await Promise.all(
      users.map(async (user) => ({
        email: user.email,
        fullName: user.fullName,
        receiverId: user._id,
      }))
    );
    res.status(200).json(usersData);
  } catch (error) {
    console.error("Error en getAllUsers:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};
