// import { getById, addPerson, deletePerson } from "./action";
// import { people } from "./data";
import ChatLogs from "../schemas/chat_log";
import { getItemToMongo } from "./action";
import { PubSub, withFilter } from "graphql-subscriptions";

export const pubsub = new PubSub();

// const resolvers = {
//   Query: {
//     people: () => people,
//     person: (_: any, { id }: { id: number }) => getById(id, people),
//   },
//   Mutation: {
//     addPerson: (
//       _: any,
//       { name, age, gender }: { name: string; age: number; gender: string }
//     ) => addPerson(name, age, gender, people),
//     deletePerson: (_: any, { id }: { id: number }) => deletePerson(id, people),
//   },
// };
// export default resolvers;

const SEND_LOG: string = "SEND_LOG";
const resolvers = {
  Query: {
    ChatLog: () => {
      return getItemToMongo(ChatLogs);
    },
  },
  Mutation: {
    sendLog: (
      _: any,
      {
        chat_room,
        uid,
        log,
        createAt,
      }: { chat_room: string; uid: string; log: string; createAt: Date }
    ) => {
      pubsub.publish(SEND_LOG, {
        Logging: { chat_room, log, uid },
      });
      ChatLogs.create({
        chat_room: chat_room,
        uid: uid,
        log: log,
        createAt: createAt,
      });
      return log;
    },
  },
  Subscription: {
    Logging: {
      subscribe: withFilter(
        (chat_room: string) => {
          console.log(chat_room);
          return pubsub!.asyncIterator(["SEND_LOG"]);
        },
        (payload, variables) => {
          return true;
        }
      ),
    },
  },
};

export default resolvers;
