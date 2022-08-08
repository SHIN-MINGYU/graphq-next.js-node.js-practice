"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const connect = () => {
    if (process.env.NODE_ENV !== "production") {
        mongoose_1.default.set("debug", true);
    }
};
mongoose_1.default.connect(process.env.DB_HOST, {
    dbName: "the_forest",
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) {
        console.log("몽고디비 연결 에러 ", err);
    }
    else {
        console.log("몽고디비 연결 성공");
    }
});
mongoose_1.default.connection.on("error", (err) => {
    console.error("몽고디비 연결 에러", err);
});
mongoose_1.default.connection.on("disconnected", () => {
    console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
    connect();
});
exports.default = connect;
//# sourceMappingURL=index.js.map