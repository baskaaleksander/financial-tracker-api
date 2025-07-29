import mongoose from 'mongoose';
import config from './env';

const connectDB = () => {
  mongoose
    .connect(config.dbUrl)
    .then(() => {
      console.log('Successfully connected to MongoDB');
    })
    .catch((error) => {
      console.error(error);
    });
};

export default connectDB;
