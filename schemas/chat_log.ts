import { Schema, model } from "mongoose";

const {
  Types: { ObjectId },
} = Schema;

const chat_logs_schema = new Schema({
  chat_room: { type: ObjectId, ref: "chat_room", required: true },
  uid: { type: ObjectId, ref: "user", required: true },
  log: String,
});

export default model("chat_logs", chat_logs_schema);
