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
const user_1 = __importDefault(require("schemas/user"));
const createToken_1 = __importDefault(require("jwt/createToken"));
const createSession_1 = __importDefault(require("session/createSession"));
const authError_1 = __importDefault(require("util/error/authError"));
const createHashedPassword_1 = __importDefault(require("util/user/createHashedPassword"));
const Login = (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = args;
    const user = yield user_1.default.findOne({ username });
    const hashedValue = yield (0, createHashedPassword_1.default)(password, user === null || user === void 0 ? void 0 : user.salt);
    if (user && user.password === hashedValue.password) {
        // create session
        const sessionId = yield (0, createSession_1.default)({ username, uid: user._id });
        // create && set access && refresh Tokens
        const accessToken = (0, createToken_1.default)({ uid: user._id, username, sessionId }, "5m");
        const refreshToken = (0, createToken_1.default)({ sessionId }, "1y");
        context.res.cookie("refreshToken", refreshToken, {
            maxAge: 3.154e10,
            httpOnly: true,
        });
        //return accessToken for remain in localStorage
        return accessToken;
    }
    else {
        return new Error("who are you?");
    }
});
//=============================================================================
const UserInfo = (_, {}, context) => __awaiter(void 0, void 0, void 0, function* () {
    // if deserializeUser's return value have authError
    // throw error
    (0, authError_1.default)(context);
    // @ts-ignore
    const user = yield user_1.default.findOne({ _id: context.req.user.uid });
    return user;
});
const SearchUser = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = args;
    if (yield user_1.default.findOne({ username })) {
        return true;
    }
    return false;
});
//=============================================================================
const GetF4F = (_, {}, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (0, authError_1.default)(context);
    // @ts-ignore
    const user = yield user_1.default.findOne({ _id: context.req.user.uid });
    const F4F = (_a = user === null || user === void 0 ? void 0 : user.follower) === null || _a === void 0 ? void 0 : _a.filter((item) => { var _a; return (_a = user.following) === null || _a === void 0 ? void 0 : _a.includes(item); });
    const F4FUserInfo = yield user_1.default.find({ _id: { $in: F4F } });
    return F4FUserInfo;
});
//=============================================================================
const GetFollowerNotF4F = (_, {}, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    (0, authError_1.default)(context);
    const user = yield user_1.default.findOne({ _id: context.req.user.uid });
    const NotF4F = (_b = user === null || user === void 0 ? void 0 : user.follower) === null || _b === void 0 ? void 0 : _b.filter((item) => { var _a; return !((_a = user.following) === null || _a === void 0 ? void 0 : _a.includes(item)); });
    const NotF4FUserInfo = yield user_1.default.find({ _id: { $in: NotF4F } });
    return NotF4FUserInfo;
});
//=============================================================================
exports.default = {
    Login,
    UserInfo,
    SearchUser,
    GetF4F,
    GetFollowerNotF4F,
};
//# sourceMappingURL=user.js.map