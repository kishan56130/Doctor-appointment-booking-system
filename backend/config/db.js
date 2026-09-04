import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log("Database Connected Successfully");
    });
    
    await mongoose.connect(`${process.env.MONGODB_URI}/doctor-booking`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
