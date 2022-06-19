import { Schema, model } from "mongoose";

const {
  Types: { ObjectId },
} = Schema;

export const user_schema = new Schema({
  username: String,
  email: String,
  password: String,
  follower: [ObjectId],
  following: [ObjectId],
  createAt: { type: Date, default: Date.now },
});

export default model("user", user_schema);
