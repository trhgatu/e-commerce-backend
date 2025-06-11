// services/authService.ts
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import { generateJwt } from '../utils/jwt';

export const register = async (email: string, password: string, fullName: string) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, fullName });
    await user.save();

    const token = generateJwt({
        userId: user._id.toString(),
        email: user.email,
        roleId: user.roleId?.toString()
    });

    return {
        token,
        user: {
            _id: user._id,
            email: user.email,
            name: user.fullName,
            role: user.roleId
        }
    };
};

export const login = async (identifier: string, password: string) => {
    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    }).populate('roleId', 'name permissions');

    if (!user) throw new Error('Invalid email/username or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email/username or password');

    const token = generateJwt({
        userId: user._id.toString(),
        email: user.email,
        roleId: user.roleId?._id.toString()
    });

    return {
        token,
        user: {
            _id: user._id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            roleId: user.roleId,
        }
    };
};
