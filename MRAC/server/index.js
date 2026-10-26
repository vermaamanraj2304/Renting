require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role } = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors());
app.use(express.json());

// --- Helper: Fetch permissions mapping for roles from MongoDB ---
const getPermissionsForRoles = async (roles) => {
  if (!roles || roles.length === 0) return [];
  try {
    const matchedRoles = await Role.find({ name: { $in: roles } });
    const permissionsSet = new Set();
    matchedRoles.forEach(r => {
      if (r.permissions) {
        r.permissions.forEach(p => permissionsSet.add(p));
      }
    });
    return Array.from(permissionsSet);
  } catch (err) {
    console.error('Error fetching permissions for roles:', err);
    return [];
  }
};

// --- Middleware: Verify Token & Populate Req.User ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token is invalid or expired' });
    }
    req.user = user;
    next();
  });
};

// --- Middleware: Enterprise Guard for Permissions (RBAC) ---
const authorize = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized user context' });
    }

    const hasPermission = req.user.permissions.includes(requiredPermission);
    if (!hasPermission) {
      return res.status(403).json({ 
        error: `Forbidden: Low clearance. Need '${requiredPermission}' permission.` 
      });
    }
    next();
  };
};

// --- AUTH ROUTE: User Registration ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, mobile, role = 'customer' } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      passwordHash,
      fullName,
      mobile,
      roles: [role]
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// --- AUTH ROUTE: User Login ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const permissions = await getPermissionsForRoles(user.roles);

    // Sign JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
        permissions: permissions
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Logged in successfully',
      token: token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
        permissions: permissions
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// --- AUTH ROUTE: Forgot Password Simulation ---
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  res.json({ 
    message: 'OTP Code successfully dispatched to email', 
    debugOtpCode: '123456' 
  });
});

// --- AUTH ROUTE: Verify OTP ---
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

  if (otp === '123456') {
    res.json({ message: 'OTP verification successful. You can reset your password.' });
  } else {
    res.status(400).json({ error: 'Invalid OTP code' });
  }
});

// --- DYNAMIC DATA: Dynamic Role-Based Dashboard endpoint ---
app.get('/api/dashboard', authenticateToken, (req, res) => {
  const { roles } = req.user;
  
  const dashboardData = {
    user: req.user.fullName,
    timestamp: new Date().toISOString(),
    roles: roles,
    data: {}
  };

  if (roles.includes('customer')) {
    dashboardData.data.customer = {
      savedItems: 24,
      applicationsSent: 5,
      bookings: 2,
      activeRental: 1,
      rewardPoints: 680,
      activities: [
        { id: 1, text: "Comfort Coliving PG Application submitted", time: "Just Now" },
        { id: 2, text: "Booking Confirmed for Cozy Coliving Space", time: "1 hour ago" }
      ],
      recommendations: [
        { name: "Comfort Stay PG", price: "₹8,600", rating: 3.5 },
        { name: "Urban Stay Coliving", price: "₹18,600", rating: 4.8 }
      ]
    };
  }

  if (roles.includes('owner')) {
    dashboardData.data.owner = {
      properties: 8,
      occupied: 6,
      vacant: 2,
      monthlyRentalIncome: 99999,
      pendingRent: 58600
    };
  }

  if (roles.includes('broker')) {
    dashboardData.data.broker = {
      activeListing: 8,
      newLeads: 6,
      siteVisit: 2,
      dealsClosed: 9,
      monthContribution: 58600,
      leadsOverview: {
        new: 12,
        contacted: 8,
        siteVisitScheduled: 5,
        negotiation: 3
      },
      recentLeads: [
        { name: "Amit Verma", type: "2 BHK in HSR Saket", status: "New" },
        { name: "Vikram Singh", type: "PG in Vasant Kunj", status: "Contacted" }
      ],
      commissions: {
        previous: 2318,
        pending: 2318,
        totalThisYear: 2318
      },
      topPerformers: [
        { name: "Sunrise Apartment", val: "₹10,000" },
        { name: "Green View Residency", val: "₹15,000" }
      ]
    };
  }

  res.json(dashboardData);
});

// --- PROTECTED ACTION: Create Property Listing ---
app.post('/api/properties', authenticateToken, authorize('property:create'), (req, res) => {
  const { title, location, rent } = req.body;
  res.status(201).json({ 
    message: 'Property listed successfully under active profile',
    property: { title, location, rent, createdBy: req.user.email }
  });
});

// --- PROTECTED ACTION: Read Leads (Broker Only) ---
app.get('/api/leads', authenticateToken, authorize('lead:read'), (req, res) => {
  res.json({
    message: 'Active Broker Leads retrieved successfully',
    leads: [
      { id: 101, client: 'Amit Verma', status: 'New', detail: '2 BHK Saket' },
      { id: 102, client: 'Neha Singh', status: 'Contacted', detail: '1 RK Laxmi Nagar' }
    ]
  });
});

// --- PROTECTED ACTION: Read Commissions (Broker Only) ---
app.get('/api/commissions', authenticateToken, authorize('commission:view'), (req, res) => {
  res.json({
    previousCommission: 2318,
    pendingCommission: 2318,
    totalThisYear: 2318
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Renting Carnival Server (MongoDB Mode) is running at: http://localhost:${PORT}`);
});
