"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../context/multer"));
const verifyToken_1 = __importDefault(require("@jwt/verifyToken"));
const user_1 = __importDefault(require("@schemas/user"));
const router = express_1.default.Router();
router.post("/upload", multer_1.default.single("profileImg"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const { uid } = (0, verifyToken_1.default)(req.headers.authorization).userInfo;
        yield user_1.default.updateOne({ _id: uid }, { imgPath: process.env.MY_HOST + `/img/user${uid}.png` });
        return res.status(200).send(true);
    }
    catch (err) {
        return res.status(404);
    }
}));
exports.default = router;
//# sourceMappingURL=img.js.map