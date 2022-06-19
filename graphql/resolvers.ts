// import { getById, addPerson, deletePerson } from "./action";
// import { people } from "./data";

import { ObjectId } from "mongoose";
import ChatLogs from "../schemas/chat_log";
import { getItemToMongo } from "./action";

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
      }: { chat_room: String; uid: String; log: String; createAt: Date }
    ) => {
      ChatLogs.create({
        chat_room: chat_room,
        uid: uid,
        log: log,
        createAt: createAt,
      });
      return true;
    },
  },
};

export default resolvers;
