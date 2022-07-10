import { Schema, model } from "mongoose";

const {
  Types: { ObjectId },
} = Schema;

export const user_schema = new Schema({
  username: String,
  nickname: String,
  email: String,
  gender: { type: String, default: "none" },
  password: String,
  description: String,
  imgPath: String,
  follower: [ObjectId],
  following: [ObjectId],
  createAt: { type: Date, default: Date.now },
});

export default model("user", user_schema);
