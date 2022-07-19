import ChatRooms from "../schemas/chat_room";

const searchRoom = async (type: string, category: string) => {
  const args = { type, category };
  const MAX_NUM = category == "oneonone" ? 2 : 4;
  const findChatRoom = await ChatRooms.find({
    ...args,
    where: `this.uid.length < ${MAX_NUM}`,
  });
  return findChatRoom;
};

export default searchRoom;
