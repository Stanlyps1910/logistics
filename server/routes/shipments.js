const express = require("express");
const router = express.Router();
const dbService = require("../utils/dbService");
const { sendShipmentStatusNotifications } = require("../utils/notificationHelper");

// @route   GET /api/shipments
// @desc    Get all shipments
router.get("/", async (req, res) => {
  try {
    const shipments = await dbService.getShipments();
    res.json(shipments);
  } catch (error) {
    console.error("Fetch shipments error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch shipments" });
  }
});

// @route   POST /api/shipments
// @desc    Create a new shipment
router.post("/", async (req, res) => {
  const { clientEmail, origin, destination, weight, freightType, specialInstructions, cost } = req.body;

  try {
    if (!clientEmail || !origin || !destination || !weight) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    const numericWeight = parseFloat(weight);
    if (isNaN(numericWeight) || numericWeight <= 0) {
      return res.status(400).json({ success: false, message: "Invalid weight value" });
    }

    // Helper to generate tracking ID
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const trackingId = "SRL-" +
      Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("") +
      "-" +
      Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

    // Cost calculations:
    let finalCost = cost ? parseFloat(cost) : 0;
    if (!finalCost) {
      const factor = { road: 25, air: 150, ocean: 15 }[freightType] || 25;
      const baseCost = numericWeight * factor;
      finalCost = Math.round(baseCost + Math.random() * 2000 + 500);
    }

    const etaDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const formattedEta = etaDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const savedShipment = await dbService.addShipment({
      trackingId,
      clientEmail,
      origin,
      destination,
      weight: numericWeight,
      freightType: freightType || "road",
      specialInstructions: specialInstructions || "None",
      status: "Picked Up",
      cost: finalCost,
      eta: formattedEta,
      date: new Date().toISOString().split("T")[0]
    });

    // Notify customer that their shipment has been Picked Up
    sendShipmentStatusNotifications(savedShipment).catch(err => {
      console.error("Status notification trigger error:", err);
    });

    res.status(201).json({ success: true, shipment: savedShipment });
  } catch (error) {
    console.error("Create shipment error:", error);
    res.status(500).json({ success: false, message: "Failed to create shipment" });
  }
});

// @route   PUT /api/shipments/:id/status
// @desc    Update a shipment's status and notify customer if changed
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;

  try {
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const result = await dbService.updateShipmentStatus(req.params.id, status);
    
    if (result.statusChanged) {
      sendShipmentStatusNotifications(result.shipment).catch(err => {
        console.error("Status update notification error:", err);
      });
    }

    res.json({ success: true, shipment: result.shipment });
  } catch (error) {
    console.error("Update shipment status error:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

// @route   GET /api/shipments/track/:trackingId
// @desc    Get sanitized shipment details for tracking
router.get("/track/:trackingId", async (req, res) => {
  try {
    const shipment = await dbService.getShipmentByTrackingId(req.params.trackingId);
    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    // Sanitize shipment details for public tracking
    const sanitizedShipment = {
      _id: shipment._id,
      trackingId: shipment.trackingId,
      status: shipment.status,
      origin: shipment.origin,
      destination: shipment.destination,
      weight: shipment.weight,
      freightType: shipment.freightType,
      eta: shipment.eta,
      date: shipment.date,
      specialInstructions: shipment.specialInstructions,
      createdAt: shipment.createdAt
    };

    res.json(sanitizedShipment);
  } catch (error) {
    console.error("Track shipment error:", error);
    res.status(500).json({ success: false, message: "Failed to query tracking status" });
  }
});

module.exports = router;
