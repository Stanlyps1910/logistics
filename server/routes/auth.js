const express = require("express");
const router = express.Router();
const dbService = require("../utils/dbService");

// @route   POST /api/auth/login
// @desc    Admin login authentication
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter all fields" });
    }

    const user = await dbService.authenticateAdmin(email, password);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role || "admin",
        company: user.company,
        loginTime: user.loginTime
      }
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ success: false, message: "Server error during authentication" });
  }
});

module.exports = router;
