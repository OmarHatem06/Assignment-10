import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("mongoodb connected succesfully");
  } catch (error) {
    console.log("faild to connect db", error);
  }
};

export default ConnectDB;
