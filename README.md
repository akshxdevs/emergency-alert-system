# 🚨 Emergency Alert System – Real-Time Crisis Notification & Safety Automation

A robust, scalable **Web2 emergency alert system** designed to broadcast critical notifications to users instantly during emergencies such as accidents, natural disasters, fire hazards, medical crises, and safety threats.

The system ensures rapid, reliable, and multi-channel alert delivery with real-time monitoring, admin controls, and automated escalation policies.

---

# 🌐 Live Deployment

**✅ Application Running on Production**

* **Frontend URL:** `https://alertsystem.akshxdevs.com`
* **Environment:** Production / Staging
* **Tech Stack:** Node.js, Express, Prisma, Postgres, WebSockets, REST API, React

Your system is live and ready for operational use.

---

# 🚀 Overview

The Emergency Alert System provides an **instant-alert platform** built for schools, communities, enterprises, and public environments.

It delivers real-time alerts to:

* Mobile devices(comming soon)
* Web dashboards
* Admin panels
* Email/SMS channels (optional integrations)

The system prioritizes **low latency**, **high reliability**, and **fail-safe delivery**, making it ideal for high-risk environments.

---

# 🔧 Key Features

### Instant Alerts

* Real-time push alerts using WebSockets
* Broadcast to all connected users within milliseconds
* Supports “critical priority” alerts that override normal notifications

### Safety Automation

* Automated escalation (e.g., if no admin response within X minutes)
* Alert grouping & clustering to avoid duplicate spam
* Smart geolocation targeting for specific zones or buildings

### System Security

* Role-based access control (RBAC)
* Secure admin endpoints
* Audit logs for every alert sent
* Session tracking & suspicious activity detection

### Admin Capabilities

* One-click emergency broadcast
* Multi-channel alert routing
* Alert templates for quick usage
* Live monitoring dashboard

---

# 📋 System Modules

### 1. `sendAlert`

Core function to broadcast emergency alerts across all channels.

**Key logic:**

```ts
// Broadcasts alert to all connected clients
io.emit("alert", {
  type: alertType,
  message,
  timestamp: Date.now(),
});
```

### 2. `registerUser`

Handles user registration and subscription to alerts.

### 3. `adminOverride`

Allows verified admins to override alerts or cancel false alarms.

---

# 🛡️ How the Alert System Ensures Safety

### The Problem: Delayed or Missed Alerts

Traditional systems suffer from:

* Delivery delays
* Overloaded servers
* Missed notifications
* Manual errors

### The Solution: Real-Time, Automated, Multi-Channel Delivery

Our system ensures:

1. **Instant Delivery**
   WebSocket-based push system ensures alerts reach users without delay.

2. **No Single Point of Failure**
   Redundant delivery paths prevent message loss.

3. **Automated Escalation**
   If an alert is not acknowledged, system automatically notifies backup handlers.

4. **Geo-Targeted Messages**
   Alerts sent only to users in affected regions.

---

# 🏗️ Architecture

### Application Structure

```
emergency-alert-system/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Alert & user controllers
│   │   ├── routes/           # API routes
│   │   ├── models/           # MongoDB models
│   │   ├── websocket/        # Real-time engine
│   │   └── utils/            # Helper utilities
│   └── server.js             # Express server + WebSocket layer
├── frontend/
│   ├── src/                  # React UI
│   ├── public/
│   └── package.json
└── README.md
```

### Tech Stack

* **Backend:** Node.js, Express, Postgres, Prisma
* **Frontend:** React / Next.js
* **Real-Time:** Socket.IO
* **Authentication:** JWT-based
* **Deployment:** Vercel / Render / AWS / Railway

---

# 🚀 Quick Start

### Prerequisites

* Node.js `18+`
* Postgres locally or cloud (Postgres Atlas)
* Prisma
* Yarn or npm
* Any modern browser

### Installation

1. **Clone repository**

```bash
git clone https://github.com/akshxdevs/emergency-alert-system
cd emergency-alert-system
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd frontend
npm install
```

4. **Run backend**

```bash
npm run dev
```

5. **Run frontend**

```bash
npm start
```

---

# 📝 Usage Examples

### Sending an Emergency Alert (Admin Panel)

```ts
await axios.post("/api/alert/send", {
  message: "Fire detected in Block A. Evacuate immediately.",
  type: "CRITICAL",
});
```

### Listening for Alerts (Client)

```ts
socket.on("alert", (data) => {
  showAlertPopup(data.message);
});
```

### Registering a User

```ts
await axios.post("/api/users/register", {
  username: "akash",
  notifyChannels: ["web", "email"],
});
```

---

# 🔍 Testing

### Tests include:

* WebSocket broadcast tests
* REST API tests
* Admin authentication tests
* Rate-limiting / security tests
* Integration tests for end-to-end alert flow

### Running tests

```bash
npm test
```

---

# 🛠️ Configuration

### Backend `.env`

```
PORT=5000
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_secret
```

### Frontend `.env`

```
REACT_APP_API_URL=http://localhost:5000
```

---

# 🔐 Security Considerations

### System Security

* JWT-secured routes
* Token expiration logic
* API rate-limiting
* IP throttling
* Audit trail for all critical actions

### Best Practices

* Always secure `.env` files
* Use HTTPS in production
* Restrict admin privileges
* Monitor suspicious activity logs

---

# 🤝 Contributing

We welcome contributions!
Follow these steps:

1. Fork repo
2. Create a feature branch
3. Commit changes
4. Push and open a PR

---

# 📄 License

This project is licensed under the MIT License.
See the `LICENSE` file for more details.

---

# ⚠️ Disclaimer

This software is provided *“as is”*.
No warranties or guarantees of any kind.
Use responsibly in real-world safety-critical environments.

---

# 📊 Project Stats

* **Type:** Web2 Real-Time Emergency Alert System
* **Backend:** Node.js + Express
* **Frontend:** React
* **Database:** Postgres
* **Focus:** Speed · Reliability · Safety

---
