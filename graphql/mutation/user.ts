import deleteToken from "@jwt/deleteToken";
import user from "@schemas/user";

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

export const LogOut = async (_: any, {}, context: any) => {
  const { req, res } = context;
  deleteToken(req, res);
  return true;
};
