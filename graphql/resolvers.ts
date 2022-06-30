// import { getById, addPerson, deletePerson } from "./action";
// import { people } from "./data";
import ChatLogs from "../schemas/chat_log";
import { getItemToMongo } from "./action";
import { PubSub, withFilter } from "graphql-subscriptions";
import ChatRooms from "../schemas/chat_room";

export const pubsub = new PubSub();

const CHECK_CHAT: string = "CHECK_CHAT";
const resolvers = {
  Query: {
    ChatLog: (_: any, { chat_room }: { chat_room: string }) => {
      return getItemToMongo(ChatLogs, {
        chat_room,
        $orderby: { createAt: -1 },
      });
    },
  },
  Mutation: {
    SendChat: (
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
    },
    SearchRoom: async (
      _: any,
      { uid, type }: { uid: string; type: string }
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
    },
    LeaveRoom: async (
      _: any,
      { chat_room, uid }: { chat_room: string; uid: string }
    ) => {
      console.log("this");
      pubsub.publish(CHECK_CHAT, {
        CheckChat: {
          leave: true,
        },
      });
      await ChatRooms.deleteOne({ _id: chat_room });

      return true;
    },
  },
  Subscription: {
    CheckChat: {
      subscribe: withFilter(
        () => pubsub!.asyncIterator(["CHECK_CHAT"]),
        (payload, variables) => {
          console.log("payload : ", payload);
          console.log("variables : ", variables);
          if (payload.CheckChat!.leave) {
            return true;
          }
          return payload.CheckChat.chat_room === variables.chat_room;
        }
      ),
    },
  },
};

export default resolvers;
