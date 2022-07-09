import deleteToken from "@jwt/deleteToken";
import user from "@schemas/user";
import { contextType } from "@type/contextType";

type signUpArgs = {
  username: string;
  nickname: string;
  password: string;
  email?: string;
};

const SignUp = async (_: any, args: signUpArgs) => {
  await user.create({ ...args });
  return true;
};

const LogOut = async (_: any, {}, context: contextType) => {
  const { req, res } = context;
  deleteToken(req, res);
  return true;
};

type updateUserInfoArgs = {
  nickname?: string;
  gender?: string;
  description: string;
};

const UpdateUserInfo = async (
  _: any,
  args: updateUserInfoArgs,
  context: contextType
) => {
  if (typeof context.deserializeUser !== "string") {
    if (context.deserializeUser.authError) {
      throw context.deserializeUser.authError;
    }
  }
  // @ts-ignore
  if (!context.req.user) {
    throw new Error("GUEST");
  }

  const { nickname, gender, description } = args;

  user.updateOne(
    // @ts-ignore
    { _id: context.req.user.uid },
    {
      nickname,
      gender,
      description,
    }
  );
  return true;
};

export default { SignUp, LogOut, UpdateUserInfo };
