import jwt from "jsonwebtoken";

type userInfo = {
  username: string;
  password: string;
};

const createToken = (userInfo: userInfo) => {
  const token = jwt.sign(
    { userInfo },
    process.env.JWT_SECRET_KEY || "SECRET_KEY",
    { expiresIn: "5h" }
  );
  return token;
};

export default createToken;
