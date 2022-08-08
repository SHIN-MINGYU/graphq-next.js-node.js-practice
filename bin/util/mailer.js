"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transport = nodemailer_1.default.createTransport({
    service: "naver",
    host: "smg20004@naver.com",
    port: 465,
    secrue: true,
    auth: {
        user: "smg20004@naver.com",
        pass: process.env.MY_PASSWORD,
    },
});
exports.default = transport;
//# sourceMappingURL=mailer.js.map