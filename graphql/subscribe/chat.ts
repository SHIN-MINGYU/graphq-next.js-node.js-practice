import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../pubsub";

//=============================================================================

const CheckChat = {
  subscribe: withFilter(
    () => pubsub!.asyncIterator(["CHECK_CHAT"]),
    (payload, variables) => {
      console.log("payload : ", payload, "variabales : ", variables);
      return payload.CheckChat.chat_room === variables.chat_room;
    }
  ),
};

//=============================================================================

const EnterRoom = {
  subscribe: withFilter(
    () => pubsub!.asyncIterator(["ENTER_ROOM"]),
    (payload, variables) => {
      console.log(payload.EnterRoom.chat_room === variables.chat_room);
      return payload.EnterRoom.chat_room === variables.chat_room;
    }
  ),
};

//=============================================================================

const CheckRoom = {
  subscribe: () => pubsub!.asyncIterator(["CHECK_ROOM"]),
};

//=============================================================================

export default { CheckChat, CheckRoom, EnterRoom };
