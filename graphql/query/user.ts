import User from "@schemas/user";
import createToken from "@jwt/createToken";
import createSession from "@session/createSession";
import { contextType } from "@type/contextType";
import authErrorCheck from "../../util/error/authError";

interface LoginArgs {
  username: string;
  password: string | null;
}

const Login = async (_: any, args: LoginArgs, context: any) => {
  const { username, password } = args;
  const user = await User.findOne({ username, password });
  if (user) {
    // create session
    const sessionId = await createSession({ username, uid: user._id });

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
    console.log("here?");
    //return accessToken for remain in localStorage
    return accessToken;
  } else {
    return new Error("who are you?");
  }
};

const UserInfo = async (_: any, {}, context: contextType) => {
  // if deserializeUser's return value have authError
  // throw error
  authErrorCheck(context);
  // @ts-ignore
  const user = await User.findOne({ _id: context.req.user.uid });
  return user;
};

export default { Login, UserInfo };
