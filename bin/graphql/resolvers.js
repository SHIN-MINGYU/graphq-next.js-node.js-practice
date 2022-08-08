"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mutation_1 = __importDefault(require("./mutation"));
const query_1 = __importDefault(require("./query"));
const subscribe_1 = __importDefault(require("./subscribe"));
const resolvers = {
    Query: Object.assign({}, query_1.default),
    Mutation: Object.assign({}, mutation_1.default),
    Subscription: Object.assign({}, subscribe_1.default),
};
exports.default = resolvers;
//# sourceMappingURL=resolvers.js.map