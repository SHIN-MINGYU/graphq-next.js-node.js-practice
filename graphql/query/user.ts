import User from "@schemas/user";
import { getItemToMongo } from "../action";
import createToken from "../../jwt/createToken";

type LoginArgs = {
  username: string;
  password: string;
};

export const Login = async (_: any, args: LoginArgs) => {
  console.log("시발");
  const { username, password } = args;
  const user = await User.findOne({ username, password });
  if (user) {
    const tokens = createToken(args);
    return tokens;
  } else {
    return "who are you?";
  }
};
