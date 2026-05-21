const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  company: {
    type: String
  },
  whatsapp: {
    type: String,
    required: true
  },
  shipments: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["Active", "Suspended"],
    default: "Active"
  },
  joined: {
    type: String,
    default: () => new Date().toISOString().split("T")[0]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Client", ClientSchema);
