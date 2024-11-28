import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ChatPrivate = () => {
  const { id } = useParams(); // id del destinatario
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    try {
      await axios.post(`/api/users/${id}/send-message`, { content: message });
      setMessage("");
      alert("Mensaje enviado exitosamente");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Privado</h1>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe tu mensaje aquí"
        className="border border-gray-300 rounded p-2 w-full max-w-md mb-4"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Enviar
      </button>
    </div>
  );
};

export default ChatPrivate;
