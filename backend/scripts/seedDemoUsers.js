import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const demoUsers = [
  {
    name: 'Demo Student',
    email: 'student@demo.com',
    password: 'demo123',
    role: 'student',
    onboardingCompleted: true,
    profile: {
      bio: 'Demo student account for testing WorkMark features',
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      institution: 'Demo University',
      year: 'Senior',
      location: 'San Francisco, CA',
    },
  },
  {
    name: 'Demo Provider',
    email: 'provider@demo.com',
    password: 'demo123',
    role: 'provider',
    onboardingCompleted: true,
    profile: {
      bio: 'Demo provider account for posting tasks',
      company: 'Demo Tech Company',
      location: 'New York, NY',
    },
  },
  {
    name: 'Demo Recruiter',
    email: 'recruiter@demo.com',
    password: 'demo123',
    role: 'recruiter',
    onboardingCompleted: true,
    profile: {
      bio: 'Demo recruiter account for searching candidates',
      company: 'Demo Recruitment Agency',
      location: 'Austin, TX',
    },
  },
];

const seedDemoUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing demo users
    await User.deleteMany({
      email: { $in: demoUsers.map(u => u.email) },
    });
    console.log('Cleared existing demo users');

    // Create demo users
    for (const userData of demoUsers) {
      const user = await User.create(userData);
      console.log(`Created demo user: ${user.email} (${user.role})`);
    }

    console.log('\n✅ Demo users seeded successfully!');
    console.log('\nDemo Credentials:');
    demoUsers.forEach(user => {
      console.log(`  ${user.role}: ${user.email} / ${user.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding demo users:', error);
    process.exit(1);
  }
};

seedDemoUsers();
