import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

type userInfo = {
  uid?: ObjectId | any;
  username?: string;
  sessionId: string;
};

const createToken = (userInfo: userInfo, expiresIn: string): string => {
  const token = jwt.sign(
    { userInfo },
    process.env.JWT_SECRET_KEY || "SECRET_KEY",
    { expiresIn }
  );
  return token;
};

export default createToken;
