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
const pubsub_1 = require("../pubsub");
const CHECK_CHAT = "CHECK_CHAT";
const LEAVE_ROOM = "LEAVE_ROOM";
const ENTER_ROOM = "ENTER_ROOM";
const SendChat = (_, args, context) => {
    //subscribe publish check_chat
    // @ts-ignore
    pubsub_1.pubsub.publish(CHECK_CHAT, {
        CheckChat: Object.assign({}, args),
    });
    chat_log_1.default.create(Object.assign({}, args));
    return args.log;
};
//=============================================================================
const EnterRoom = (_, args) => {
    const { chat_room, uid, userType } = args;
    const userInfo = JSON.parse(args.userInfo);
    pubsub_1.pubsub.publish(ENTER_ROOM, {
        EnterRoom: {
            chat_room,
            uid,
            userType,
            userInfo,
        },
    });
    return true;
};
//LeaveRoom
const LeaveRoom = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { chat_room, chat_type, nickname, uid } = args;
    //subscribe publish LEAVE_ROOM
    pubsub_1.pubsub.publish(LEAVE_ROOM, {
        LeaveRoom: {
            chat_room,
            leave: true,
            nickname,
            uid,
        },
    });
    if (chat_type === "oneonone")
        yield chat_room_1.default.deleteOne({ _id: chat_room });
    else if (chat_type === "group") {
        yield chat_room_1.default.findOneAndUpdate({ _id: chat_room }, {
            $pullAll: {
                uid: [uid],
            },
        });
    }
    return true;
});
//=============================================================================
exports.default = { SendChat, LeaveRoom, EnterRoom };
//# sourceMappingURL=chat.js.map