import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; 


import dns from 'node:dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])


const connectDB = async () => {
         try {
                  // connectionInstanse variable is holding response of database connections
                  const connectionInstanse = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
                  console.log(`\n MongoDB connected !! DB HOST : ${connectionInstanse.connection.host}`);
         } catch (error) {
                  console.log("MONGODB connection FAILED ", error);
                  // node js provide process access whenever application runs on process 
                  process.exit(1);
         }
}

export default connectDB;