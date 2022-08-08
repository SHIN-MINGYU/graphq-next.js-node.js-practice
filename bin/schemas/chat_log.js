"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
const chat_logs_schema = new mongoose_1.Schema({
    chat_room: { type: ObjectId, ref: "chat_room", required: true },
    uid: { type: ObjectId, ref: "user", required: true },
    username: String,
    log: String,
    createAt: { type: Date, default: mongoose_1.now },
});
exports.default = (0, mongoose_1.model)("chat_logs", chat_logs_schema);
//# sourceMappingURL=chat_log.js.map