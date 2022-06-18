import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import path from "path";
import { readFileSync } from "fs";
import express from "express";
import http from "http";
import connect from "./schemas";
import resolvers from "./graphql/resolvers";

const typeDefs = readFileSync(
  require.resolve(path.join(__dirname, "./graphql/typeDefs.graphql"))
).toString();

connect();

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
  try {
    await server.start();
    server.applyMiddleware({
      app,
      path: "/",
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
