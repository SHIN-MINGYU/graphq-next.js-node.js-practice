import combineItems from "../combineItems";
import chat from "./chat";
import user from "./user";

const rootQuery = combineItems(chat, user);

export default rootQuery;
