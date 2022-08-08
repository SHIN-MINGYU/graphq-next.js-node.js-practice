import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

const refresh_tokens_schema = new Schema({
  _id: String,
  values: {
    uid: ObjectId,
    username: String,
  },
});

export default model("refresh_tokens", refresh_tokens_schema);
