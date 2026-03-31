import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongodbURL = process.env.MONGODB_URL;

    if (!mongodbURL) {
      throw new Error("MONGODB_URL is not defined");
    }

    await mongoose.connect(mongodbURL);

    console.log("MongoDB connected successfully");

  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;