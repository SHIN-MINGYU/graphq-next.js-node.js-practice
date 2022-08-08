"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (token) => {
    try {
        if (token === undefined) {
            throw new Error("authorization can't find");
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY || "SECRET_KEY");
        return decoded;
    }
    catch (err) {
        return null;
    }
};
exports.default = verifyToken;
//# sourceMappingURL=verifyToken.js.map