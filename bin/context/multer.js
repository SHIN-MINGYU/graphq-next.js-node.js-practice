"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const verifyToken_1 = __importDefault(require("@jwt/verifyToken"));
try {
    fs_1.default.readdirSync("uploads");
}
catch (err) {
    console.error("uploads folder is not exist");
    fs_1.default.mkdirSync("uploads");
}
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination(req, file, done) {
            done(null, "uploads/");
        },
        filename(req, file, done) {
            // @ts-ignore
            const primaryKey = (0, verifyToken_1.default)(req.headers.authorization).userInfo.uid;
            done(null, "user" + primaryKey + ".png");
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
exports.default = upload;
//# sourceMappingURL=multer.js.map