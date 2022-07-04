import { Request, Response } from "express";
import verifyToken from "@jwt/verifyToken";
import refreshTokenSession from "../schemas/refreshTokenSession";
import createToken from "../jwt/createToken";
import { tokenSession } from "../type/session";

export default async function deserializeUser(req: Request, res: Response) {
  const { accessToken, refreshToken } = req.cookies;

  const payload = verifyToken(accessToken);

  //For a valid access token
  if (payload) {
    //@ts-ignore
    req.user = payload.userInfo;
    return true;
  }

  const refresh =
    !accessToken && refreshToken ? verifyToken(refreshToken) : null; //@ts-ignore

  if (!refresh) return console.log("none logined user");
  const session: tokenSession | null = await refreshTokenSession.findOne({
    //@ts-ignore
    _id: refresh.userInfo.sessionId,
  });

  if (!session) return new Error("session is can't define");
  const {
    _id,
    values: { uid, username },
  }: tokenSession = session;

  const newAccessToken = createToken(
    {
      sessionId: _id,
      uid,
      username,
    },
    "5m"
  );
  //@ts-ignore
  req.user = verifyToken(newAccessToken).userInfo;

  res.cookie("accessToken", newAccessToken, {
    maxAge: 1000 * 60 * 5,
    httpOnly: true,
  });
  return true;
}
