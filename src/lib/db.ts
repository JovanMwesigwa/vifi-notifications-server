import mongoose from "mongoose";
import { env } from "../config/env";

export async function connectToDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV === "development",
    });

    // Basic connection logging
    mongoose.connection.on("connected", () => {
      console.log("[db] connected");
    });
    mongoose.connection.on("disconnected", () => {
      console.log("[db] disconnected");
    });
    mongoose.connection.on("error", (err) => {
      console.error("[db] error", err);
    });
  } catch (error) {
    console.error("[db] connection failed", error);
    throw error;
  }
}
