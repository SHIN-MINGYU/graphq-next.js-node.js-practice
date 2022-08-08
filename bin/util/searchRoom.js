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
const chat_room_1 = __importDefault(require("schemas/chat_room"));
const searchRoom = (type, category) => __awaiter(void 0, void 0, void 0, function* () {
    const args = { type, category };
    let findChatRoom;
    if (type === "oneonone") {
        findChatRoom = yield chat_room_1.default.find(Object.assign(Object.assign({}, args), { "uid.1": {
                $exists: false,
            } }));
    }
    else {
        findChatRoom = yield chat_room_1.default.find(Object.assign(Object.assign({}, args), { "uid.3": {
                $exists: false,
            } }));
    }
    return findChatRoom;
});
exports.default = searchRoom;
//# sourceMappingURL=searchRoom.js.map