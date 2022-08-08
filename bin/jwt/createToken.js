"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (userInfo, expiresIn) => {
    const token = jsonwebtoken_1.default.sign({ userInfo }, process.env.JWT_SECRET_KEY || "SECRET_KEY", { expiresIn });
    return token;
};
exports.default = createToken;
//# sourceMappingURL=createToken.js.map