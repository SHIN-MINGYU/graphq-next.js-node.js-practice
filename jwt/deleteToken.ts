import { Request, Response } from "express";
import refreshTokenSession from "../schemas/refreshTokenSession";
import verifyToken from "./verifyToken";

const deleteToken = (req: Request, res: Response): boolean => {
  const data = verifyToken(req.cookies.refreshToken);
  if (data) {
    refreshTokenSession
      //@ts-ignore
      .deleteOne({ _id: data.userInfo.sessionId })
      .then((res) => console.log("suceess"))
      .catch((err) => console.log(err));

    res.cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
    });
  }
  return true;
};

export default deleteToken;
