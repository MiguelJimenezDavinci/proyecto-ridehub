import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencia al modelo de usuarios
      required: true,
    },
  ],
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
