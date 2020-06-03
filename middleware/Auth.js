import jwt from 'jsonwebtoken';
import config from '../config';

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