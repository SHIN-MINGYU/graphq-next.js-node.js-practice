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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deleteToken_1 = __importDefault(require("jwt/deleteToken"));
const user_1 = __importDefault(require("schemas/user"));
const createHashedPassword_1 = __importDefault(require("util/user/createHashedPassword"));
const authError_1 = __importDefault(require("util/error/authError"));
const mailer_1 = __importDefault(require("util/mailer"));
const SignUp = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = args, info = __rest(args, ["password"]);
    const hashedPassword = yield (0, createHashedPassword_1.default)(password);
    if (hashedPassword)
        yield user_1.default.create(Object.assign({ password: hashedPassword.password, salt: hashedPassword.salt }, info));
    else
        return false;
    return true;
});
const SendMail = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = args;
    const verifyCode = String(Math.floor(1000 + Math.random() * 9000));
    const emailRe = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (!emailRe.test(email)) {
        throw new Error("invaild email");
    }
    try {
        yield mailer_1.default.sendMail({
            from: "smg20004@naver.com",
            to: email,
            subject: `[${verifyCode}] verification Code is successfully send`,
            html: `${verifyCode}`,
        });
        return verifyCode;
    }
    catch (err) {
        console.log(err);
    }
});
//=============================================================================
const LogOut = (_, {}, context) => __awaiter(void 0, void 0, void 0, function* () {
    const { req, res } = context;
    (0, deleteToken_1.default)(req, res);
    return true;
});
const UpdateUserInfo = (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    (0, authError_1.default)(context);
    const { nickname, gender, description } = args;
    yield user_1.default.updateOne(
    // @ts-ignore
    { _id: context.req.user.uid }, {
        nickname,
        gender,
        description,
    });
    return true;
});
const SendFollow = (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    (0, authError_1.default)(context);
    const { uid } = args;
    // @ts-ignore
    yield user_1.default.findOneAndUpdate({ _id: uid }, 
    // @ts-ignore
    { $push: { follower: context.req.user.uid } });
    yield user_1.default.findOneAndUpdate(
    // @ts-ignore
    { _id: context.req.user.uid }, { $push: { following: uid } });
    return true;
});
const SendUnFollow = (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    (0, authError_1.default)(context);
    const { uid } = args;
    // @ts-ignore
    yield user_1.default.findOneAndUpdate({ _id: uid }, 
    // @ts-ignore
    { $pullAll: { follower: [context.req.user.uid] } });
    yield user_1.default.findOneAndUpdate(
    // @ts-ignore
    { _id: context.req.user.uid }, { $pullAll: { following: [uid] } });
    return true;
});
//=============================================================================
const UserLogin = (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
    (0, authError_1.default)(context);
    yield user_1.default.updateOne({ _id: context.req.user.uid }, { status: true });
    return true;
});
//=============================================================================
const UserLogout = (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
    (0, authError_1.default)(context);
    yield user_1.default.updateOne({ _id: context.req.user.uid }, { status: false });
    return true;
});
//=============================================================================
exports.default = {
    SignUp,
    SendMail,
    LogOut,
    UpdateUserInfo,
    SendFollow,
    SendUnFollow,
    UserLogin,
    UserLogout,
};
//# sourceMappingURL=user.js.map