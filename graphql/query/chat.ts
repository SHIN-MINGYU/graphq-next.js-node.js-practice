import { getItemsToMongo } from "../action";
import ChatRooms from "@schemas/chat_room";
import ChatLogs from "@schemas/chat_log";
import searchRoom from "../../util/searchRoom";
import { ObjectId } from "mongoose";
import { contextType } from "@type/contextType";

//=============================================================================

type chatLogArgs = {
  chat_room: string;
};

const ChatLog = (_: any, args: chatLogArgs) => {
  const { chat_room } = args;
  return getItemsToMongo(ChatLogs, {
    chat_room,
    $orderby: { createAt: -1 },
  });
};

//=============================================================================

//searchRoom
type searchRoomArgs = {
  uid?: ObjectId;
  type: "oneonone" | "group";
  category: "public";
};

const SearchRandomRoom = async (_: any, args: searchRoomArgs) => {
  // public room
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

type getRoomIdArgs = {
  uid: ObjectId;
  type: "oneonone" | "group";
  category: "private";
};

const GetPrivateRoom = async (
  _: any,
  args: getRoomIdArgs,
  context: contextType
) => {
  const { uid, category, type } = args;
  const findChatRoom = await ChatRooms.findOne({
    category,
    type,
    uid: {
      $size: 2,
      // @ts-ignore
      $all: [uid, context.req.user.uid],
    },
  });
  if (!findChatRoom) {
    const createRoom = await ChatRooms.create({
      category,
      type,
      // @ts-ignore
      uid: [uid, context.req.user.uid],
    });
    return createRoom._id;
  }

  return findChatRoom._id;
};

//=============================================================================

export default { ChatLog, SearchRandomRoom, GetPrivateRoom };
