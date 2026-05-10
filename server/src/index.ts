import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI =
  process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/my-agency';

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

async function start(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`API http://localhost:${PORT}`);
  });
}

start().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
