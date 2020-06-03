import dotenv from 'dotenv';

dotenv.config();

export default {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://sandy123:sandy@cluster0-8avnp.mongodb.net/test?retryWrites=true&w=majority',
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    JWT_SECRET: process.env.JWT_SECRET || 'mernapp_JwtSecret'
} 