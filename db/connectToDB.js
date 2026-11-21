import mongoose from "mongoose";

async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_DB_URI);
    console.log(`mongoDB connected: ${connection.connection.host}`);
  } catch (err) {
    console.log("failed to coonect to mongodb ", err.message);
    process.exit(1);
  }
}

export default connectDB;
