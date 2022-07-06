import { ObjectId } from "mongodb";
import { SuperProperty } from "typescript";

export type tokenSession = {
  _id: string;
  values: {
    username: string;
    uid: ObjectId;
  };
};

export interface userInfo {
  sessionId: string;
  uid: ObjectId;
  username: string;
}

export interface decodedToken extends userInfo {
  userInfo: SuperProperty;
  iat: number;
  exp: number;
}
