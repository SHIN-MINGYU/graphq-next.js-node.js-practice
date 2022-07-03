import user from "../../schemas/user";

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
