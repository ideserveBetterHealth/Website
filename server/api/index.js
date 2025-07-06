// api/index.js
import app from "../app.js";
import connectDB from "../database/db.js";

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  return app(req, res);
}
