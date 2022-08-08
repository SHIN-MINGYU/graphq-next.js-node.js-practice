"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const combineItems_1 = __importDefault(require("../combineItems"));
const chat_1 = __importDefault(require("./chat"));
const rootSubscribe = (0, combineItems_1.default)(chat_1.default);
exports.default = rootSubscribe;
//# sourceMappingURL=index.js.map