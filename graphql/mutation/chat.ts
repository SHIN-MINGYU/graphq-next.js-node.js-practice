import ChatRooms from "@schemas/chat_room";
import ChatLogs from "@schemas/chat_log";
import { pubsub } from "../resolvers";
import { ObjectId } from "mongoose";

const CHECK_CHAT: string = "CHECK_CHAT";
const CHECK_ROOM: string = "CHECK_ROOM";

export const SendChat = (
  _: any,
  {
    chat_room,
    uid,
    log,
    createAt,
  }: { chat_room: string; uid: string; log: string; createAt: Date }
) => {
  pubsub.publish(CHECK_CHAT, {
    CheckChat: {
      chat_room,
      log,
      uid,
      createAt,
    },
  });
  ChatLogs.create({
    chat_room: chat_room,
    uid: uid,
    log: log,
    createAt: createAt,
  });
  return log;
};

export const SearchRoom = async (
  _: any,
  { uid, type }: { uid: ObjectId; type: string }
) => {
  const findChatRoom = await ChatRooms.find({
    type,
    $where: "this.uid.length < 2",
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

export const LeaveRoom = async (
  _: any,
  { chat_room, uid }: { chat_room: string; uid: string }
) => {
  pubsub.publish(CHECK_ROOM, {
    CheckRoom: { leave: true },
  });
  await ChatRooms.deleteOne({ _id: chat_room });

  return true;
};
