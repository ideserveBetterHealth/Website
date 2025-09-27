import axios from "axios";

const sendMessageViaWhatsApp = async (phoneNumber, message) => {
  try {
    const response = await axios.post(
      `${process.env.Whatsapp_API_URL}/whatsapp`,
      {
        phoneNumber,
        message,
      }
    );
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("Number not registered with WhatsApp");
      }
    }
    console.error("Failed to send OTP via Baileys API:", error.message);
    throw new Error("Failed to send OTP via WhatsApp");
  }
};

export default sendMessageViaWhatsApp;
