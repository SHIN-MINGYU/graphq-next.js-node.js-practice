import { FilterQuery, Model } from "mongoose";

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
