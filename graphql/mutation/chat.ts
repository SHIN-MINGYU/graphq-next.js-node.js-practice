import ChatRooms from "../../schemas/chat_room";
import ChatLogs from "../../schemas/chat_log";
import { pubsub } from "../pubsub";
import { ObjectId } from "mongoose";
import { contextType } from "../../type/contextType";
import authErrorCheck from "../../util/error/authError";
import User from "../../schemas/user";

const CHECK_CHAT: string = "CHECK_CHAT";
const LEAVE_ROOM: string = "LEAVE_ROOM";
const ENTER_ROOM: string = "ENTER_ROOM";
const SEND_CALL: string = "SEND_CALL";
const GET_OFF_CALL: string = "GET_OFF_CALL";

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

type sendCallArgs = {
  uid: string;
};

const SendCall = async (
  _: any,
  { uid }: sendCallArgs,
  context: contextType
) => {
  authErrorCheck(context);

  //video chat room create
  const chatroom = await ChatRooms.create({
    category: "private",
    type: "video",
    uid: [context.req.user.uid, uid],
  });
  //send subscribe action to the user

  const user = await User.findOne({ _id: context.req.user.uid });
  setTimeout(
    () =>
      pubsub.publish(SEND_CALL, {
        GetCall: {
          to: uid,
          from: user?.nickname,
          chatRoom: chatroom._id,
        },
      }),
    2000
  );
  return chatroom._id;
};

//=============================================================================

type GetOffCall = {
  chat_room: ObjectId;
};

const GetOffCall = (_: any, args: GetOffCall, context: contextType) => {
  console.log(args);
  pubsub.publish(GET_OFF_CALL, {
    GetOffCall: {
      chat_room: args.chat_room,
      leave: true,
    },
  });
  return true;
};

//=============================================================================

export default { SendChat, LeaveRoom, EnterRoom, SendCall, GetOffCall };
