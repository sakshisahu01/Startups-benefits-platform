import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import dealsRoutes from './routes/deals.js';
import claimsRoutes from './routes/claims.js';

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/startup-benefits';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('Missing JWT_SECRET in environment');
  process.exit(1);
}

async function main() {
  await connectDB(MONGODB_URI);
  const app = express();
  app.use(
    cors({
      origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        /^http:\/\/localhost(:\d+)?$/,
        /^http:\/\/127\.0\.0\.1(:\d+)?$/,
      ],
      credentials: true,
    })
  );
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/deals', dealsRoutes);
  app.use('/api', claimsRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Not found' } });
  });

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
