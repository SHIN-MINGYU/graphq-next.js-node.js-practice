import ChatRooms from "@schemas/chat_room";
import ChatLogs from "@schemas/chat_log";
import { pubsub } from "../pubsub";
import { ObjectId } from "mongoose";
import { contextType } from "@type/contextType";
import searchRoom from "../../util/searchRoom";

const CHECK_CHAT: string = "CHECK_CHAT";
const LEAVE_ROOM: string = "LEAVE_ROOM";
const ENTER_ROOM: string = "ENTER_ROOM";

//=============================================================================

// Send Chat Mutation
type chatLogArgs = {
  chat_room: string;
  uid: string;
  log: string;
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

//searchRoom
type searchRoomArgs = {
  uid?: ObjectId;
  type: string;
  category: string;
};

//=============================================================================

const SearchRoom = async (_: any, args: searchRoomArgs) => {
  const { uid, type, category } = args;

  const findChatRoom = await searchRoom(type, category);

  if (findChatRoom.length === 0) {
    const createRoom = await ChatRooms.create({
      category,
      type,
      uid: [uid],
    });
    return createRoom._id;
  }

  const roomLen = findChatRoom.length;

  const SELECTED_NUM = Math.floor(Math.random() * roomLen);

  const _id = findChatRoom[SELECTED_NUM]._id;

  await ChatRooms.updateOne({ _id }, { $push: { uid } }).orFail();

  return _id;
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
  chat_type : string;
  nickname: string;
  uid : ObjectId;
};

//LeaveRoom
const LeaveRoom = async (_: any, args: LeaveRoomArgs) => {
  const { chat_room, chat_type ,nickname, uid } = args;
  //subscribe publish LEAVE_ROOM
  pubsub.publish(LEAVE_ROOM, {
    LeaveRoom: {
      chat_room,
      leave: true,
      nickname,
      uid
    },
  });
  if(chat_type === "oneonone") await ChatRooms.deleteOne({ _id: chat_room });
  else if(chat_type === "group"){
/*     await ChatRooms.findOneAndUpdate(
      {_id : chat_room},
      {
      $pullAll : {
        uid : [uid]
      }
    }) */
  }
  return true;
};

//=============================================================================

export default { SendChat, SearchRoom, LeaveRoom, EnterRoom };
