import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Request, Response } from 'express';

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash: hash, name });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '8h' });
  res.json({ accessToken: token, user: { id: user._id, email } });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '8h' });
  res.json({ accessToken: token, user: { id: user._id, email } });
};
