const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const User = require("../models/User");
const Client = require("../models/Client");
const Quote = require("../models/Quote");
const Shipment = require("../models/Shipment");

const DATA_DIR = path.join(__dirname, "../data");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const FILES = {
  users: path.join(DATA_DIR, "users.json"),
  clients: path.join(DATA_DIR, "clients.json"),
  quotes: path.join(DATA_DIR, "quotes.json"),
  shipments: path.join(DATA_DIR, "shipments.json")
};

// Seed helper for JSON files
const seedJSONFiles = () => {
  // 1. Seed Users (Admin)
  if (!fs.existsSync(FILES.users)) {
    fs.writeFileSync(FILES.users, JSON.stringify([{
      _id: "admin_seed_1",
      name: "Priya Sharma",
      email: "admin@srirangalogistics.com",
      password: "admin123",
      role: "admin",
      company: "SRI RANGA LOGISTICS",
      loginTime: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }], null, 2));
  }

  // 2. Seed Clients
  if (!fs.existsSync(FILES.clients)) {
    fs.writeFileSync(FILES.clients, JSON.stringify([
      {
        _id: "client_seed_1",
        name: "Arjun Mehta",
        email: "client@srirangalogistics.com",
        password: "client123",
        company: "TechVista Solutions",
        whatsapp: "+919876543210",
        shipments: 2,
        status: "Active",
        joined: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString()
      },
      {
        _id: "client_seed_2",
        name: "Sarah Jenkins",
        email: "sjenkins@acmecorp.com",
        password: "password123",
        company: "Acme Corporation",
        whatsapp: "+15550199",
        shipments: 1,
        status: "Active",
        joined: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString()
      }
    ], null, 2));
  }

  // 3. Seed Quotes
  if (!fs.existsSync(FILES.quotes)) {
    fs.writeFileSync(FILES.quotes, JSON.stringify([], null, 2));
  }

  // 4. Seed Shipments
  if (!fs.existsSync(FILES.shipments)) {
    const seedShipments = [];
    const trackingChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const getRandomId = () => "SRL-" +
      Array.from({ length: 4 }, () => trackingChars[Math.floor(Math.random() * trackingChars.length)]).join("") + "-" +
      Array.from({ length: 2 }, () => trackingChars[Math.floor(Math.random() * trackingChars.length)]).join("");

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
        _id: `shipment_seed_${Math.random().toString(36).substr(2, 9)}`,
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
        createdAt: shipmentDate.toISOString()
      });
    }

    fs.writeFileSync(FILES.shipments, JSON.stringify(seedShipments, null, 2));
  }
};

// Run seed immediately
seedJSONFiles();

