import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "naver",
  host: "smg20004@naver.com",
  port: 465,
  secrue: true,
  auth: {
    user: "smg20004@naver.com",
    pass: "@tlsalsrb123",
  },
} as any);
export default transport;
