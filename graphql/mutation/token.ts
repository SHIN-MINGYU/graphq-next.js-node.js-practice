import createToken from "@jwt/createToken";
import verifyToken from "@jwt/verifyToken";
import refreshTokenSession from "@schemas/refreshTokenSession";
import { contextType } from "@type/contextType";
import { tokenSession } from "@type/session";

//=============================================================================

const restoreAccessToken = async (_: any, {}, context: contextType) => {
  const { refreshToken } = context.req.cookies;
  const refresh = refreshToken ? verifyToken(refreshToken) : null;
  const session: tokenSession | null = await refreshTokenSession.findOne({
    //@ts-ignore
    _id: refresh.userInfo.sessionId,
  });
  if (!session) throw new Error("session is can't define");

  const {
    _id,
    values: { uid, username },
  }: tokenSession = session;

  const newAccessToken = createToken(
    {
      sessionId: _id,
      uid,
      username,
    },
    "5m"
  );
  return newAccessToken;
};

//=============================================================================

export default { restoreAccessToken };
