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
const chat_log_1 = __importDefault(require("schemas/chat_log"));
const user_1 = __importDefault(require("schemas/user"));
const searchRoom_1 = __importDefault(require("util/searchRoom"));
const authError_1 = __importDefault(require("util/error/authError"));
const ChatLog = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { chat_room } = args;
    const data = yield chat_log_1.default.find({
        chat_room,
    })
        .populate("uid", ["imgPath", "nickname"])
        .sort({ createAt: -1 });
    return data;
});
const SearchRandomRoom = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    // public room
    const { uid, type, category } = args;
    const findChatRoom = yield (0, searchRoom_1.default)(type, category);
    if (findChatRoom.length === 0) {
        const createRoom = yield chat_room_1.default.create({
            category,
            type,
            uid: [uid],
        });
        return createRoom._id;
    }
    const roomLen = findChatRoom.length;
    const SELECTED_NUM = Math.floor(Math.random() * roomLen);
    const _id = findChatRoom[SELECTED_NUM]._id;
    yield chat_room_1.default.updateOne({ _id }, { $push: { uid } }).orFail();
    return _id;
});
const GetPrivateRoom = (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    (0, authError_1.default)(context);
    const { uid, category, type } = args;
    const findChatRoom = yield chat_room_1.default.findOne({
        category,
        type,
        uid: {
            $size: 2,
            // @ts-ignore
            $all: [uid, context.req.user.uid],
        },
    });
    if (!findChatRoom) {
        const createRoom = yield chat_room_1.default.create({
            category,
            type,
            // @ts-ignore
            uid: [uid, context.req.user.uid],
        });
        return createRoom._id;
    }
    return findChatRoom._id;
});
//=============================================================================
const GetPrivateRoomList = (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (0, authError_1.default)(context);
    const result = [];
    const chatRooms = yield chat_room_1.default.find({
        category: "private",
        // @ts-ignore
        uid: { $all: [context.req.user.uid] },
    });
    for (let chatRoom of chatRooms) {
        const chatLog = yield chat_log_1.default.findOne({
            chat_room: chatRoom._id,
        }).sort({ createAt: -1 });
        const user = yield user_1.default.find({
            // @ts-ignore
            _id: { $in: (_a = chatRoom.uid) === null || _a === void 0 ? void 0 : _a.filter((el) => el != context.req.user.uid) },
        });
        result.push({
            chatRoom: chatRoom._id,
            createAt: chatLog === null || chatLog === void 0 ? void 0 : chatLog.createAt,
            lastChat: chatLog === null || chatLog === void 0 ? void 0 : chatLog.log,
            user: user,
        });
    }
    return result;
});
//=============================================================================
exports.default = {
    ChatLog,
    SearchRandomRoom,
    GetPrivateRoom,
    GetPrivateRoomList,
};
//# sourceMappingURL=chat.js.map