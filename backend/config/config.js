require("dotenv").config();

module.exports = {
  // Node environment
  NODE_ENV: process.env.NODE_ENV || "development",

  // Server configuration
  PORT: process.env.PORT || 5000,

  // MongoDB connection
  MONGO_URI: process.env.MONGO_URI,

  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "30d",

  // Frontend URL for CORS
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",

  // File upload path
  UPLOAD_PATH: process.env.UPLOAD_PATH || "uploads",
};
