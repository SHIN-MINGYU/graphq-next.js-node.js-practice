import { Schema, model } from "mongoose";

const contry_per_visitor_schema = new Schema({
  contry_code: String,
  count: Number,
});

export default model("contry_per_visitor", contry_per_visitor_schema);
