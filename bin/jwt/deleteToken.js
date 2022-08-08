"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const refreshTokenSession_1 = __importDefault(require("schemas/refreshTokenSession"));
const verifyToken_1 = __importDefault(require("./verifyToken"));
const deleteToken = (req, res) => {
    const data = (0, verifyToken_1.default)(req.cookies.refreshToken);
    if (data) {
        refreshTokenSession_1.default
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
exports.default = deleteToken;
//# sourceMappingURL=deleteToken.js.map