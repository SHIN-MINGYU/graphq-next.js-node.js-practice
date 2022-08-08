import { AuthenticationError } from "apollo-server-core";
import { Request, Response } from "express";
import { PubSub } from "graphql-subscriptions";
type authError = {
  authError: AuthenticationError;
};

export interface contextType {
  pubsub: PubSub;
  deserializeUser: string | authError;
  req: Request;
  res: Response;
}
