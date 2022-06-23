import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../resolvers";

export const CheckChat = {
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
};
