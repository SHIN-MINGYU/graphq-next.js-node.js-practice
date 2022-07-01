import { getItemToMongo } from "../action";
import ChatLogs from "@schemas/chat_log";

export const ChatLog = (_: any, { chat_room }: { chat_room: string }) => {
  return getItemToMongo(ChatLogs, {
    chat_room,
    $orderby: { createAt: -1 },
  });
};
