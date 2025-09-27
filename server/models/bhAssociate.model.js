import mongoose from "mongoose";

const bhAssociateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    designation: { type: String, required: true }, // e.g., "psychologist", "cosmetologist"
    bio: String,
    experience: String,
    expertise: [String],
    qualifications: { type: String, required: true },
    // Availability per day
    availability: [
      {
        date: { type: Date, required: true },
        slots: [
          {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // unique slot ID
            time: { type: String, required: true }, // e.g., "16:00"
            isAvailable: { type: Boolean, default: true }, // true = can be booked
            isBooked: { type: Boolean, default: false }, // true = already booked
            meetingId: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" }, // linked meeting if booked
            duration: { type: Number, required: true },
            possibleDurations: { type: [Number], default: [30, 50, 80] },
          },
        ],
      },
    ],
    lastScheduleUpdates: [],
  },
  { timestamps: true }
);

export default mongoose.model("BHAssociate", bhAssociateSchema);
