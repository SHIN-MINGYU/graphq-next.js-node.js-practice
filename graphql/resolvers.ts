// import { getById, addPerson, deletePerson } from "./action";
// import { people } from "./data";
import { PubSub, withFilter } from "graphql-subscriptions";
import { LeaveRoom, SearchRoom, SendChat } from "./mutation/chat";
import { ChatLog } from "./query/chat";
import { CheckChat, CheckRoom } from "./subscribe/chat";

export const pubsub = new PubSub();

const resolvers = {
  Query: {
    ChatLog,
  },
  Mutation: {
    SendChat,
    SearchRoom,
    LeaveRoom,
  },
  Subscription: {
    CheckChat,
    CheckRoom,
  },
};

export default resolvers;
