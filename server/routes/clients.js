const express = require("express");
const router = express.Router();
const dbService = require("../utils/dbService");

// @route   GET /api/clients
// @desc    Get all registered clients
router.get("/", async (req, res) => {
  try {
    const clients = await dbService.getClients();
    res.json(clients);
  } catch (error) {
    console.error("Fetch clients error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch clients" });
  }
});

// @route   POST /api/clients
// @desc    Register a new client
router.post("/", async (req, res) => {
  const { name, email, password, company, whatsapp } = req.body;

  try {
    if (!name || !email || !password || !whatsapp) {
      return res.status(400).json({ success: false, message: "Please enter all required fields" });
    }

    const savedClient = await dbService.addClient({
      name,
      email,
      password,
      company: company || "N/A",
      whatsapp
    });

    res.status(201).json({ success: true, client: savedClient });
  } catch (error) {
    console.error("Create client error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create client account" });
  }
});

// @route   PUT /api/clients/:id/toggle
// @desc    Toggle client account status between Active and Suspended
router.put("/:id/toggle", async (req, res) => {
  try {
    const updatedClient = await dbService.toggleClientStatus(req.params.id);
    res.json({ success: true, client: updatedClient });
  } catch (error) {
    console.error("Toggle client status error:", error);
    res.status(500).json({ success: false, message: "Failed to toggle status" });
  }
});

module.exports = router;
