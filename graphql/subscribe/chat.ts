import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../pubsub";

//=============================================================================

const CheckChat = {
  subscribe: withFilter(
    () => pubsub!.asyncIterator(["CHECK_CHAT"]),
    ({ CheckChat }, variables) => {
      return CheckChat.chat_room === variables.chat_room;
    }
  ),
};

//=============================================================================

const EnterRoom = {
  subscribe: withFilter(
    () => pubsub!.asyncIterator(["ENTER_ROOM"]),
    (payload, variables) => {
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

const GetCall = {
  subscribe: withFilter(
    () => pubsub!.asyncIterator(["SEND_CALL"]),
    (payload, variables) => {
      return payload.GetCall.to === variables.uid;
    }
  ),
};

//=============================================================================

const GetOffCall = {
  subscribe: withFilter(
    () => pubsub!.asyncIterator(["GET_OFF_CALL"]),
    (payload, variables) => {
      return payload.GetOffCall.chat_room === variables.chat_room;
    }
  ),
};

//=============================================================================

export default { CheckChat, LeaveRoom, EnterRoom, GetCall, GetOffCall };
