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
const crypto_1 = __importDefault(require("crypto"));
const refreshTokenSession_1 = __importDefault(require("schemas/refreshTokenSession"));
const createSession = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, uid } = args;
    const sessionId = crypto_1.default
        .createHash("sha512")
        .update(username + process.env.JWT_SECRET_KEY + uid)
        .digest("hex");
    if (!(yield refreshTokenSession_1.default.findOne({ _id: sessionId }))) {
        refreshTokenSession_1.default.create({ _id: sessionId, values: { username, uid } });
    }
    return sessionId;
});
exports.default = createSession;
//# sourceMappingURL=createSession.js.map