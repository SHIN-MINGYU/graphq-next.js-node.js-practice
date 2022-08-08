"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
const refresh_tokens_schema = new mongoose_1.Schema({
    _id: String,
    values: {
        uid: mongodb_1.ObjectId,
        username: String,
    },
});
exports.default = (0, mongoose_1.model)("refresh_tokens", refresh_tokens_schema);
//# sourceMappingURL=refreshTokenSession.js.map