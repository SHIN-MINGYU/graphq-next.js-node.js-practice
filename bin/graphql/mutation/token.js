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
const createToken_1 = __importDefault(require("jwt/createToken"));
const verifyToken_1 = __importDefault(require("jwt/verifyToken"));
const refreshTokenSession_1 = __importDefault(require("schemas/refreshTokenSession"));
//=============================================================================
const restoreAccessToken = (_, {}, context) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = context.req.cookies;
    const refresh = refreshToken ? (0, verifyToken_1.default)(refreshToken) : null;
    const session = yield refreshTokenSession_1.default.findOne({
        //@ts-ignore
        _id: refresh.userInfo.sessionId,
    });
    if (!session)
        throw new Error("session is can't define");
    const { _id, values: { uid, username }, } = session;
    const newAccessToken = (0, createToken_1.default)({
        sessionId: _id,
        uid,
        username,
    }, "5m");
    return newAccessToken;
});
//=============================================================================
exports.default = { restoreAccessToken };
//# sourceMappingURL=token.js.map