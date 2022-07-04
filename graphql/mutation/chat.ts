import ChatRooms from "@schemas/chat_room";
import ChatLogs from "@schemas/chat_log";
import { pubsub } from "../resolvers";
import { ObjectId } from "mongoose";

const CHECK_CHAT: string = "CHECK_CHAT";
const CHECK_ROOM: string = "CHECK_ROOM";

// Send Chat Mutation
type chatLogArgs = {
  chat_room: string;
  uid: string;
  log: string;
  username: string;
  createAt: Date;
};

export const SendChat = (_: any, args: chatLogArgs, context: any) => {
  //subscribe publish check_chat
  pubsub.publish(CHECK_CHAT, {
    CheckChat: { ...args },
  });
  ChatLogs.create({ ...args });
  return args.log;
};

//searchRoom
type searchRoomArgs = {
  uid: ObjectId;
  type: string;
};

export const SearchRoom = async (_: any, args: searchRoomArgs) => {
  const { uid, type } = args;

  const findChatRoom = await ChatRooms.find({
    type,
    where: "this.uid.length < 2",
  });

  if (findChatRoom.length === 0) {
    const createRoom = await ChatRooms.create({
      type: type,
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

//LeaveRoom
export const LeaveRoom = async (
  _: any,
  { chat_room, uid }: { chat_room: string; uid: string }
) => {
  //subscribe publish check_room
  pubsub.publish(CHECK_ROOM, {
    CheckRoom: { leave: true },
  });
  await ChatRooms.deleteOne({ _id: chat_room });

  return true;
};
