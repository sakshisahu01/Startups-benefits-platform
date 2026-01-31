import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Deal } from '../models/Deal.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/startup-benefits';

const deals = [
  {
    title: 'Cloud Hosting – 12 Months Free',
    slug: 'cloud-hosting-free',
    description: 'Get 12 months of premium cloud hosting. Perfect for early-stage apps and side projects.',
    category: 'Infrastructure',
    accessLevel: 'public' as const,
    partnerName: 'CloudStart',
    partnerUrl: 'https://example.com',
    eligibility: 'Early-stage startup or indie project. One claim per company.',
    isActive: true,
  },
  {
    title: 'Analytics Pro – 50% Off Year 1',
    slug: 'analytics-pro-discount',
    description: 'Half off your first year of advanced analytics and dashboards.',
    category: 'Analytics',
    accessLevel: 'public' as const,
    partnerName: 'DataFlow',
    eligibility: 'New accounts only. Valid for teams under 10.',
    isActive: true,
  },
  {
    title: 'Marketing Suite – Verified Founders Only',
    slug: 'marketing-suite-verified',
    description: 'Full marketing suite access for verified founders. Email, ads, and landing pages.',
    category: 'Marketing',
    accessLevel: 'locked' as const,
    partnerName: 'GrowthLabs',
    eligibility: 'Verified founder status required. Must complete verification.',
    isActive: true,
  },
  {
    title: 'Productivity Stack – Free Tier Upgrade',
    slug: 'productivity-stack-upgrade',
    description: 'Upgrade to team tier free for 6 months. Tasks, docs, and calendar.',
    category: 'Productivity',
    accessLevel: 'public' as const,
    partnerName: 'TaskFlow',
    eligibility: 'Startups with fewer than 5 team members.',
    isActive: true,
  },
  {
    title: 'API Credits – Verified Teams',
    slug: 'api-credits-verified',
    description: 'Monthly API credits for AI and data services. Verification required.',
    category: 'Infrastructure',
    accessLevel: 'locked' as const,
    partnerName: 'APICredits',
    eligibility: 'Verified startup. One claim per company.',
    isActive: true,
  },
];

async function seed() {
  await connectDB(MONGODB_URI);
  await Deal.deleteMany({});
  await Deal.insertMany(deals);
  const count = await User.countDocuments();
  if (count === 0) {
    await User.create({
      email: 'demo@example.com',
      password: 'demo123',
      name: 'Demo User',
      isVerified: false,
    });
    await User.create({
      email: 'verified@example.com',
      password: 'verified123',
      name: 'Verified Founder',
      isVerified: true,
    });
  }
  console.log('Seed complete. Deals:', deals.length);
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
