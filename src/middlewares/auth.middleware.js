// It checks only user is present or not ?

import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, _, next) => {
        try {
          const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
         // getting token from cookies or header

          if(!token){    // token is present or not ?
                   throw new ApiError(401, "Unauthorized Request")
          }
 
          const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)  // accessing decoded token
 
          const user = await User.findById(decodedToken?._id)
          .select("-password -refreshToken")     // getting user by using decoded token _id information without password and refreshtoken
 
          if(!user){
                   // TODO : discussion in next part
                   throw new ApiError(401, "Invalid access token");
          }
 
          req.user = user;   // new req.user added new user 
          next();  // next() flag to pass next method

        } catch (error) {
                  throw new ApiError(401, error?.message || "Invalid Access Token")
        }
         
})


