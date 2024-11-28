import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Input from "../components/Input";
import { io } from "socket.io-client";
import { getAllUsers } from "../service/user";
import {
  getUserChats,
  getUserChat,
  sendMessage,
  createChat,
} from "../service/message";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const { user } = useAuth(); // Obtener el usuario del contexto
  const [receiverId, setReceiverId] = useState("");
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState({ messages: [], receiver: {} });
  const [message, setMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Controlar el estado de carga
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const messageRef = useRef(null);

  // Establecer la conexión del socket
  useEffect(() => {
    const newSocket = io("http://localhost:5173");
    socketRef.current = newSocket;

    newSocket.on("connect", () =>
      console.log("Conectado al servidor de sockets")
    );
    newSocket.on("getMessage", (data) => {
      setMessages((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { user: data.user, message: data.message },
        ],
      }));
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Unir al usuario en el socket y obtener usuarios activos
  useEffect(() => {
    if (!socket || !user?.id) return;

    socket.emit("addUser", user.id);
    socket.on("getUsers", (users) => {
      console.log("activeUsers :>> ", users);
    });
  }, [socket, user?.id]);

  // Obtener conversaciones del usuario
  useEffect(() => {
    if (!user?.id) return;
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await getUserChats(user.id);

        console.log("Conversations:", response);
        setConversations(response);
        setLoading(false);
      } catch (error) {
        console.error("Error trayendo los chats:", error);
        setLoading(false);
      }
    };
    fetchConversations();
  }, [user?.id]);

  // Obtener todos los usuarios
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await getAllUsers();
        setAllUsers(response.data);
        setReceiverId(response.data[0]?.id);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchAllUsers();
  }, []);

  // Obtener mensajes de la conversación
  const fetchMessages = async (conversationId) => {
    if (conversationId === "New") {
      return; // Evitar hacer fetch si se está creando una nueva conversación
    }

    try {
      const response = await getUserChat(conversationId);
      if (response && response.length > 0) {
        setMessages({ messages: response, receiver: response[0]?.user });
      }
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId]);

  const startNewConversation = async (receiverId) => {
    console.log("receiverId :>> ", receiverId);

    if (!receiverId) {
      console.error("El ID del receptor es inválido.");
      return;
    }

    try {
      const response = await createChat(user.id, receiverId);
      setConversationId(response.conversationId);
      setReceiverId(receiverId); // Actualiza correctamente el ID del receptor
      setMessages({ messages: [], receiver: { id: receiverId } });
    } catch (error) {
      console.error("Error al iniciar una nueva conversación:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return; // Prevenir el envío de mensajes vacíos

    try {
      setMessage("");
      await sendMessage(conversationId, user.id, message);
      socketRef.current.emit("sendMessage", {
        conversationId,
        userId: user.id,
        message,
      });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  return (
    <div className="w-screen flex">
      {/* Left Sidebar */}
      <div className="w-[25%] h-screen bg-secondary overflow-scroll">
        <div className="flex items-center my-8 mx-14">
          <div>
            <img
              src=""
              width={75}
              height={75}
              className="border border-primary p-[2px] rounded-full"
              alt="Profile"
            />
          </div>
          <div className="ml-8">
            <h3 className="text-2xl">{user?.fullName}</h3>
            <p className="text-lg font-light">My Account</p>
          </div>
        </div>
        <hr />
        <div className="mx-14 mt-10">
          <div className="text-primary text-lg">Messages</div>
          <div>
            {loading ? (
              <div>Loading conversations...</div>
            ) : conversations?.length > 0 ? (
              conversations.map(({ conversationId, user }) => (
                <div
                  key={conversationId}
                  className="flex items-center py-8 border-b border-b-gray-300"
                  onClick={() => setConversationId(conversationId)}
                >
                  <div className="cursor-pointer flex items-center">
                    <img
                      src={`http://localhost:5000/${user?.photo}`}
                      className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary"
                      alt="User"
                    />
                    <div className="ml-6">
                      <h3 className="text-lg font-semibold">
                        {user?.id === user?.id ? "You" : user?.fullName}
                      </h3>
                      <p className="text-sm font-light text-gray-600">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No Conversations
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-[50%] h-screen bg-white flex flex-col items-center">
        {messages?.receiver?.fullName && (
          <div className="w-[75%] bg-secondary h-[80px] my-14 rounded-full flex items-center px-14 py-2">
            <div className="cursor-pointer">
              <img
                src={`http://localhost:5000/${messages?.receiver?.photo}`}
                width={60}
                height={60}
                className="rounded-full"
                alt="Receiver"
              />
            </div>
            <div className="ml-6 mr-auto">
              <h3 className="text-lg">{messages?.receiver?.fullName}</h3>
              <p className="text-sm font-light text-gray-600">
                {messages?.receiver?.email}
              </p>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="h-[75%] w-full overflow-scroll shadow-sm">
          <div className="p-14">
            {messages?.messages?.length > 0 ? (
              messages.messages.map(({ message, user: { id } = {} }, index) => (
                <div
                  key={index}
                  className={`max-w-[40%] my-4 ${
                    id === user?.id
                      ? "ml-auto bg-primary text-white"
                      : "mr-auto bg-gray-100"
                  } p-4 rounded-lg`}
                >
                  {message}
                </div>
              ))
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No messages yet.
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="w-[75%] py-5">
          <form onSubmit={handleSendMessage} className="w-full">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="mt-2 bg-blue-500 text-white p-2 rounded"
              disabled={!message.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Right Sidebar (People) */}
      <div className="w-[25%] h-screen bg-secondary overflow-scroll">
        <div className="text-primary text-lg">People</div>
        <div>
          {allUsers?.map((user) => (
            <div
              key={allUsers._id}
              onClick={() => startNewConversation(user._id)}
            >
              <div className="flex items-center py-8 border-b border-b-gray-300">
                <div className="cursor-pointer flex items-center">
                  <img
                    src={`http://localhost:5000/${user.photo}`}
                    className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary"
                    alt="User"
                  />
                  <div className="ml-6">
                    <h3 className="text-lg font-semibold">{user.fullName}</h3>
                    <p className="text-sm font-light text-gray-600">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
