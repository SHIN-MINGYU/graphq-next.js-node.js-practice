import User from "@schemas/user";
import createToken from "@jwt/createToken";
import createSession from "@session/createSession";

type LoginArgs = {
  username: string;
  password: string;
};

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
    context.res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 5,
      httpOnly: true,
    });
    context.res.cookie("refreshToken", refreshToken, {
      maxAge: 3.154e10,
      httpOnly: true,
    });

    return "success";
  } else {
    return "who are you?";
  }
};
