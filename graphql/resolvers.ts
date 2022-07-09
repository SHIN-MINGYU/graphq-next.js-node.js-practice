// import { getById, addPerson, deletePerson } from "./action";
// import { people } from "./data";

import rootMutation from "./mutation";
import rootQuery from "./query";
import rootSubscribe from "./subscribe";

const resolvers = {
  Query: {
    ...rootQuery,
  },
  Mutation: {
    ...rootMutation,
  },
  Subscription: {
    ...rootSubscribe,
  },
};

export default resolvers;
