import dotenv from 'dotenv';

dotenv.config();

export default {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    CLIENT_URL: process.env.CLIENT_URL,
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DB_NAME: process.env.DATABASE,
    JWT_SECRET: process.env.JWT_SECRET || '12345QWERTY',
    JWT_ACCOUNT_ACTIVATION: process.env.JWT_ACCOUNT_ACTIVATION || 'ASDFG09876',
    JWT_RESET_PASSWORD: process.env.JWT_RESET_PASSWORD,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    EMIAL_TO: process.env.EMIAL_TO,
    EMIAL_FROM: process.env.EMIAL_FROM,
} 