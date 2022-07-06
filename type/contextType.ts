import { AuthenticationError } from "apollo-server-core";
import { Request, Response } from "express";
import { PubSub } from "graphql-subscriptions";

export type contextType = {
  pubsub: PubSub;
  deserializeUser: string | { authError: AuthenticationError };
  req: Request;
  res: Response;
};
