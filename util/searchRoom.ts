import ChatRooms from "../schemas/chat_room";

const searchRoom = async (type: string, category: string) => {
  const args = { type, category };
  const MAX_Index = type == "oneonone" ? 1 : 3;
  let findChatRoom;
  if (type === "oneonone") {
    findChatRoom = await ChatRooms.find({
      ...args,
      "uid.1": {
        $exists: false,
      },
    });
  } else {
    findChatRoom = await ChatRooms.find({
      ...args,
      "uid.3": {
        $exists: false,
      },
    });
  }
  return findChatRoom;
};

export default searchRoom;
