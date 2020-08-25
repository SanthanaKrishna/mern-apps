import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';

import config from './config';

//routes
import authRoutes from './routes/AuthRoutes';
import userRoutes from './routes/UserRoutes';
import itemRoutes from './routes/ItemsRoutes';

const { MONGO_URI, MONGO_DB_NAME, PORT, NODE_ENV } = config;
console.log('MONGO_', PORT, NODE_ENV);


const app = express();

/**App Middleware */
// CORS Middleware
app.use(cors());  // allow all origins
// Logger Middleware
app.use(morgan('dev'));
//BodyParser Middlewar  e
app.use(express.json());

// DB config
const db = MONGO_URI

//connect to MongoDB using mongoose
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }) //Adding new mongo url parser
    .then(() => console.log('MongoDB Connected...'))
    .catch(error => console.log('MongoDB error', error))


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/items', itemRoutes);


// if(process.eventNames.NODE_ENV === 'development'){
//     app.use(cors({orgin : 'http://localhost:3000'}));
// }

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

export default app;
