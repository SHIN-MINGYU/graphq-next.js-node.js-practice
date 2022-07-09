import combineItems from "../combineItems";
import chat from "./chat";
import token from "./token";
import user from "./user";

const rootMutation = combineItems(chat, token, user);

export default rootMutation;
