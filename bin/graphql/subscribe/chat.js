"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub_1 = require("../pubsub");
//=============================================================================
const CheckChat = {
    subscribe: (0, graphql_subscriptions_1.withFilter)(() => pubsub_1.pubsub.asyncIterator(["CHECK_CHAT"]), ({ CheckChat }, variables) => {
        console.log("payload : ", CheckChat, "variabales : ", variables);
        return CheckChat.chat_room === variables.chat_room;
    }),
};
//=============================================================================
const EnterRoom = {
    subscribe: (0, graphql_subscriptions_1.withFilter)(() => pubsub_1.pubsub.asyncIterator(["ENTER_ROOM"]), (payload, variables) => {
        return payload.EnterRoom.chat_room === variables.chat_room;
    }),
};
//=============================================================================
const LeaveRoom = {
    subscribe: (0, graphql_subscriptions_1.withFilter)(() => pubsub_1.pubsub.asyncIterator(["LEAVE_ROOM"]), (payload, variables) => {
        return payload.LeaveRoom.chat_room === variables.chat_room;
    }),
};
//=============================================================================
exports.default = { CheckChat, LeaveRoom, EnterRoom };
//# sourceMappingURL=chat.js.map