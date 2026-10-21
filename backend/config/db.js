import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONOG_URI, {
      dbName: 'Email-verifivation',
    });
    console.log('mongoDb is connected');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
