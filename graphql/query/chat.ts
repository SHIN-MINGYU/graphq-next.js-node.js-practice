import { getItemsToMongo } from "../action";
import ChatLogs from "@schemas/chat_log";

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

export default { ChatLog };
