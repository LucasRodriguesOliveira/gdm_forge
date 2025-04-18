import { MongodbConfig } from '../types/mongodb.interface';

export const MONGODB_TOKEN = Symbol('mongodb');

export const mongodbConfig = (): { mongodb: MongodbConfig } => {
  const { MONGODB_URL } = process.env;

  return {
    mongodb: {
      url: MONGODB_URL,
    },
  };
};
