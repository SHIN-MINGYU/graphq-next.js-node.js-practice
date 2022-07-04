import jwt, { JwtPayload } from "jsonwebtoken";

function verifyToken(token: string) {
  try {
    if (token === undefined) {
      throw new Error("authorization can't find");
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "SECRET_KEY"
    );
    return decoded;
  } catch (err) {
    return null;
  }
}
export default verifyToken;