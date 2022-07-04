// import { getById, addPerson, deletePerson } from "./action";
// import { people } from "./data";
import { PubSub } from "graphql-subscriptions";
import { LeaveRoom, SearchRoom, SendChat } from "./mutation/chat";
import { ChatLog } from "./query/chat";
import { CheckChat, CheckRoom } from "./subscribe/chat";
import { SignUp, LogOut } from "./mutation/user";
import { Login } from "./query/user";
export const pubsub = new PubSub();

const resolvers = {
  Query: {
    ChatLog,
    Login,
  },
  Mutation: {
    SendChat,
    SearchRoom,
    LeaveRoom,
    SignUp,
    LogOut,
  },
  Subscription: {
    CheckChat,
    CheckRoom,
  },
};

export default resolvers;
