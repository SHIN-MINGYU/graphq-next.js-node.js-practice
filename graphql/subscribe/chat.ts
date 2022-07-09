import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../pubsub";

const CheckChat = {
  subscribe: withFilter(
    () => pubsub!.asyncIterator(["CHECK_CHAT"]),
    (payload, variables) => {
      console.log("payload : ", payload, "variabales : ", variables);
      return payload.CheckChat.chat_room === variables.chat_room;
    }
  ),
};

const CheckRoom = {
  subscribe: () => pubsub!.asyncIterator(["CHECK_ROOM"]),
};

export default { CheckChat, CheckRoom };
