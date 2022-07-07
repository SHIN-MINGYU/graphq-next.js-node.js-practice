import { Request, Response } from "express";
import verifyToken from "@jwt/verifyToken";
import { AuthenticationError } from "apollo-server-core";

export default function deserializeUser(req: Request) {
  const { refreshToken } = req.cookies;
  const accessToken = req.headers.authorization;
  const payload = verifyToken(accessToken);
  if (!payload && refreshToken) {
    return {
      authError: new AuthenticationError("Auth Error : adsfasfd"),
    };
  } else if (!payload) {
    return "";
  }
  // @ts-ignore
  req.user = payload.userInfo;
  // @ts-ignore
  return "";
  //const refresh =
  //!accessToken && refreshToken ? verifyToken(refreshToken) : null; //@ts-ignore
}
