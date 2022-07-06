import { FilterQuery, Model } from "mongoose";

export const getItemsToMongo = (
  DB: Model<any>,
  condition?: FilterQuery<any>
) => {
  return new Promise((resolve, reject) => {
    DB.find(condition ? condition : {}, (err: Error, result: Array<any>) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
