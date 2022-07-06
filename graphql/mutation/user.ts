import deleteToken from "@jwt/deleteToken";
import user from "@schemas/user";
import { contextType } from "@type/contextType";

type signUpArgs = {
  username: string;
  nickname: string;
  password: string;
  email?: string;
};

export const SignUp = async (_: any, args: signUpArgs) => {
  await user.create({ ...args });
  return true;
};

export const LogOut = async (_: any, {}, context: contextType) => {
  const { req, res } = context;
  deleteToken(req, res);
  return true;
};
