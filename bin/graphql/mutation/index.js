"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const combineItems_1 = __importDefault(require("../combineItems"));
const chat_1 = __importDefault(require("./chat"));
const token_1 = __importDefault(require("./token"));
const user_1 = __importDefault(require("./user"));
const rootMutation = (0, combineItems_1.default)(chat_1.default, token_1.default, user_1.default);
exports.default = rootMutation;
//# sourceMappingURL=index.js.map