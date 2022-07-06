import User from "@schemas/user";
import createToken from "@jwt/createToken";
import createSession from "@session/createSession";
import verifyToken from "@jwt/verifyToken";
import { contextType } from "../../type/contextType";

interface LoginArgs {
  username: string;
  password: string | null;
}

export const Login = async (_: any, args: LoginArgs, context: any) => {
  const { username, password } = args;
  const user = await User.findOne({ username, password });
  if (user) {
    // create session
    const sessionId = createSession({ username, uid: user._id });

    // create && set access && refresh Tokens
    const accessToken = createToken(
      { uid: user._id, username, sessionId },
      "5m"
    );
    const refreshToken = createToken({ sessionId }, "1y");

    context.res.cookie("refreshToken", refreshToken, {
      maxAge: 3.154e10,
      httpOnly: true,
    });

    //return accessToken for remain in localStorage
    return accessToken;
  } else {
    return new Error("who are you?");
  }
};

export const UserInfo = async (_: any, {}, context: contextType) => {
  // if deserializeUser's return value have eauthError
  // throw error
  if (typeof context.deserializeUser !== "string") {
    if (context.deserializeUser.authError) {
      throw context.deserializeUser.authError;
    }
  }
  //else
  //decode jwt and return user info for query
  const { authorization } = context.req.headers;

  if (!authorization) return "false";
  const decoded = verifyToken(authorization)!;

  // @ts-ignore
  const user = await User.findOne({ _id: decoded.userInfo.uid });
  return user;
};
