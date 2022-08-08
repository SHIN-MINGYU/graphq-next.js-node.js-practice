import crypto from "crypto";
import { ObjectId } from "mongodb";
import refreshTokenSession from "schemas/refreshTokenSession";

type args = {
  username: string;
  uid: ObjectId;
};

const createSession = async (args: args) => {
  const { username, uid } = args;
  const sessionId = crypto
    .createHash("sha512")
    .update(username + process.env.JWT_SECRET_KEY + uid)
    .digest("hex");
  if (!(await refreshTokenSession.findOne({ _id: sessionId }))) {
    refreshTokenSession.create({ _id: sessionId, values: { username, uid } });
  }
  return sessionId;
};

export default createSession;
