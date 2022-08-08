import { contextType } from "type/contextType";

export default function authErrorCheck(context: contextType) {
  if (typeof context.deserializeUser !== "string") {
    if (context.deserializeUser?.authError) {
      throw context.deserializeUser.authError;
    } else {
      throw new Error("GUEST");
    }
  }
  return;
}
