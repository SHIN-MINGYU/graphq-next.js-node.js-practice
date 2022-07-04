import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../resolvers";

export const CheckChat = {
  subscribe: withFilter(
    () => pubsub!.asyncIterator(["CHECK_CHAT"]),
    (payload, variables) => {
      console.log("payload : ", payload, "variabales : ", variables);
      return payload.CheckChat.chat_room === variables.chat_room;
    }
  ),
};

export const CheckRoom = {
  subscribe: () => pubsub!.asyncIterator(["CHECK_ROOM"]),
};
