import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../pubsub";

//=============================================================================

const CheckChat = {
  subscribe: withFilter(
    () => pubsub!.asyncIterator(["CHECK_CHAT"]),
    ({ CheckChat }, variables) => {
      console.log("payload : ", CheckChat, "variabales : ", variables);
      return CheckChat.chat_room === variables.chat_room;
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

const LeaveRoom = {
  subscribe: withFilter(
    () => pubsub!.asyncIterator(["LEAVE_ROOM"]),
    (payload, variables) => {
      return payload.LeaveRoom.chat_room === variables.chat_room;
    }
  ),
};

//=============================================================================

export default { CheckChat, LeaveRoom, EnterRoom };
