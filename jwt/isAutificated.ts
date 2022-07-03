import { rule } from "graphql-shield";

const isAutificated = rule()(async (parent, args, ctx, info) => {
  return ctx.claims !== null;
});

export default isAutificated;
