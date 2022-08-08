import multer from "multer";
import fs from "fs";
import verifyToken from "../jwt/verifyToken";

try {
  fs.readdirSync("uploads");
} catch (err) {
  console.error("uploads folder is not exist");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      // @ts-ignore
      const primaryKey = verifyToken(req.headers.authorization).userInfo.uid;
      done(null, "user" + primaryKey + ".png");
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
