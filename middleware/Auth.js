import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

import config from '../config';
import { User } from '../models/User';

const { JWT_SECRET } = config;

export const auth = (req, res, next) => {
    const token = req.header('x-auth-token');

    //check for token
    if (!token) {
        return res.status(401).json({ message: 'No token,authorization denied' });
    }

    try {
        // Verify Token
        const decoded = jwt.verify(token, JWT_SECRET);
        // Add user from payload
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};


/**
 * middleware
 */
export const requireSignin = expressJwt({
    secret: JWT_SECRET //req.user._id
})


/**
 * 
 */
export const adminMiddleware = (req, res, next) => {
    try {
        const user = User.findById({ _id: req.user._id });
        if (user.role !== 'admin') throw Error('Admin resource. Access denied');

        req.profile = user;
        next();

    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}