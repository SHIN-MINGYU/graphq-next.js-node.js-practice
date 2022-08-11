import { config } from "dotenv";
import path from "path";

config({ path: path.join(__dirname, `.env.${process.env.NODE_ENV}`) });

import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { readFileSync } from "fs";
import express, { Request, Response } from "express";
import http from "http";
import WebSocket from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import connect from "./schemas";
import resolvers from "./graphql/resolvers";
import { pubsub } from "./graphql/pubsub";
import cookieParser from "cookie-parser";
import deserializeUser from "./context/deserializeUser";
import imgRouter from "./routes/img";
import cors from "cors";
import bodyParser from "body-parser";
import { userInfo } from "./type/session";
import { PeerServer } from "peer";

// open peer server for video chat
PeerServer({ port: 9000, path: "/peer" });

const typeDefs: string = readFileSync(
  require.resolve(path.join(__dirname, "./graphql/typeDefs.graphql"))
).toString();
// read graphql files and insert into typeDefs variables for start apollo server
connect();

declare global {
  namespace Express {
    interface Request {
      user: userInfo;
    }
  }
}

async function startApolloServer(typeDefs: string, resolvers: any) {
  const app = express();
  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  // combine typeDefs and resolvers
  const wsServer = new WebSocket.Server({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if your ApolloServer serves at
    // a different path.
    path: "/subscriptions",
  });
  const serverCleanup = useServer({ schema }, wsServer);
  // first parmas is schema at line 24 and second params wsServer info
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    context: ({ req, res }: { req: Request; res: Response }) => ({
      pubsub,
      deserializeUser: deserializeUser(req),
      res,
      req,
    }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  const corsOptions = {
    origin: [process.env.CLIENT_URL || "", "https://studio.apollographql.com"],
    credentials: true,
  };

  app.get("/", (req, res) => {
    return res.send("hi this is the forest api page");
  });

  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use("/img", express.static("uploads"));
  app.use("/img", imgRouter);
  app.use(
    bodyParser.json({
      limit: "50mb",
    })
  );

  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      parameterLimit: 100000,
      extended: true,
    })
  );

  try {
    await server.start();

    server.applyMiddleware({
      app,
      cors: corsOptions,
      path: "/graphql",
    });
    await new Promise<void>((resolve) =>
      httpServer.listen({ port: process.env.PORT }, resolve)
    );
    console.log(
      `Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    );
  } catch (err) {
    console.log(err);
  }
}

startApolloServer(typeDefs, resolvers);
