//require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import connectDB from "./db/index.js";


dotenv.config({
         path: './env'
});

connectDB()



/*
import express from 'express'
const app = express();

// Below approch is also good
// function connectDB () {}

// connectDB();


// Use IIFE funtion (immediately invoked function expression)
// ; this is only for cleaning purpose beacause whenever no. of of IIFE functions gets problem so semicolon seperate all IIFE functions

;( async () => {
         try {
                  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
                  app.on("Errror", (error) => {
                           console.log("ERROR: ", error);
                           throw error;
                  })

                  app.listen(process.env.PORT, () => {
                           console.log(`app listening on port ${process.env.PORT}`);
                  })
         } catch (error) {
                  console.error("ERROR: ", error);
                  throw err;
         }
}) ();

*/