import User from "@schemas/user";
import createToken from "@jwt/createToken";
import createSession from "@session/createSession";
import { contextType } from "@type/contextType";
import authErrorCheck from "../../util/error/authError";
import createHashedPassword from "util/user/createHashedPassword";
import { ObjectId } from "mongoose";

//=============================================================================

interface LoginArgs {
  username: string;
  password: string | null;
}

const Login = async (_: any, args: LoginArgs, context: any) => {
  const { username, password } = args;
  const user = await User.findOne({ username });
  const hashedValue = await createHashedPassword(password!, user?.salt);
  if (user && user.password === hashedValue!.password) {
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
    //return accessToken for remain in localStorage
    return accessToken;
  } else {
    return new Error("who are you?");
  }
};

//=============================================================================

const UserInfo = async (_: any, {}, context: contextType) => {
  // if deserializeUser's return value have authError
  // throw error
  authErrorCheck(context);
  // @ts-ignore
  const user = await User.findOne({ _id: context.req.user.uid });
  return user;
};

//=============================================================================

type SearchUserArgs = {
  username: string;
};

const SearchUser = async (_: any, args: SearchUserArgs) => {
  const { username } = args;
  if (await User.findOne({ username })) {
    return true;
  }
  return false;
};

//=============================================================================

const GetF4F = async (_: any, {}, context: contextType) => {
  authErrorCheck(context);
  // @ts-ignore
  const user = await User.findOne({ _id: context.req.user.uid });
  const F4F = user?.follower?.filter((item) => user.following?.includes(item));
  const F4FUserInfo = await User.find({ _id: { $in: F4F } });
  return F4FUserInfo;
};

//=============================================================================

export default { Login, UserInfo, SearchUser, GetF4F };
