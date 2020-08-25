import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import _ from 'lodash';
import config from '../config';
import { User } from '../models/User';


const { JWT_SECRET, JWT_ACCOUNT_ACTIVATION,
    EMAIL_USER, EMAIL_PASS, EMIAL_FROM, EMIAL_TO,
    CLIENT_URL,
    JWT_RESET_PASSWORD,
    SENDGRID_API_KEY
} = config;


/**
 * @route ['POST'] api/auth/register
 * @param {name, email, password} req 
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
 * @param {name, email, password} req
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

        res.status(200).json({
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
 * @param {token} req
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
        if (!savedUser) throw Error('Something went wrong saving the user');

        const tokenResult = jwt.sign({ _id: savedUser._id }, JWT_SECRET, { expiresIn: 3600 });
        if (!tokenResult) throw Error('Something went wrong saving the user');

        res.status(200).json({
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
 * @param {email, password} req
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

        res.status(200).json({
            token,
            user: {
                id: _id,
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


/**
 * @route ['PUT'] api/auth/forgot-password
 * @param {email} req
 * @description forgot user password
 * @access Private
 */
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        //Check for existing user
        const user = await User.findOne({ email });
        if (!user) throw Error('User with that email does not exist');

        const token = jwt.sign({ _id: user._id, name: user.name }, JWT_RESET_PASSWORD, { expiresIn: '15m' });
        if (!token) throw Error(`Couldn't send activation link`);

        //send respone wheather email send link
        // const updated = user.updateOne({ resetPasswordLink: token });
        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                console.log('RESET PASSWORD LINK ERROR', err);
                return res.status(400).json({
                    error: 'Database connection error on user password forgot request'
                });
            } else {
                res.status(200).json({
                    activationLink: `${CLIENT_URL}/auth/password/reset/${token}`
                })
            }
        });
    } catch (error) {
        res.status(400).json({ error: error });
    }
}

/**
 * @route ['PUT'] api/auth/reset-password
 * @param {resetPasswordLink, newPassword} req
 * @description reset user password
 * @access Private
 */
export const resetPassword = async (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;
    console.log('resetPassword', req.body)
    if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, JWT_RESET_PASSWORD, function (err, decoded) {
            if (err) {
                return res.status(400).json({
                    error: 'Expired link. Try again'
                });
            }

            User.findOne({ resetPasswordLink }, (err, user) => {
                console.log('error++++', err, user)
                if (err || !user) {
                    return res.status(400).json({
                        error: 'Something went wrong. Try later'
                    });
                }

                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                };

                user = _.extend(user, updatedFields);

                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'Error resetting user password'
                        });
                    }
                    res.json({
                        message: `Great! Now you can login with your new password`
                    });
                });
            });
        });
    }
    // try {
    //     if (resetPasswordLink) {
    //         const decode = jwt.verify(resetPasswordLink, JWT_RESET_PASSWORD);
    //         if (!decode) throw Error('Expired link. Try again');

    //         const user = await User.findOne({ resetPasswordLink });
    //         const updatedFields = {
    //             password: newPassword,
    //             resetPasswordLink: ''
    //         };
    //         if (user) {
    //             user = _.extend(user, updatedFields);
    //         }
    //         user.save();
    //         res.json({
    //             message: 'pasword has been changes you can login now'
    //         })
    //     }
    // } catch (error) {
    //     res.status(400).json({ error: error })
    // }
};
