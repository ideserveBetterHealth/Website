import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import { userRouter } from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { bhAssociateDetailRouter } from "./routes/bhAssociateDetail.route.js";
import { mediaRouter } from "./routes/media.route.js";
import { meetingRouter } from "./routes/meetings.route.js";
import { paymentRouter } from "./routes/payment.route.js";
import { pricingRouter } from "./routes/pricing.route.js";
import { questionnaireRouter } from "./routes/questionnaire.route.js";
import { psychologistRouter } from "./routes/psychologist.route.js";
import { couponRouter } from "./routes/coupon.route.js";
import { bhAssociateRouter } from "./routes/bhAssociate.route.js";
import cron from "node-cron-tz";
import { getNextHalfHourSlotMeetings } from "./controllers/meetings.controller.js";
import moment from "moment-timezone";
import sendMessageViaWhatsApp from "./services/whatsappService.js";
import { User } from "./models/user.model.js";
import { spawn } from "child_process";
import path from "path";

// Helper function to convert 24-hour time to 12-hour format
const convertTo12Hour = (time24) => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

dotenv.config({});

const app = express();

const PORT = process.env.PORT || 3000;

//default middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format. Please check your request.",
    });
  }
  next();
});

//apis
app.use("/api/v1/user", userRouter);
app.use("/api/v1/register", bhAssociateDetailRouter);
app.use("/api/v1/media", mediaRouter);
app.use("/api/v1/meeting", meetingRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/pricing", pricingRouter);
app.use("/api/v1/questionnaire", questionnaireRouter);
app.use("/api/v1/psychologists", psychologistRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/bh-associate", bhAssociateRouter);

try {
  await connectDB();

  // Set up automated meeting scheduler - runs at :00 and :30 every hour in IST
  cron.schedule(
    "0,30 * * * *",
    async () => {
      console.log(
        `🔄 Running automated meeting slot check at ${moment()
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD hh:mm:ss A")} IST`
      );

      try {
        const result = await getNextHalfHourSlotMeetings();

        if (!result.success) {
          console.log("❌ Error fetching meetings:", result.message);
          return;
        }

        console.log(
          `✅ Found ${result.meetings.length} meetings for slot ${result.nextSlotTime} (Current IST: ${result.currentIST})`
        );

        if (result.meetings.length === 0) return;

        const adminPhoneNumbers = await User.find({ role: "admin" }).select(
          "name phoneNumber"
        );

        for (const meeting of result.meetings) {
          console.log(
            `📅 Meeting: ${meeting.clientName} with ${
              meeting.bhAssocName
            } at ${convertTo12Hour(meeting.meetingTime)} IST`
          );

          try {
            // Client reminder
            await sendMessageViaWhatsApp(
              `+91${meeting.clientPhoneNumber}`,
              `*BetterHealth – ⏰ Upcoming Session in 30 minutes*\n\nHello ${
                meeting.clientName
              },\nThis is a reminder for your ${
                meeting.duration
              } min session with ${meeting.bhAssocName} at ${convertTo12Hour(
                meeting.meetingTime
              )} IST.\n\n👉 Please join the meeting via your dashboard on time.\n\n🔗 Dashboard Link: ideservebetterhealth.in/dashboard\n\nWe look forward to supporting you in your journey with BetterHealth.\n\nBest regards,\nTeam BetterHealth 🧡`
            );
            console.log(`✅ WhatsApp sent to ${meeting.clientName}`);

            // BH Associate reminder
            await sendMessageViaWhatsApp(
              `+91${meeting.bhAssocPhoneNumber}`,
              `*BetterHealth – ⏰ Upcoming Session in 30 minutes*\n\nHello ${
                meeting.bhAssocName
              },\n\nYou have a session scheduled with ${
                meeting.clientName
              } in half an hour.\n\n📋 Session Details:\n• Client: ${
                meeting.clientName
              }\n• Time: ${convertTo12Hour(
                meeting.meetingTime
              )} IST\n• Duration: ${
                meeting.duration
              } minutes\n\n👉 Please be prepared and join the meeting via dashboard 5 minutes early.\n\n🔗 Dashboard Link: ideservebetterhealth.in/dashboard\n\nWe appreciate your dedication to helping our clients on their wellness journey! 🌟\n\nBest regards,\nTeam BetterHealth 🧡`
            );
            console.log(`✅ WhatsApp sent to ${meeting.bhAssocName}`);

            // Admin reminders
            for (const admin of adminPhoneNumbers) {
              await sendMessageViaWhatsApp(
                `+91${admin.phoneNumber}`,
                `*BetterHealth – Management Alert*\n\nHello ${
                  admin.name
                },\n\n📋 Upcoming Session Details:\n• Client: ${
                  meeting.clientName
                }\n• BH Associate: ${
                  meeting.bhAssocName
                }\n• Scheduled Time: ${convertTo12Hour(
                  meeting.meetingTime
                )} IST\n• Duration: ${
                  meeting.duration
                } minutes\n\n⚡ This is an automated reminder.\n\nBest regards,\nBetterHealth Automated System 🧡`
              );
              console.log(`✅ WhatsApp sent to ${admin.name}`);
            }
          } catch (err) {
            console.error(
              `❌ Failed sending reminders for meeting ${meeting._id}:`,
              err.message
            );
            // Continue with next meeting even if one fails
          }
        }
      } catch (error) {
        console.error("❌ Error in automated meeting check:", error);
      }
    },
    { timezone: "Asia/Kolkata" }
  );

  // Calculate next run time
  const nextRun = moment().tz("Asia/Kolkata");
  const currentMinutes = nextRun.minutes();
  const nextMinutes = currentMinutes < 30 ? 30 : 0;
  const nextHours =
    currentMinutes < 30 ? nextRun.hours() : (nextRun.hours() + 1) % 24;
  nextRun.minutes(nextMinutes).hours(nextHours);

  console.log(
    `📅 Next run: ${nextRun.format(
      "YYYY-MM-DD hh:mm:ss A"
    )} IST (${nextRun.fromNow()})`
  );

  app.listen(PORT, () => {
    console.log(`SERVER LISTENING ON PORT ${PORT} `);
  });

  // Start Baileys service
  const baileysProcess = spawn("node", ["index.js"], {
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: "6996",
      MONGO_URI: process.env.BAILEYS_MONGO_URI,
    },
    cwd: path.join(process.cwd(), "baileys"),
  });

  baileysProcess.on("error", (err) => {
    console.error("Failed to start Baileys process:", err);
  });

  baileysProcess.on("exit", (code) => {
    console.log(`Baileys process exited with code ${code}`);
  });
} catch (error) {
  console.log("ERROR IN CONNECTING DB \n", error);
}
