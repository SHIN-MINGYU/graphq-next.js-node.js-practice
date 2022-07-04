import { Request, Response } from "express";
import refreshTokenSession from "../schemas/refreshTokenSession";
import verifyToken from "./verifyToken";

export default function deleteToken(req: Request, res: Response) {
  const data = verifyToken(req.cookies.refreshToken);
  if (data) {
    refreshTokenSession
      //@ts-ignore
      .deleteOne({ _id: data.userInfo.sessionId })
      .then((res) => console.log("suceess"));

    res.cookie("accessToken", "", {
      maxAge: 0,
      httpOnly: true,
    });
    res.cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
    });
  }
  return "success";
}
