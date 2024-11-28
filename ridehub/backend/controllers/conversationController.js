import Conversation from "../models/Conversations.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getUserChats = async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener todas las conversaciones en las que participa el usuario
    const conversations = await Conversation.find({ members: id });

    // Si no hay conversaciones, devolver un array vacío
    if (!conversations || conversations.length === 0) {
      return res.status(200).json([]);
    }

    // Devolver las conversaciones
    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error al obtener conversaciones:", error);
    res.status(500).json({ error: "Error al obtener conversaciones." });
  }
};

export const getChatMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Obtener y ordenar los mensajes por fecha de creación
    const messages = await Message.find({ conversationId: chatId })
      .sort({ createdAt: 1 })
      .populate("sender", "username email photo");

    // Marcar mensajes no leídos como leídos antes de responder
    await Message.updateMany(
      { conversationId: chatId, read: false },
      { read: true }
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    res.status(500).json({ error: "Error al obtener mensajes." });
  }
};
export const createChat = async (req, res) => {
  const { members } = req.body;

  // Validar que haya al menos dos miembros
  if (!members || members.length < 2) {
    return res.status(400).json({
      error: "Se requieren al menos dos miembros para crear una conversación.",
    });
  }

  try {
    // Verificar si los usuarios existen en la base de datos
    const usersExist = await User.find({ _id: { $in: members } });

    // Si no todos los usuarios existen, devolver error
    if (usersExist.length !== members.length) {
      return res.status(400).json({ error: "Uno o más usuarios no existen." });
    }

    // Crear la nueva conversación
    const newConversation = new Conversation({ members });

    // Guardar la conversación en la base de datos
    await newConversation.save();

    // Devolver la respuesta con el ID de la conversación
    return res.status(201).json({
      conversationId: newConversation._id,
      members: newConversation.members,
    });
  } catch (error) {
    console.error("Error al crear conversación:", error);
    return res.status(500).json({ error: "Error al crear conversación." });
  }
};
