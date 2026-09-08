//this is index.js file it is main file that load first
//require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import connectDB from "./db/index.js";    // most of case extension is important
import app from './app.js'


dotenv.config({             // configure dotenv
         path: './env'
});

connectDB()  // here database is connected but our application is not listening 
//and server is not start yet

/*
upar database connection huva hai pr hamare application ne uuse database ka use karte hue listen nahi kara hai isliye 
*/
.then(() => {
         app.listen(process.env.PORT || 8000, () => {
                  console.log(`Server is running at post ${process.env.PORT}`);
         })
})
.catch((err) => {
         console.log("MONGO db connection failed  !!!", err);
})


/*
import mongoose from 'mongoose'
import express from 'express'
import { DB_NAME } from './constants.js';
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