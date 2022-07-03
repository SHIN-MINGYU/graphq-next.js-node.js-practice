import jwt from "jsonwebtoken";

function getClaims(authorization: string | undefined) {
  try {
    if (authorization === undefined) {
      throw new Error("authorization can't find");
    }
    const token = jwt.verify(
      authorization,
      process.env.JWT_SECRET_KEY || "SECRET_KEY"
    );
    return token;
  } catch (err) {
    return null;
  }
}
export default getClaims;
