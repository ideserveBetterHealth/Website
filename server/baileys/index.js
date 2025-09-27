import {
  makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import useSingleFileAuthState from "./single.js";
import qrcode from "qrcode-terminal";
import fs from "fs";
import mongoose from "mongoose";
import Session from "./session.model.js";
import express from "express";

const app = express();

let sock;

async function startSocket() {
  const data = await Session.findOne({});
  const sessionData = data?.session;
  if (sessionData) {
    fs.writeFileSync("./session.json", JSON.stringify(sessionData, null, 2));
  }

  const { state, saveState } = useSingleFileAuthState("./session.json");
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
  });

  sock.ev.on("creds.update", saveState);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📲 Scan the QR below to login:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;

      if (statusCode === DisconnectReason.loggedOut) {
        console.log(
          "❌ Session expired or user logged out. Deleting session..."
        );

        if (fs.existsSync("./session.json")) {
          await Session.deleteMany({});
          fs.unlinkSync("./session.json");
        }

        startSocket();
      } else {
        console.log("🔁 Reconnecting...");
        startSocket();
      }
    }

    if (connection === "open") {
      console.log("✅ Connected to WhatsApp");

      if (!sessionData) {
        const session = fs.readFileSync("./session.json", "utf-8");
        await Session.create({ session: JSON.parse(session) });
        console.log("📁 Session saved to MongoDB");
      }
    }
  });
}

async function startServer() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.listen(6996, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 6996}`);
  });
  app.get("/", (req, res) => {
    res.send("Welcome to the WhatsApp Baileys API!");
  });
  app.post("/whatsapp", async (req, res) => {
    console.log(req.body);
    const { phoneNumber, message } = req.body;
    if (!phoneNumber || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const jid = `${Number(phoneNumber)}@s.whatsapp.net`; // Change to real number
    const result = await sock.onWhatsApp(jid);
    if (result?.length > 0 && result[0].exists) {
      try {
        await sock.sendMessage(jid, {
          text: message,
        });
        console.log("✅ Message sent to:", jid);
        res
          .status(200)
          .json({ success: true, message: "OTP sent successfully" });
      } catch (err) {
        console.error("❌ Failed to send message:", err);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
      }
    } else {
      console.log("❌ Phone number does not exist on WhatsApp:", jid);
      res.status(404).json({
        success: false,
        message: "Phone number not found on WhatsApp",
      });
    }
  });
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    try {
      await startSocket();
      await startServer();
    } catch (error) {
      console.error("❌ Error in starting services:", error.message);
    }
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
  });
