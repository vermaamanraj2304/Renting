const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/renting_carnival';

mongoose.connect(MONGO_URI)
  .then(() => console.log('🔌 Connected successfully to local MongoDB.'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Schemas & Models ---

const RoleSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  permissions: [{ type: String }]
});

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true },
  mobile: { type: String },
  roles: [{ type: String }] // e.g. ['customer', 'owner', 'broker']
});

const Role = mongoose.model('Role', RoleSchema);
const User = mongoose.model('User', UserSchema);

// --- Seed Data Runner ---
const seedDatabase = async () => {
  try {
    // 1. Seed Roles
    const rolesData = [
      { name: 'customer', permissions: ['property:read'] },
      { name: 'owner', permissions: ['property:read', 'property:create', 'rent:collect'] },
      { name: 'broker', permissions: ['property:read', 'property:create', 'lead:read', 'commission:view'] }
    ];

    for (const r of rolesData) {
      await Role.findOneAndUpdate(
        { name: r.name },
        r,
        { upsert: true, new: true }
      );
    }

    // 2. Seed Default User (Aakash)
    const email = 'aakash@rentingcarnival.com';
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('aakash123', salt);
      
      const aakash = new User({
        email,
        passwordHash: hash,
        fullName: 'Aakash Verma',
        mobile: '+919999999999',
        roles: ['customer', 'owner', 'broker']
      });

      await aakash.save();
      console.log('👤 Seeded default user (Aakash) with all three roles.');
    }
    
    console.log('✨ MongoDB initialization and RBAC seed complete.');
  } catch (err) {
    console.error('❌ Seeding Failed:', err);
  }
};

// Trigger seeding on connection
mongoose.connection.once('open', seedDatabase);

module.exports = {
  mongoose,
  User,
  Role
};
