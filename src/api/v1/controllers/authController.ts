import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import { generateJwt } from '../utils/jwt';

interface AuthResponse {
  user: { _id: string; email: string; name: string };
  token: string;
}

interface ErrorResponse {
  message: string;
}

const controller = {
  register: async (req: Request, res: Response<AuthResponse | ErrorResponse>) => {
    const { email, password, name } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword, name });
      await user.save();

      const token = generateJwt({ userId: user._id.toString(), email: user.email, role: user.role });
      res.status(201).json({
        user: { _id: user._id.toString(), email: user.email, name: user.name },
        token,
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  login: async (req: Request, res: Response<AuthResponse | ErrorResponse>) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateJwt({ userId: user._id.toString(), email: user.email, role: user.role });
      res.json({
        user: { _id: user._id.toString(), email: user.email, name: user.name },
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

export default controller;