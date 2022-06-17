import { getById, addPerson, deletePerson } from "./action";
import { people } from "./data";

const resolvers = {
  Query: {
    people: () => people,
    person: (_: any, { id }: { id: number }) => getById(id, people),
  },
  Mutation: {
    addPerson: (
      _: any,
      { name, age, gender }: { name: string; age: number; gender: string }
    ) => addPerson(name, age, gender, people),
    deletePerson: (_: any, { id }: { id: number }) => deletePerson(id, people),
  },
};
export default resolvers;
