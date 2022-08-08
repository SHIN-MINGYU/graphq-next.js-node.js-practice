import express from "express";
import upload from "../context/multer";
import verifyToken from "../jwt/verifyToken";
import User from "../schemas/user";

const router = express.Router();

router.post("/upload", upload.single("profileImg"), async (req, res) => {
  try {
    // @ts-ignore
    const { uid } = verifyToken(req.headers.authorization).userInfo;
    await User.updateOne(
      { _id: uid },
      { imgPath: process.env.MY_HOST + `/img/user${uid}.png` }
    );
    return res.status(200).send(true);
  } catch (err) {
    return res.status(404);
  }
});

export default router;
