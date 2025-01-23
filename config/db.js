import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDb = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB connected: ${con.connection.host}`.bgGreen.black);
    } catch (err) {
        console.log(err);
    }
};

export default connectDb;