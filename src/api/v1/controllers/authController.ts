import { Request, Response } from "express"
import bcrypt from 'bcrypt';
import User from "../models/userModel";
import { generateJwt } from "../utils/jwt";

const controller = {
    register: async (req: Request, res: Response) => {
        const { email, password, name } = req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.status(400).json({ error: 'Email already exists' });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ email, password: hashedPassword, name });
            await user.save();

            const token = generateJwt({ userId: user._id.toString(), email: user.email, role: user.role });
            res.status(201).json({ token, user: { email: user.email, name: user.name, role: user.role } });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Server error' });
        }
    },
    login: async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }

            const token = generateJwt({ userId: user._id.toString(), email: user.email, role: user.role });
            res.json({ token, user: { email: user.email, name: user.name, role: user.role } });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

}

export default controller