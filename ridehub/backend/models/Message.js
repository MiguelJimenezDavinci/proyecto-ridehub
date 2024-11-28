import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversations", // Referencia al modelo de conversaciones
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencia al modelo de usuarios
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // La fecha se asigna automáticamente al momento de la creación
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Mongoose añade automáticamente createdAt y updatedAt
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
