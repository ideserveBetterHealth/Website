import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  session: {
    type: Object,
    required: true,
  },
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;
