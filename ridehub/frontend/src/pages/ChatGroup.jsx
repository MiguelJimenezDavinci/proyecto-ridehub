import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatGroup = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };
    fetchUsers();
  }, []);

  const addUserToGroup = (userId) => {
    setSelectedUserIds([...selectedUserIds, userId]);
  };

  const sendGroupMessage = async () => {
    try {
      await axios.post("/api/groups/send-message", {
        userIds: selectedUserIds,
        content: message,
      });
      setMessage("");
      alert("Mensaje enviado al grupo exitosamente");
    } catch (error) {
      console.error("Error al enviar mensaje al grupo:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Chat en Grupo</h1>
      <h2 className="text-lg font-semibold mb-4">Agregar usuarios al grupo:</h2>
      <div className="flex flex-wrap mb-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="m-2 p-2 border border-gray-300 rounded"
          >
            <p className="mb-2">{user.username}</p>
            <button
              onClick={() => addUserToGroup(user._id)}
              className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
            >
              Agregar
            </button>
          </div>
        ))}
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe tu mensaje al grupo aquí"
        className="border border-gray-300 rounded p-2 w-full max-w-md mb-4"
      />
      <button
        onClick={sendGroupMessage}
        className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
      >
        Enviar al Grupo
      </button>
    </div>
  );
};

export default ChatGroup;
