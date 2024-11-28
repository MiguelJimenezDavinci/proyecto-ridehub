import axios from "axios";

const API_URL = "http://localhost:5000";

// Obtener todos los chats de un usuario
export const getUserChats = async (id) => {
  console.log("userId :>> ", id);
  try {
    const response = await axios.get(`${API_URL}/api/chats/user/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (!response.data || response.data.length === 0) {
      console.log("No conversations found.");
      return []; // O también puedes devolver algún mensaje si lo prefieres
    }

    return response.data;
  } catch (error) {
    console.error("Error al obtener los chats:", error);
    throw error;
  }
};

export const getUserChat = async (chatId) => {
  console.log("chatId :>> ", chatId);
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found, user is not authenticated.");
    return;
  }

  console.log("API_URL: ", API_URL);
  console.log("Token: ", token);

  try {
    const response = await axios.get(`${API_URL}/api/chats/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Chat data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener los chats:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Obtener mensajes de un chat específico
export const getChatMessages = async (chatId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/chats/${chatId}/messages`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    throw error;
  }
};

// Enviar un mensaje en un chat
export const sendMessage = async (conversationId, senderId, message) => {
  console.log("conversationId :>> ", conversationId);
  console.log("senderId :>> ", senderId);
  console.log("message :>> ", message);
  try {
    const response = await axios.post("http://localhost:5000/api/message", {
      conversationId,
      senderId,
      message,
    });
    return response;
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    throw error;
  }
};

// Obtener lista de todos los usuarios para iniciar un nuevo chat
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/users`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

// Crear un nuevo chat con un usuario específico
export const createChat = async (userId, otherUserId) => {
  console.log("userId :>> ", userId);
  console.log("otherUserId :>> ", otherUserId);

  if (!userId || !otherUserId) {
    throw new Error("Cada participante debe tener un ID válido.");
  }

  try {
    const response = await axios.post(
      `${API_URL}/api/chats`,
      { members: [userId, otherUserId] }, // Asegúrate de enviar ambos IDs
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    return response.data;
  } catch (error) {
    console.error("Error al crear el chat:", error);
    throw error;
  }
};
