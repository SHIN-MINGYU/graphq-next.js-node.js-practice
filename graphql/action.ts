// type people = Array<{
//   id: number;
//   name: string;
//   age: number;
//   gender: string;
// }>;

import { FilterQuery, Model, Models, Schema } from "mongoose";

// export const getById = (id: number, people: people) => {
//   const filteredPeople = people.filter((person) => id === person.id);
//   return filteredPeople[0];
// };

// export const addPerson = (
//   name: string,
//   age: number,
//   gender: string,
//   people: people
// ) => {
//   const newUser = {
//     id: people.length + 1,
//     name,
//     age,
//     gender,
//   };
//   people.push(newUser);
//   return newUser;
// };

// export const deletePerson = (id: number, people: people) => {
//   const cleandPeople = people.filter((person) => id != person.id);
//   if (people.length > cleandPeople.length) {
//     return true;
//   } else {
//     return false;
//   }
// };

export const getItemToMongo = (
  DB: Model<any>,
  condition?: FilterQuery<any>
) => {
  return new Promise((resolve, reject) => {
    DB.find(condition ? condition : {}, (err: Error, result: Array<any>) => {
      console.log(result);
      if (err) reject(err);
      else resolve(result);
    });
  });
};
