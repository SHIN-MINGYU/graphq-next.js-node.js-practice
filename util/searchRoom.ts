import ChatRooms from "../schemas/chat_room";

const searchRoom = async (type: string, category: string) => {
  const args = { type, category };
  const MAX_NUM = type == "oneonone" ? 2 : 4;
  console.log(MAX_NUM)
  const findChatRoom = await ChatRooms.find({
    ...args,
    "uid.1" : {
      "$exists" : false
    }
  });
  return findChatRoom;
};

export default searchRoom;
