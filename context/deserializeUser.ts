import { Request, Response } from "express";
import verifyToken from "jwt/verifyToken";
import { AuthenticationError } from "apollo-server-core";

export default function deserializeUser(req: Request) {
  const { refreshToken } = req.cookies;
  const accessToken = req.headers.authorization;

  const payload = verifyToken(accessToken);

  if (!payload && refreshToken) {
    return {
      authError: new AuthenticationError("Auth Error : need accessToken"),
    };
  }
  if (!payload) {
    return;
  }
  // @ts-ignore
  req.user = payload.userInfo;

  return "true";
}
