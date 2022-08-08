"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
const chat_room_schema = new mongoose_1.Schema({
    type: String,
    category: String,
    uid: [ObjectId /* { type: ObjectId, ref: "user", required: "true" } */],
});
exports.default = (0, mongoose_1.model)("chat_room", chat_room_schema);
//# sourceMappingURL=chat_room.js.map