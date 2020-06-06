import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

import config from '../config';
import { User } from '../models/User';
import { response } from 'express';


const { JWT_SECRET, JWT_ACCOUNT_ACTIVATION,
    EMAIL_USER, EMAIL_PASS, EMIAL_FROM, EMIAL_TO,
    CLIENT_URL,
    SENDGRID_API_KEY
} = config;


/**
 * @route ['POST'] api/auth/register
 * @description Register new user
 * @access Public
 */
export const SignupUser = async (req, res) => {
    const { name, email, password } = req.body;

    //res checking validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        const user = await User.findOne({ email });
        if (user) {
            throw Error('Email already exists');
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
 * @route ['POST'] api/auth/register
 * @description Register new user
 * @access Public
 */
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        //Check for existing user
        const user = await User.findOne({ email });
        if (user) throw Error('Email already exists');

        const token = jwt.sign({ name, email, password }, JWT_ACCOUNT_ACTIVATION, { expiresIn: '15m' });
        if (!token) throw Error(`Couldn't send activation link`);

        return res.status(200).json({
            user: {
                name
            },
            activationLink: `${CLIENT_URL}/auth/activate/${token}`
        });
    } catch (error) {
        res.status(400).json({ error: 'REGISTER: ' + error });
    }
};

/**
 * @route ['POST'] api/auth/account-activation
 * @description Activate your new account for email verification 
 * @access Public
 */
export const accountActivation = async (req, res) => {
    const { token } = req.body;
    try {
        const tokenVerify = await jwt.verify(token, JWT_ACCOUNT_ACTIVATION);

        const decode = jwt.decode(token);
        const { name, email, password } = decode;

        const user = await User.findOne({ email });
        if (user) throw Error('Account Already Activated. Please Signin');

        const newUser = new User({
            name,
            email,
            password
        });
        const savedUser = await newUser.save();

        const tokenResult = jwt.sign({ _id: savedUser._id }, JWT_SECRET, { expiresIn: 3600 });
        if (!tokenResult) throw Error('Something went wrong saving the user');

        return res.status(200).json({
            message: 'User Saved successfully',
            newAccount: true,
            token: tokenResult,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        });
    } catch (error) {
        return res.status(400).json({
            error: 'ACTIVATION:  ' + error
        })
    };
}

/**
 * @route ['POST'] api/auth/login
 * @description Authenticate user
 * @access Public
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        //Check for existing user
        console.log('email login', email)
        const user = await User.findOne({ email });

        console.log('user find', user);
        if (!user) throw Error('Email Does not exist');

        //authenticate method from user model schema
        if (!user.authenticate(password)) throw Error('Email or password incorrect');

        //generate a token ans send to client
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: 3600 }); //3600 ms = 1 hour
        console.log('token sign', token)
        if (!token) throw Error('Couldnt sign the token');

        const { _id, name, role } = user;

        return res.status(200).json({
            token,
            user: {
                _id,
                name,
                email: user.email,
                role
            }
        });
    } catch (error) {
        res.status(400).json({ error: 'LOGIN: ' + error });
    };
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