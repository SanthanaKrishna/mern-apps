import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';

const config = require('config');
//routes
import authRoutes from './routes/AuthRoutes';
import userRoutes from './routes/UserRoutes';
import itemRoutes from './routes/ItemsRoutes';

const { MONGO_URI, MONGO_DB_NAME } = config;
console.log('MONGO_', MONGO_URI, MONGO_DB_NAME);


const app = express();

// CORS Middleware
app.use(cors());
// Logger Middleware
app.use(morgan('dev'));
//BodyParser Middleware
app.use(express.json());

// DB config
const db = config.get('mongoURI');

//connect to MongoDB using mongoose
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }) //Adding new mongo url parser
    .then(() => console.log('MongoDB Connected...'))
    .catch(error => console.log(error))


// User Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);


// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

export default app;
