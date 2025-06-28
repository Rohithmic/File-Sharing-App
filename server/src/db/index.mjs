import mongoose from "mongoose";
import { DB_NAME } from "../constant.mjs";
import dotenv from "dotenv"

dotenv.config();

const connectDB=async ()=>{
    try {
        // Use MONGODB_URI (standard) or MONGODB_URL as fallback
        const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;
        
        if (!mongoUri) {
            console.error("MongoDB URI not found in environment variables");
            process.exit(1);
        }
        
        // If the URI already includes a database name, use it as is
        // Otherwise, append the DB_NAME
        const connectionString = mongoUri.includes('/') && mongoUri.split('/').length > 3 
            ? mongoUri 
            : `${mongoUri}/${DB_NAME}`;
            
        const connectionInstance = await mongoose.connect(connectionString);
        console.log(`MongoDB connected at host: ${connectionInstance.connection.host}`);
      } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
      }
}
export default connectDB;

