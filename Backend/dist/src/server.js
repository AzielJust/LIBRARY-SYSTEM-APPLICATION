import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { config } from './config/config.js';

import authRoutes from './routes/auth.route.js'
import bookRoutes from './routes/book.route.js';
import transactionRoutes from './routes/transaction.route.js'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/transaction', transactionRoutes)


app.get('/', (req, res) => {
    res.send('Welcome to the Library System Backend API');
});

app.listen(PORT, async (req, res) => {
    await connectDB();
    console.log("Server started at http://localhost:" + PORT);
});