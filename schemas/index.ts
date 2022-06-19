import mongoose, { ConnectOptions } from "mongoose";
import { config } from "dotenv";
// import ChatLog from "./chat_log";
// import User from "./user";
// import ContryPerVisitor from "./country_per_visitor";
// import ChatRoom from "./chat_room";

config();

const connect: () => void = () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }
};

mongoose.connect(
  process.env.DB_HOST!,
  {
    dbName: "the_forest",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions,
  (err) => {
    if (err) {
      console.log("몽고디비 연결 에러 ", err);
    } else {
      console.log("몽고디비 연결 성공");
    }
  }
);

mongoose.connection.on("error", (err) => {
  console.error("몽고디비 연결 에러", err);
});
mongoose.connection.on("disconnected", () => {
  console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
  connect();
});

export default connect;
