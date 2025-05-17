import { Request, Response } from "express"
import bcrypt from 'bcrypt';
import User from "../models/userModel";
import { generateJwt } from "../utils/jwt";

const controller = {
    register: async (req: Request, res: Response) => {
        const { email, password, fullName } = req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.status(400).json({ error: 'Email already exists' });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ email, password: hashedPassword, fullName });
            await user.save();

            const token = generateJwt({ userId: user._id.toString(), email: user.email, role: user.role });
            res.status(201).json({ token, user: { _id: user._id, email: user.email, name: user.fullName, role: user.role } });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Server error' });
        }
    },
    login: async (req: Request, res: Response) => {
        const { identifier, password } = req.body;
        try {
            const user = await User.findOne({
                $or: [{ email: identifier }, { username: identifier }]
            });

            if (!user) {
                return res.status(401).json({ error: 'Invalid email/username or password' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid email/username or password' });
            }

            const token = generateJwt({
                userId: user._id.toString(),
                email: user.email,
                role: user.role
            });

            return res.json({
                token,
                user: {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    fullName: user.fullName,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

}

export default controller