// Helper to read JSON
const readJSON = (fileKey) => {
  try {
    const data = fs.readFileSync(FILES[fileKey], "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading mock file ${fileKey}:`, error);
    return [];
  }
};

// Helper to write JSON
const writeJSON = (fileKey, data) => {
  try {
    fs.writeFileSync(FILES[fileKey], JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing mock file ${fileKey}:`, error);
  }
};

const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// DATABASE OPERATIONS SERVICE
module.exports = {
  // Auth Admin
  async authenticateAdmin(email, password) {
    if (isMongoConnected()) {
      const user = await User.findOne({ email });
      if (user && user.password === password) {
        user.loginTime = new Date().toISOString();
        await user.save();
        return user;
      }
      return null;
    } else {
      console.log("[MOCK DB] Verifying Admin login via JSON database");
      const users = readJSON("users");
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (user) {
        user.loginTime = new Date().toISOString();
        writeJSON("users", users);
        return user;
      }
      return null;
    }
  },

  // Quotes
  async getQuotes() {
    if (isMongoConnected()) {
      return await Quote.find().sort({ createdAt: -1 });
    } else {
      console.log("[MOCK DB] Fetching Quotes via JSON database");
      const quotes = readJSON("quotes");
      return quotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },

  async addQuote(quoteData) {
    if (isMongoConnected()) {
      const newQuote = new Quote(quoteData);
      return await newQuote.save();
    } else {
      console.log("[MOCK DB] Adding Quote to JSON database");
      const quotes = readJSON("quotes");
      const newQuote = {
        _id: `quote_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        ...quoteData,
        status: "Pending",
        createdAt: new Date().toISOString()
      };
      quotes.unshift(newQuote);
      writeJSON("quotes", quotes);
      return newQuote;
    }
  },

  async convertQuote(quoteId, shipmentInput) {
    if (isMongoConnected()) {
      const quote = await Quote.findById(quoteId);
      if (!quote) throw new Error("Quote not found");
      if (quote.status === "Converted") throw new Error("Already converted");

      // Construct shipment
      const newShipment = new Shipment({
        ...shipmentInput,
        clientName: quote.name,
        clientEmail: quote.email,
        clientWhatsapp: quote.whatsapp
      });
      const savedShipment = await newShipment.save();

      // Update Quote status
      quote.status = "Converted";
      await quote.save();

      // Increment client shipments
      const client = await Client.findOne({ email: quote.email });
      if (client) {
        client.shipments = (client.shipments || 0) + 1;
        await client.save();
      }

      return { shipment: savedShipment, quote };
    } else {
      console.log("[MOCK DB] Converting Quote to Shipment via JSON database");
      const quotes = readJSON("quotes");
      const quoteIndex = quotes.findIndex(q => q._id === quoteId);
      if (quoteIndex === -1) throw new Error("Quote not found");
      if (quotes[quoteIndex].status === "Converted") throw new Error("Already converted");

      const quote = quotes[quoteIndex];
      const shipments = readJSON("shipments");

      const newShipment = {
        _id: `shipment_${Date.now()}`,
        ...shipmentInput,
        clientName: quote.name,
        clientEmail: quote.email,
        clientWhatsapp: quote.whatsapp,
        createdAt: new Date().toISOString()
      };

      shipments.unshift(newShipment);
      writeJSON("shipments", shipments);

      quote.status = "Converted";
      writeJSON("quotes", quotes);

      // Increment Client shipments count
      const clients = readJSON("clients");
      const client = clients.find(c => c.email.toLowerCase() === quote.email.toLowerCase());
      if (client) {
        client.shipments = (client.shipments || 0) + 1;
        writeJSON("clients", clients);
      }

      return { shipment: newShipment, quote };
    }
  },

  // Shipments
  async getShipments() {
    if (isMongoConnected()) {
      return await Shipment.find().sort({ createdAt: -1 });
    } else {
      console.log("[MOCK DB] Fetching Shipments via JSON database");
      const shipments = readJSON("shipments");
      return shipments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },

  async addShipment(shipmentInput) {
    if (isMongoConnected()) {
      const client = await Client.findOne({ email: shipmentInput.clientEmail });
      const clientName = client ? client.name : "Unknown Client";
      const clientWhatsapp = client ? client.whatsapp : "+919876543210";

      const newShipment = new Shipment({
        ...shipmentInput,
        clientName,
        clientWhatsapp
      });
      const savedShipment = await newShipment.save();

      if (client) {
        client.shipments = (client.shipments || 0) + 1;
        await client.save();
      }

      return savedShipment;
    } else {
      console.log("[MOCK DB] Adding Shipment to JSON database");
      const clients = readJSON("clients");
      const client = clients.find(c => c.email.toLowerCase() === shipmentInput.clientEmail.toLowerCase());
      const clientName = client ? client.name : "Unknown Client";
      const clientWhatsapp = client ? client.whatsapp : "+919876543210";

      const shipments = readJSON("shipments");
      const newShipment = {
        _id: `shipment_${Date.now()}`,
        ...shipmentInput,
        clientName,
        clientWhatsapp,
        createdAt: new Date().toISOString()
      };

      shipments.unshift(newShipment);
      writeJSON("shipments", shipments);

      if (client) {
        client.shipments = (client.shipments || 0) + 1;
        writeJSON("clients", clients);
      }

      return newShipment;
    }
  },

  async updateShipmentStatus(shipmentId, status) {
    if (isMongoConnected()) {
      const shipment = await Shipment.findById(shipmentId);
      if (!shipment) throw new Error("Shipment not found");
      const oldStatus = shipment.status;
      shipment.status = status;
      const savedShipment = await shipment.save();
      return { shipment: savedShipment, statusChanged: oldStatus !== status };
    } else {
      console.log("[MOCK DB] Updating Shipment Status in JSON database");
      const shipments = readJSON("shipments");
      const idx = shipments.findIndex(s => s._id === shipmentId);
      if (idx === -1) throw new Error("Shipment not found");
      
      const oldStatus = shipments[idx].status;
      shipments[idx].status = status;
      writeJSON("shipments", shipments);
      return { shipment: shipments[idx], statusChanged: oldStatus !== status };
    }
  },

  async getShipmentByTrackingId(trackingId) {
    if (isMongoConnected()) {
      return await Shipment.findOne({ trackingId });
    } else {
      console.log("[MOCK DB] Fetching Shipment by Tracking ID via JSON database");
      const shipments = readJSON("shipments");
      return shipments.find(s => s.trackingId === trackingId) || null;
    }
  },

  // Clients
  async getClients() {
    if (isMongoConnected()) {
      return await Client.find().sort({ createdAt: -1 });
    } else {
      console.log("[MOCK DB] Fetching Clients via JSON database");
      const clients = readJSON("clients");
      return clients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },

  async addClient(clientData) {
    if (isMongoConnected()) {
      const newClient = new Client(clientData);
      return await newClient.save();
    } else {
      console.log("[MOCK DB] Registering Client in JSON database");
      const clients = readJSON("clients");
      const exists = clients.some(c => c.email.toLowerCase() === clientData.email.toLowerCase());
      if (exists) throw new Error("Client email already exists");

      const newClient = {
        _id: `client_${Date.now()}`,
        ...clientData,
        shipments: 0,
        status: "Active",
        joined: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString()
      };

      clients.unshift(newClient);
      writeJSON("clients", clients);
      return newClient;
    }
  },

  async toggleClientStatus(clientId) {
    if (isMongoConnected()) {
      const client = await Client.findById(clientId);
      if (!client) throw new Error("Client not found");
      client.status = client.status === "Active" ? "Suspended" : "Active";
      return await client.save();
    } else {
      console.log("[MOCK DB] Toggling Client Status in JSON database");
      const clients = readJSON("clients");
      const idx = clients.findIndex(c => c._id === clientId);
      if (idx === -1) throw new Error("Client not found");

      clients[idx].status = clients[idx].status === "Active" ? "Suspended" : "Active";
      writeJSON("clients", clients);
      return clients[idx];
    }
  }
};
