import { Schema, model, now } from "mongoose";

const {
  Types: { ObjectId },
} = Schema;

const chat_logs_schema = new Schema({
  chat_room: { type: ObjectId, ref: "chat_room", required: true },
  uid: { type: ObjectId, ref: "user", required: true },
  username: String,
  log: String,
  createAt: { type: Date, default: now },
});

export default model("chat_logs", chat_logs_schema);
