import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDb from './config/db.js';
import authRoute from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cors from 'cors';
import path from 'path'
// import { fileURLToPath } from 'url';

const app = express();

connectDb();

// const __filename = fileURLToPath(import.meta.url);

dotenv.config();

const allowedOrigins = [
    'http://localhost:3000',
    'https://ecommerce-app-5dgy.onrender.com',
];

app.use(cors({
    origin: allowedOrigins,
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
    credentials: true, // Enable credentials if needed
}));
app.use(express.json());
app.use(morgan('dev'))
// app.use(express.static(path.join(__dirname, './client/build')))


// app.use('*', function (req, res) {
//     res.sendFile(path.join(__dirname, '/client/build/index.html'))
// })

app.options('*', cors());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, '/client/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, 'client', 'build', 'index.html'))
    })
} else {
    app.get('/', (req, res) => {
        res.send('API is running...')
    })
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.bgCyan.black);
})