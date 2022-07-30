import deleteToken from "@jwt/deleteToken";
import user from "@schemas/user";
import { contextType } from "@type/contextType";
import { ObjectId } from "mongoose";
import createHashedPassword from "util/user/createHashedPassword";
import authErrorCheck from "../../util/error/authError";
import transport from "../../util/mailer";

//=============================================================================

type signUpArgs = {
  username: string;
  nickname: string;
  password: string;
  email?: string;
};

const SignUp = async (_: any, args: signUpArgs) => {
  const { password, ...info } = args;
  const hashedPassword = await createHashedPassword(password);
  if (hashedPassword)
    await user.create({
      password: hashedPassword.password,
      salt: hashedPassword.salt,
      ...info,
    });
  else return false;
  return true;
};

//=============================================================================

type sendMailArgs = {
  email: string;
};

const SendMail = async (_: any, args: sendMailArgs) => {
  const { email } = args;
  const verifyCode = String(Math.floor(1000 + Math.random() * 9000));
  const emailRe =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  if (!emailRe.test(email)) {
    throw new Error("invaild email");
  }
  try {
    await transport.sendMail({
      from: "smg20004@naver.com",
      to: email,
      subject: `[${verifyCode}] verification Code is successfully send`,
      html: `${verifyCode}`,
    });
    return verifyCode;
  } catch (err) {
    console.log(err);
  }
};

//=============================================================================

const LogOut = async (_: any, {}, context: contextType) => {
  const { req, res } = context;
  deleteToken(req, res);
  return true;
};

//=============================================================================

type updateUserInfoArgs = {
  nickname?: string;
  gender?: string;
  description: string;
  profileImg: File;
};

const UpdateUserInfo = async (
  _: any,
  args: updateUserInfoArgs,
  context: contextType
) => {
  authErrorCheck(context);
  const { nickname, gender, description } = args;
  await user.updateOne(
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

//=============================================================================

type sendFollowArgs = {
  uid: ObjectId;
};

const SendFollow = async (
  _: any,
  args: sendFollowArgs,
  context: contextType
) => {
  const { uid } = args;

  // @ts-ignore
  await user.findOneAndUpdate(
    { _id: uid },
    // @ts-ignore
    { $push: { follower: context.req.user.uid } }
  );

  await user.findOneAndUpdate(
    // @ts-ignore
    { _id: context.req.user.uid },
    { $push: { following: uid } }
  );
  return true;
};

//=============================================================================

export default { SignUp, SendMail, LogOut, UpdateUserInfo, SendFollow };
