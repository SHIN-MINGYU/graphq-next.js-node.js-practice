import { Schema, model } from "mongoose";

const {
  Types: { ObjectId },
} = Schema;

const chat_room_schema = new Schema({
  type: String,
  uid: [{ type: ObjectId, ref: "user", required: "true" }],
});

export default model("chat_room", chat_room_schema);
