// import { getById, addPerson, deletePerson } from "./action";
// import { people } from "./data";
import ChatLogs from "../schemas/chat_log";
import { getItemToMongo } from "./action";
import { PubSub, withFilter } from "graphql-subscriptions";
import ChatRooms from "../schemas/chat_room";

export const pubsub = new PubSub();

const SEND_CHAT: string = "SEND_CHAT";
const resolvers = {
  Query: {
    ChatLog: (_: any, { chat_room }: { chat_room: string }) => {
      return getItemToMongo(ChatLogs, { chat_room });
    },
    SearchRoom: () => {
      return getItemToMongo(ChatRooms, {
        where: "this.uid.length <2",
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
      pubsub.publish(SEND_CHAT, {
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
    CreateRoom: (_: any, { uid, type }: { uid: string; type: string }) => {
      ChatRooms.create({ uid: [uid], type: type });
      return true;
    },
  },
  Subscription: {
    CheckChat: {
      subscribe: withFilter(
        (chat_room: string) => {
          return pubsub!.asyncIterator(["SEND_CHAT"]);
        },
        (payload, variables) => {
          console.log(payload), console.log(variables);
          return true;
        }
      ),
    },
  },
};

export default resolvers;
