// api/index.js
import app from "../app.js";
import connectDB from "../database/db.js";

export default async function handler(req, res) {
  await connectDB(); // connection is cached internally
  return app(req, res);
}
