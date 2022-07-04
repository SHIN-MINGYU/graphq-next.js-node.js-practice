import { ObjectId } from "mongodb";

export type tokenSession = {
  _id: string;
  values: {
    username: string;
    uid: ObjectId;
  };
};
