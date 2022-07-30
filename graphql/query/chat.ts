import { getItemsToMongo } from "../action";
import ChatRooms from "@schemas/chat_room";
import ChatLogs from "@schemas/chat_log";
import searchRoom from "../../util/searchRoom";
import { ObjectId } from "mongoose";

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
  type: string;
  category: string;
};

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

export default { ChatLog, SearchRoom };
