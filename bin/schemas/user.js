"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_schema = void 0;
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
exports.user_schema = new mongoose_1.Schema({
    username: String,
    nickname: String,
    email: String,
    salt: String,
    gender: { type: String, default: "none" },
    password: String,
    status: Boolean,
    description: String,
    imgPath: { type: String, default: process.env.MY_HOST + "/img/profile.png" },
    follower: [ObjectId],
    following: [ObjectId],
    createAt: { type: Date, default: Date.now },
});
exports.default = (0, mongoose_1.model)("user", exports.user_schema);
//# sourceMappingURL=user.js.map