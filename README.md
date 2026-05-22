# SRI RANGA LOGISTICS Management Platform

SRI RANGA LOGISTICS is a modern, high-performance logistics management platform built on the MERN stack (MongoDB, Express, React, Node.js). It provides real-time shipment tracking, rate calculators, client administration tools, automated status notifications, and comprehensive operations analytics.

---

## 🚀 Key Features

* **Live Shipment Tracking Portal**: Customers can input a tracking ID to view dynamic delivery timelines, courier carriers, origins, and destinations.
* **Operations Admin Dashboard**: High-fidelity visual dashboard using **Recharts** (Area charts for revenue trends and Pie charts for shipment status distribution).
* **Pre-Populated Shipment Conversion**: Convert customer quotes/inquiries directly into shipments with automated modal forms pre-filling customer information.
* **Resilient Database Layer**: Interfaces with MongoDB/Mongoose. If MongoDB is offline, operations automatically fallback to a structured JSON-based mock database storage system (`server/data/`) to guarantee uptime.
* **Triple-Channel Notification System**: Automatically triggers email alerts via **Nodemailer** and SMS/WhatsApp notifications via the **Twilio API** upon status transitions (`Picked Up`, `Customs Clearance`, `Delivered`).
* **Rate Calculator**: Dynamic freight calculator customized with realistic pricing factors (Road: ₹25/kg, Air: ₹150/kg, Ocean: ₹15/kg) and localized to Indian Rupees (INR / ₹).
* **Modern Premium UI**: Built with React (v19), TailwindCSS, Framer Motion, and Lucide React.

---

## 🛠️ Tech Stack

* **Frontend**: React, Vite, TailwindCSS, Framer Motion, Recharts, Lucide Icons
* **Backend**: Node.js, Express, Mongoose, Nodemailer, Twilio SDK
* **Database**: MongoDB (with local JSON file fallback for offline resilience)

---

## 💻 Local Development Setup

### Prerequisites
* [Node.js](https://nodejs.org/) installed (v18+ recommended)
* [MongoDB](https://www.mongodb.com/) (optional; database fallbacks to local JSON files if MongoDB is not present)

### 1. Install Dependencies
Run the install command in both the root directory (frontend) and the server directory (backend):

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory and add the following keys:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/srirangalogistics
NODE_ENV=development

# Email Alerts (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Twilio WhatsApp Alerts (Optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=whatsapp:+14155238886
ADMIN_WHATSAPP_NUMBER=+919876543210
```

### 3. Run Locally

Start both the frontend and backend servers. You can run them in separate terminals:

**Start Backend (Port 5000)**:
```bash
cd server
npm run dev
```

**Start Frontend (Port 5173)**:
```bash
# In the root directory
npm run dev
```

Open `http://localhost:5173` in your browser. Admin credentials for testing:
* **Email**: `admin@srirangalogistics.com`
* **Password**: `admin123`

---

## 🌐 Deployment Guide: Hosting on Render

Render is an excellent platform to host MERN stack applications. There are two primary options for deployment:

### Option A: Hosting as Two Separate Services (Recommended)
This approach hosts the frontend as a fast, globally distributed **Static Site** (free) and the backend as a **Web Service** (Node.js).

#### 1. Deploy the Backend (Web Service)
1. Log in to [Render](https://render.com/) and click **New > Web Service**.
2. Connect your Git repository.
3. Set the following configurations:
   * **Name**: `srirangalogistics-backend`
   * **Environment**: `Node`
   * **Root Directory**: `server`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
4. Expand the **Advanced** section and add your Environment Variables (from your local `.env`). Ensure `NODE_ENV` is set to `production`.
5. Click **Create Web Service**. Note your backend URL (e.g., `https://srirangalogistics-backend.onrender.com`).

#### 2. Deploy the Frontend (Static Site)
1. Click **New > Static Site** on Render.
2. Connect your Git repository.
3. Set the following configurations:
   * **Name**: `srirangalogistics`
   * **Build Command**: `npm run build`
   * **Publish Directory**: `dist`
4. Under the **Redirects/Rewrites** tab in your Static Site's settings:
   * Add a Rewrite rule to route API traffic:
     * **Source**: `/api/*`
     * **Destination**: `https://srirangalogistics-backend.onrender.com/api/*` (Replace with your actual backend URL)
     * **Action**: `Rewrite`
   * Add a client-side routing fallback rule:
     * **Source**: `/*`
     * **Destination**: `/index.html`
     * **Action**: `Rewrite`
5. Click **Save Changes** and deploy!

---

### Option B: Hosting as a Single Unified Web Service
This approach compiles the React app and serves it directly from the Express backend in production, meaning you only need to manage and configure **one** Render service.

1. Click **New > Web Service** on Render.
2. Connect your Git repository.
3. Set the following configurations:
   * **Name**: `srirangalogistics-all`
   * **Environment**: `Node`
   * **Root Directory**: Leave blank (repo root)
   * **Build Command**: `npm install && npm run build && cd server && npm install`
   * **Start Command**: `node server/server.js`
4. Under **Advanced**, add your Environment Variables. **Make sure to set `NODE_ENV=production`** so that Express activates the static file serving middleware for the `dist` folder.
5. Click **Create Web Service** and wait for the deployment to finish!
