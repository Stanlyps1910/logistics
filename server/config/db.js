const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/srirangalogistics");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed default accounts
    await seedDatabase();
  } catch (error) {
    console.warn(`\n[WARNING] MongoDB Connection failed: ${error.message}`);
    console.warn("Server is starting in JSON Database Fallback Mode using locally saved mock files.\n");
  }
};

const seedDatabase = async () => {
  try {
    const Client = require("../models/Client");
    
    // Check if clients already exist
    const clientCount = await Client.countDocuments();
    if (clientCount === 0) {
      console.log("Seeding default client accounts...");
      await Client.create([
        {
          name: "Arjun Mehta",
          email: "client@srirangalogistics.com",
          password: "client123",
          company: "TechVista Solutions",
          whatsapp: "+919876543210",
          shipments: 2,
          status: "Active",
          joined: new Date().toISOString().split("T")[0]
        },
        {
          name: "Sarah Jenkins",
          email: "sjenkins@acmecorp.com",
          password: "password123",
          company: "Acme Corporation",
          whatsapp: "+15550199",
          shipments: 1,
          status: "Active",
          joined: new Date().toISOString().split("T")[0]
        }
      ]);
    }

    // Seed default admin in a "User" model (to match frontend auth structure)
    const User = require("../models/User");
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      console.log("Seeding default admin account...");
      await User.create({
        name: "Priya Sharma",
        email: "admin@srirangalogistics.com",
        password: "admin123", // Storing in plain text/simple hash for compatibility with mock database
        role: "admin",
        company: "SRI RANGA LOGISTICS",
        loginTime: new Date().toISOString()
      });
    }

    // Seed some initial shipments to make sure charts and dashboard have data out of the box
    const Shipment = require("../models/Shipment");
    const shipmentCount = await Shipment.countDocuments();
    if (shipmentCount === 0) {
      console.log("Seeding default shipments...");
      const months = [0, 1, 2, 3, 4, 5]; // Jan to Jun
      const seedShipments = [];
      const trackingChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      
      const getRandomId = () => {
        return "SRL-" +
          Array.from({ length: 4 }, () => trackingChars[Math.floor(Math.random() * trackingChars.length)]).join("") + "-" +
          Array.from({ length: 2 }, () => trackingChars[Math.floor(Math.random() * trackingChars.length)]).join("");
      };

      // Create shipments for different months to show monthly revenue trends
      const now = new Date();
      const currentYear = now.getFullYear();

      const shipmentData = [
        { clientName: "Arjun Mehta", clientEmail: "client@srirangalogistics.com", origin: "Mumbai", destination: "Delhi", status: "Delivered", cost: 15400, monthIdx: 0, day: 15 },
        { clientName: "Arjun Mehta", clientEmail: "client@srirangalogistics.com", origin: "Tokyo Hub", destination: "Bengaluru", status: "Delivered", cost: 45000, monthIdx: 1, day: 10 },
        { clientName: "Sarah Jenkins", clientEmail: "sjenkins@acmecorp.com", origin: "Mumbai", destination: "Bengaluru", status: "Delivered", cost: 22000, monthIdx: 2, day: 22 },
        { clientName: "Arjun Mehta", clientEmail: "client@srirangalogistics.com", origin: "Bengaluru", destination: "Chennai", status: "Picked Up", cost: 8900, monthIdx: 3, day: 5 },
        { clientName: "Sarah Jenkins", clientEmail: "sjenkins@acmecorp.com", origin: "Delhi", destination: "Mumbai", status: "In Transit", cost: 17500, monthIdx: 4, day: 12 },
        { clientName: "Arjun Mehta", clientEmail: "client@srirangalogistics.com", origin: "Kolkata", destination: "Mumbai", status: "Customs Clearance", cost: 35000, monthIdx: 5, day: 20 },
        { clientName: "Sarah Jenkins", clientEmail: "sjenkins@acmecorp.com", origin: "Chennai", destination: "Hyderabad", status: "Delivered", cost: 12000, monthIdx: 5, day: 18 }
      ];

      for (const item of shipmentData) {
        const shipmentDate = new Date(currentYear, item.monthIdx, item.day);
        const etaDate = new Date(shipmentDate.getTime() + 5 * 86400000);
        
        seedShipments.push({
          trackingId: getRandomId(),
          clientName: item.clientName,
          clientEmail: item.clientEmail,
          clientWhatsapp: "+919876543210",
          origin: item.origin,
          destination: item.destination,
          weight: 150,
          freightType: "road",
          specialInstructions: "Handle with care",
          status: item.status,
          cost: item.cost,
          date: shipmentDate.toISOString().split("T")[0],
          eta: etaDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
          createdAt: shipmentDate
        });
      }

      await Shipment.create(seedShipments);
    }
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
  }
};

module.exports = connectDB;
