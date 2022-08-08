"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verifyToken_1 = __importDefault(require("@jwt/verifyToken"));
const apollo_server_core_1 = require("apollo-server-core");
function deserializeUser(req) {
    const { refreshToken } = req.cookies;
    const accessToken = req.headers.authorization;
    const payload = (0, verifyToken_1.default)(accessToken);
    if (!payload && refreshToken) {
        return {
            authError: new apollo_server_core_1.AuthenticationError("Auth Error : need accessToken"),
        };
    }
    if (!payload) {
        return;
    }
    // @ts-ignore
    req.user = payload.userInfo;
    return "true";
}
exports.default = deserializeUser;
//# sourceMappingURL=deserializeUser.js.map