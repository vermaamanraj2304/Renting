# Renting Carnival - Design Breakdown & Dynamic RBAC Engine

This project contains the original exported Figma images alongside a full-stack running prototype implementation of the **Renting Carnival** onboarding flow and dynamic role-based dashboards.

---

## 📂 Project Architecture

```
MRAC/
├── app/                                 # React + Vite Client Application
│   ├── src/
│   │   ├── App.jsx                      # Main app rendering logic & states
│   │   ├── index.css                    # Unified premium layout stylesheets & utilities
│   │   └── main.jsx
│   └── package.json
│
├── server/                              # Node.js + Express + SQLite Backend Server
│   ├── db.js                            # DB initialization and RBAC tables seed script
│   ├── index.js                         # API endpoints and RBAC Middleware guards
│   └── package.json
│
├── README.md
├── figma_analysis.md                    # Detailed breakdown of Figma screens
└── renting_carnival_design_rbac_hinglish.md # Consolidated guide in Hinglish
```

---

## ⚙️ How to Run the Applications

Both systems are already initialized and configured. You can start them manually with the following commands:

### 1. Start Node.js Express Backend
The backend runs on **[http://localhost:5001](http://localhost:5001)**. It sets up the SQLite database mapping users to roles (`customer`, `owner`, `broker`) and permissions (`property:read`, `property:create`, `lead:read`, `commission:view`).

```bash
cd server
npm run start   # or: node index.js
```

### 2. Start React + Vite Client
The React application runs on **[http://localhost:5173](http://localhost:5173)**. It is built to simulate the exact dynamic dashboards.

```bash
cd app
npm run dev
```

---

## 🔒 Enterprise RBAC Mechanism

### Many-To-Many Database Mapping
The system maps users to dynamic roles. For example, a single user profile (like **Aakash Verma**) can have the `customer`, `owner`, and `broker` roles mapped concurrently. Permissions are mapped to roles, and resolved into a flat set in the JWT token payload.

### JWT Token Security
```json
{
  "id": "usr_aakash",
  "fullName": "Aakash Verma",
  "roles": ["customer", "owner", "broker"],
  "permissions": [
    "property:read",
    "property:create",
    "lead:read",
    "commission:view"
  ]
}
```

### API Endpoint Clearance Guards
Routes are guarded via Express middlewares checking granular permissions:
```javascript
app.post('/api/properties', authenticateToken, authorize('property:create'), (req, res) => { ... });
app.get('/api/leads', authenticateToken, authorize('lead:read'), (req, res) => { ... });
```
