import ChatRooms from "../../schemas/chat_room";
import ChatLogs from "../../schemas/chat_log";
import Users from "../../schemas/user";
import searchRoom from "../../util/searchRoom";
import { ObjectId } from "mongoose";
import { contextType } from "../../type/contextType";
import authErrorCheck from "../../util/error/authError";

//=============================================================================

type chatLogArgs = {
  chat_room: string;
};

const ChatLog = async (_: any, args: chatLogArgs) => {
  const { chat_room } = args;
  const data = await ChatLogs.find({
    chat_room,
  })
    .populate("uid", ["imgPath", "nickname"])
    .sort({ createAt: -1 });
  return data;
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
  authErrorCheck(context);
  const { uid, category, type } = args;
  const findChatRoom = await ChatRooms.findOne({
    category,
    type,
    uid: {
      $size: 2,
      $all: [uid, context.req.user.uid],
    },
  });
  if (!findChatRoom) {
    const createRoom = await ChatRooms.create({
      category,
      type,
      uid: [uid, context.req.user.uid],
    });
    return createRoom._id;
  }

  return findChatRoom._id;
};

//=============================================================================

const GetPrivateRoomList = async (
  _: unknown,
  __: unknown,
  context: contextType
) => {
  authErrorCheck(context);

  const result: any = [];

  const chatRooms = await ChatRooms.find({
    category: "private",
    uid: { $all: [context.req.user.uid] },
  });

  for (let chatRoom of chatRooms) {
    const chatLog = await ChatLogs.findOne({
      chat_room: chatRoom._id,
    }).sort({ createAt: -1 });
    const user = await Users.find({
      _id: { $in: chatRoom.uid?.filter((el) => el != context.req.user.uid) },
    });
    result.push({
      chatRoom: chatRoom._id,
      createAt: chatLog?.createAt,
      lastChat: chatLog?.log,
      user: user,
    });
  }
  return result;
};

//=============================================================================

export default {
  ChatLog,
  SearchRandomRoom,
  GetPrivateRoom,
  GetPrivateRoomList,
};
