const mongoose = require("mongoose");

const ShipmentSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: true,
    unique: true
  },
  clientName: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  clientWhatsapp: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  freightType: {
    type: String,
    enum: ["road", "air", "ocean"],
    required: true
  },
  specialInstructions: {
    type: String
  },
  status: {
    type: String,
    enum: ["Pending", "Picked Up", "In Transit", "Customs Clearance", "Customs Cleared", "Out for Delivery", "Delivered"],
    default: "Pending"
  },
  cost: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split("T")[0]
  },
  eta: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Shipment", ShipmentSchema);
