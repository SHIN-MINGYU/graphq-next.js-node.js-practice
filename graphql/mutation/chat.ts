import ChatRooms from "@schemas/chat_room";
import ChatLogs from "@schemas/chat_log";
import { pubsub } from "../pubsub";
import { ObjectId } from "mongoose";
import { contextType } from "@type/contextType";

const CHECK_CHAT: string = "CHECK_CHAT";
const LEAVE_ROOM: string = "LEAVE_ROOM";
const ENTER_ROOM: string = "ENTER_ROOM";

//=============================================================================

// Send Chat Mutation
type chatLogArgs = {
  chat_room: ObjectId;
  uid: ObjectId;
  log: string;
  imgPath: string;
  nickname: string;
  createAt: Date;
};

const SendChat = (_: any, args: chatLogArgs, context: contextType) => {
  //subscribe publish check_chat
  // @ts-ignore

  pubsub.publish(CHECK_CHAT, {
    CheckChat: { ...args },
  });
  ChatLogs.create({ ...args });
  return args.log;
};

//=============================================================================

const EnterRoom = (_: any, args: any) => {
  const { chat_room, uid, userType } = args;
  const userInfo = JSON.parse(args.userInfo);
  pubsub.publish(ENTER_ROOM, {
    EnterRoom: {
      chat_room,
      uid,
      userType,
      userInfo,
    },
  });
  return true;
};

//=============================================================================
type LeaveRoomArgs = {
  chat_room: ObjectId;
  chat_type: string;
  nickname: string;
  uid: ObjectId;
};

//LeaveRoom
const LeaveRoom = async (_: any, args: LeaveRoomArgs) => {
  const { chat_room, chat_type, nickname, uid } = args;
  //subscribe publish LEAVE_ROOM
  pubsub.publish(LEAVE_ROOM, {
    LeaveRoom: {
      chat_room,
      leave: true,
      nickname,
      uid,
    },
  });
  if (chat_type === "oneonone") await ChatRooms.deleteOne({ _id: chat_room });
  else if (chat_type === "group") {
    await ChatRooms.findOneAndUpdate(
      { _id: chat_room },
      {
        $pullAll: {
          uid: [uid],
        },
      }
    );
  }
  return true;
};

//=============================================================================

export default { SendChat, LeaveRoom, EnterRoom };
