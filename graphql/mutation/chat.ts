import { pubsub } from "../resolvers";
import { SEND_LOG } from "../subscription/type";
import ChatLogs from "../../schemas/chat_log";
export const SendChat = {
  SendChat: (
    _: any,
    {
      chat_room,
      uid,
      log,
      createAt,
    }: { chat_room: string; uid: string; log: string; createAt: Date }
  ) => {
    pubsub.publish(SEND_LOG, {
      Logging: {
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
};
