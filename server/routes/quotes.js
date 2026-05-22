const express = require("express");
const router = express.Router();
const dbService = require("../utils/dbService");
const { sendQuoteNotifications } = require("../utils/notificationHelper");

// @route   GET /api/quotes
// @desc    Get all quotes
router.get("/", async (req, res) => {
  try {
    const quotes = await dbService.getQuotes();
    res.json(quotes);
  } catch (error) {
    console.error("Fetch quotes error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve quotes" });
  }
});

// @route   POST /api/quotes
// @desc    Create a new quote inquiry and trigger notifications
router.post("/", async (req, res) => {
  const { name, email, whatsapp, subject, message } = req.body;

  try {
    if (!name || !email || !whatsapp || !subject || !message) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    const savedQuote = await dbService.addQuote({
      name,
      email,
      whatsapp,
      subject,
      message
    });

    // Trigger email and WhatsApp notifications asynchronously
    sendQuoteNotifications(savedQuote).catch(err => {
      console.error("Notification trigger error:", err);
    });

    res.status(201).json({ success: true, quote: savedQuote });
  } catch (error) {
    console.error("Create quote error:", error);
    res.status(500).json({ success: false, message: "Failed to process quote request" });
  }
});

// @route   POST /api/quotes/:id/convert
// @desc    Convert a quote to an active shipment
router.post("/:id/convert", async (req, res) => {
  const { origin, destination, weight, freightType, specialInstructions, cost } = req.body;

  try {
    if (!origin || !destination || !weight) {
      return res.status(400).json({ success: false, message: "Please fill all required shipment fields" });
    }

    const computedWeight = parseFloat(weight);

    // Calculate cost if not provided
    let finalCost = cost ? parseFloat(cost) : 0;
    if (!finalCost) {
      const factor = { road: 25, air: 150, ocean: 15 }[freightType] || 25;
      const baseCost = computedWeight * factor;
      finalCost = Math.round(baseCost + Math.random() * 2000 + 500);
    }

    // Generate tracking ID
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const trackingId = "SRL-" +
      Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("") +
      "-" +
      Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

    const etaDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const formattedEta = etaDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const result = await dbService.convertQuote(req.params.id, {
      trackingId,
      origin,
      destination,
      weight: computedWeight,
      freightType: freightType || "road",
      specialInstructions: specialInstructions || "None",
      status: "Picked Up",
      cost: finalCost,
      eta: formattedEta,
      date: new Date().toISOString().split("T")[0]
    });

    res.json({
      success: true,
      message: "Quote successfully converted to shipment",
      shipment: result.shipment,
      quote: result.quote
    });
  } catch (error) {
    console.error("Convert quote error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to convert quote to shipment" });
  }
});

module.exports = router;
