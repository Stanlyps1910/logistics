const nodemailer = require("nodemailer");
const twilio = require("twilio");

// Create Nodemailer Transporter
const createMailTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  
  if (!user || !pass || user.includes("your_email") || pass.includes("your_email")) {
    return null;
  }

  try {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: { user, pass }
    });
  } catch (error) {
    console.error("Failed to initialize mail transporter:", error.message);
    return null;
  }
};

// Create Twilio Client
const getTwilioClient = () => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  
  if (!sid || !token || sid.includes("your_twilio") || token.includes("your_twilio")) {
    return null;
  }

  try {
    return twilio(sid, token);
  } catch (error) {
    console.error("Failed to initialize Twilio client:", error.message);
    return null;
  }
};

/**
 * Send email & WhatsApp notification to Admin when a new Quote is submitted.
 */
const sendQuoteNotifications = async (quote) => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@srirangalogistics.com";
  const adminWhatsapp = process.env.ADMIN_WHATSAPP || "+919876543210";
  
  const emailSubject = `SRI RANGA LOGISTICS: New Quote Inquiry from ${quote.name}`;
  const emailText = `
Hello Admin,

A new quote inquiry has been submitted on SRI RANGA LOGISTICS:

Name: ${quote.name}
Email: ${quote.email}
WhatsApp: ${quote.whatsapp}
Subject: ${quote.subject}
Message:
------------------------------------------
${quote.message}
------------------------------------------

Please log in to your Admin Dashboard to manage this inquiry or convert it to a shipment.

Best Regards,
SRI RANGA LOGISTICS Automation
  `;

  const whatsappMessage = `*SRI RANGA LOGISTICS - New Inquiry Received*\n\n*From:* ${quote.name}\n*Email:* ${quote.email}\n*WhatsApp:* ${quote.whatsapp}\n*Subject:* ${quote.subject}\n*Message:* ${quote.message}`;

  // 1. Send Email
  const transporter = createMailTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: emailSubject,
        text: emailText
      });
      console.log(`[EMAIL] Inquiry email notification successfully sent to Admin (${adminEmail})`);
    } catch (err) {
      console.error("[EMAIL ERROR] Failed to send email to Admin:", err.message);
    }
  } else {
    console.log(`\n--- [MOCK EMAIL] ---
To: ${adminEmail}
Subject: ${emailSubject}
Body: ${emailText}
--------------------\n`);
  }

  // 2. Send WhatsApp
  const client = getTwilioClient();
  const twilioNum = process.env.TWILIO_PHONE_NUMBER || "whatsapp:+14155238886";
  
  if (client) {
    try {
      // Ensure destination number has whatsapp: prefix
      const toNum = adminWhatsapp.startsWith("whatsapp:") ? adminWhatsapp : `whatsapp:${adminWhatsapp}`;
      await client.messages.create({
        body: whatsappMessage,
        from: twilioNum,
        to: toNum
      });
      console.log(`[WHATSAPP] Inquiry alert successfully sent to Admin WhatsApp (${adminWhatsapp})`);
    } catch (err) {
      console.error("[WHATSAPP ERROR] Failed to send WhatsApp to Admin:", err.message);
    }
  } else {
    console.log(`\n--- [MOCK WHATSAPP] ---
From: ${twilioNum}
To: ${adminWhatsapp}
Message: ${whatsappMessage}
-----------------------\n`);
  }
};

/**
 * Send email & WhatsApp notification to Client on Shipment Status Update.
 * Triggered on statuses: Picked Up, Customs Clearance, and Delivered.
 */
const sendShipmentStatusNotifications = async (shipment) => {
  const allowedStatuses = ["Picked Up", "Customs Clearance", "Customs Cleared", "Delivered"];
  if (!allowedStatuses.includes(shipment.status)) {
    return;
  }

  const clientEmail = shipment.clientEmail;
  const clientWhatsapp = shipment.clientWhatsapp;

  const emailSubject = `SRI RANGA LOGISTICS Shipment Update: Tracking ID ${shipment.trackingId} is now [${shipment.status.toUpperCase()}]`;
  const emailText = `
Hello ${shipment.clientName},

We have an update regarding your shipment.

Tracking ID: ${shipment.trackingId}
Route: ${shipment.origin} -> ${shipment.destination}
Status: ${shipment.status}
Freight Type: ${shipment.freightType.toUpperCase()}
ETA: ${shipment.eta}

Special Instructions: ${shipment.specialInstructions || "None"}

You can track this shipment or view details in the SRI RANGA LOGISTICS Portal using your Tracking ID.

Best Regards,
SRI RANGA LOGISTICS Logistics Team
  `;

  const whatsappMessage = `*SRI RANGA LOGISTICS Shipment Update*\n\nDear ${shipment.clientName},\nYour shipment *${shipment.trackingId}* (${shipment.origin} ➔ ${shipment.destination}) status has been updated to: *${shipment.status}*.\n\n*ETA:* ${shipment.eta}\n*Freight:* ${shipment.freightType.toUpperCase()}\n\nThank you for choosing SRI RANGA LOGISTICS!`;

  // 1. Send Email
  const transporter = createMailTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: clientEmail,
        subject: emailSubject,
        text: emailText
      });
      console.log(`[EMAIL] Status update email sent to customer ${clientEmail} (${shipment.status})`);
    } catch (err) {
      console.error("[EMAIL ERROR] Failed to send status email to client:", err.message);
    }
  } else {
    console.log(`\n--- [MOCK EMAIL CUSTOMER] ---
To: ${clientEmail}
Subject: ${emailSubject}
Body: ${emailText}
-----------------------------\n`);
  }

  // 2. Send WhatsApp
  const client = getTwilioClient();
  const twilioNum = process.env.TWILIO_PHONE_NUMBER || "whatsapp:+14155238886";

  if (client) {
    try {
      const toNum = clientWhatsapp.startsWith("whatsapp:") ? clientWhatsapp : `whatsapp:${clientWhatsapp}`;
      await client.messages.create({
        body: whatsappMessage,
        from: twilioNum,
        to: toNum
      });
      console.log(`[WHATSAPP] Status update WhatsApp sent to customer ${clientWhatsapp} (${shipment.status})`);
    } catch (err) {
      console.error("[WHATSAPP ERROR] Failed to send status WhatsApp to client:", err.message);
    }
  } else {
    console.log(`\n--- [MOCK WHATSAPP CUSTOMER] ---
From: ${twilioNum}
To: ${clientWhatsapp}
Message: ${whatsappMessage}
-------------------------------\n`);
  }
};

module.exports = {
  sendQuoteNotifications,
  sendShipmentStatusNotifications
};
