import 'express-async-errors'; import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express'; import mongoose from 'mongoose'; import helmet from 'helmet'; import cors from 'cors';
import cookieParser from 'cookie-parser'; import rateLimit from 'express-rate-limit'; import { ZodError } from 'zod'; import bcrypt from 'bcryptjs';
import routes from './routes'; import { User } from './models';
for (const k of ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL']) if (!process.env[k]) throw new Error(`Missing env var ${k}`);
const app = express();
app.use(helmet()); app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); app.use(express.json({ limit: '1mb' })); app.use(cookieParser());
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use('/api', routes);
app.use((err: any, _q: Request, res: Response, _n: NextFunction) => {
  if (err instanceof ZodError) return res.status(400).json({ message: 'Validation failed', errors: err.flatten().fieldErrors });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  console.error(err); res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Server error' : err.message });
});
mongoose.connect(process.env.MONGODB_URI!).then(async () => {
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && !(await User.findOne({ role: 'admin' })))
    await User.create({ name: 'Admin', email: process.env.ADMIN_EMAIL, password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12), role: 'admin' });
  app.listen(+(process.env.PORT || 5000), () => console.log('API on :' + (process.env.PORT || 5000)));
});
