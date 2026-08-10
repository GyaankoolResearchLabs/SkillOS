require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
  try {
    console.log("Connecting to MongoDB...");
    console.log("URI:", process.env.MONGO_URI.replace(/:(.*?)@/, ":******@"));

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection Failed");
    console.error(err);
    process.exit(1);
  }
}

testConnection();