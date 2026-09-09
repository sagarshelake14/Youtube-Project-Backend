// this is app.js file it is used for express for routing
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({                            // cors related configuration
         origin: process.env.CORS_ORIGIN,
         credentials: true
}));


app.use(express.json({limit: "16kb"}));    // json data related configuration   when data comes in form of json 


app.use(express.urlencoded({extended: true, limit: "16kb"}));   //extended: true -> nested object   
// the data is comes from url so that related configuration are here   


app.use(express.static("public"))   
/* that configuration is related about storing pdf, images, on local server   
express.static("public")  -> storing pdf, images in public folder it creating public assets
*/

app.use(cookieParser());  // cookieParser related configuration

export { app } 