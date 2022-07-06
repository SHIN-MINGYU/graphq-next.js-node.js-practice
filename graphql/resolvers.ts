// import { getById, addPerson, deletePerson } from "./action";
// import { people } from "./data";

import { LeaveRoom, SearchRoom, SendChat } from "./mutation/chat";
import { ChatLog } from "./query/chat";
import { CheckChat, CheckRoom } from "./subscribe/chat";
import { SignUp, LogOut } from "./mutation/user";
import { Login, UserInfo } from "./query/user";
import { restoreAccessToken } from "./mutation/token";

const resolvers = {
  Query: {
    ChatLog,
    Login,
    UserInfo,
  },
  Mutation: {
    SendChat,
    SearchRoom,
    LeaveRoom,
    SignUp,
    LogOut,
    restoreAccessToken,
  },
  Subscription: {
    CheckChat,
    CheckRoom,
  },
};

export default resolvers;
