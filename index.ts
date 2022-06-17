import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import path from "path";
import { readFileSync } from "fs";
import express from "express";
import http from "http";
import resolvers from "./graphql/resolvers";

const typeDefs = readFileSync(
  require.resolve("./graphql/typeDefs.graphql")
).toString();

async function startApolloServer(typeDefs: any, resolvers: any) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({
    app,
    path: "/",
  });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);
