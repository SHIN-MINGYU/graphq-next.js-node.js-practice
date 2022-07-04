import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import path from "path";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { readFileSync } from "fs";
import express from "express";
import http from "http";
import WebSocket from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import connect from "./schemas";
import resolvers from "./graphql/resolvers";
import { pubsub } from "./graphql/resolvers";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import deserializeUser from "./context/deserializeUser";

config();
const typeDefs: string = readFileSync(
  require.resolve(path.join(__dirname, "./graphql/typeDefs.graphql"))
).toString();
// read graphql files and insert into typeDefs variables for start apollo server
connect();

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
    context: ({ req, res }) => ({
      pubsub,
      deserializeUser: deserializeUser(req, res),
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
    origin: "http://localhost:3000",
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(cookieParser());

  try {
    await server.start();

    server.applyMiddleware({
      app,
      cors: corsOptions,
      path: "/graphql",
    });
    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 4000 }, resolve)
    );
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  } catch (err) {
    console.log(err);
  }
}

startApolloServer(typeDefs, resolvers);
