import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import config from '../config';
import { User } from '../models/User';


const { JWT_SECRET } = config;

/**
 * @route ['POST'] api/auth/register
 * @description Register new user
 * @access Public
 */
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    //res checking validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        const user = await User.findOne({ email });
        if (user) {
            throw Error('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        if (!salt) throw Error('Something went wrong with bcrypt');

        const hash = await bcrypt.hash(password, salt);
        if (!hash) throw Error('Something went wrong hashing the password');

        const newUser = new User({
            name,
            email,
            password: hash
        });

        const savedUser = await newUser.save();
        if (!savedUser) throw Error('Something went wrong saving the user');

        const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: 3600 });

        res.status(200).json({
            token,
            user: {
                id: savedUser.id,
                name: savedUser.name,
                email: savedUser.email
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


/**
 * @route ['POST'] api/auth/login
 * @description Authenticate user
 * @access Public
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    //field validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        //Check for existing user
        const user = await User.findOne({ email });
        if (!user) throw Error('User Does not exist');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw Error('Invalid credentials');
        console.log('Login', JWT_SECRET, user);
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
        if (!token) throw Error('Couldnt sign the token');

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


/**
 * @route ['GET'] api/auth/user
 * @description Get user data
 * @access Private
 * req : x-auth-token
 */
export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) throw Error('User Does not exist');
        res.json(user);
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
};