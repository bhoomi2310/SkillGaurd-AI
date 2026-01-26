import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const testBackend = async () => {
  try {
    console.log('🧪 Testing Backend Configuration...\n');

    // Test environment variables
    console.log('📋 Environment Variables:');
    const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
    const optionalVars = ['GOOGLE_CLIENT_ID', 'AZURE_OPENAI_ENDPOINT', 'AZURE_OPENAI_API_KEY'];
    
    let allGood = true;
    requiredVars.forEach(varName => {
      if (process.env[varName]) {
        console.log(`  ✅ ${varName}: Set`);
      } else {
        console.log(`  ❌ ${varName}: MISSING`);
        allGood = false;
      }
    });

    optionalVars.forEach(varName => {
      if (process.env[varName]) {
        console.log(`  ✅ ${varName}: Set`);
      } else {
        console.log(`  ⚠️  ${varName}: Not set (optional)`);
      }
    });

    if (!allGood) {
      console.log('\n❌ Missing required environment variables!');
      process.exit(1);
    }

    // Test database connection
    console.log('\n🔌 Testing Database Connection...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('  ✅ Database connected successfully');

    // Test User model
    console.log('\n👤 Testing User Model...');
    const userCount = await User.countDocuments();
    console.log(`  ✅ User model working (${userCount} users in database)`);

    // Test demo users
    console.log('\n🔍 Checking Demo Users...');
    const demoUsers = await User.find({
      email: { $in: ['student@demo.com', 'provider@demo.com', 'recruiter@demo.com'] }
    });
    
    if (demoUsers.length === 0) {
      console.log('  ⚠️  No demo users found. Run: npm run seed:demo');
    } else {
      console.log(`  ✅ Found ${demoUsers.length} demo user(s)`);
      demoUsers.forEach(user => {
        console.log(`     - ${user.email} (${user.role})`);
      });
    }

    console.log('\n✅ Backend is ready!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Backend test failed:', error.message);
    process.exit(1);
  }
};

testBackend();
