import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler} from "../utils/asyncHandler.js"
import { request } from "express";
import jwt from "jsonwebtoken"

// To generate access and refresh token using custom methods
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

// Register user
const registerUser = asyncHandler ( async (req, res) => {
      //   ******** Register User *********

    // get user details from frontend
    // validation - not Empty 
    // check if user is already exist  - email, username
    // check for images, check for avatar
    // upload them to clodinary - avatar
    // create user object  - create entry in db
    // remove password and refresh token field from response
    // Check for user creation
    // return response

      const { fullName, email, username, password} = req.body // if data is in form of form-data, json then use req.body
      //console.log("email: ", email);

      if(
        [fullName, email, username, password].some((field) => 
        field?.trim() === "")
      ) {
        throw new ApiError(400, "All fields are required")
      }

      const existedUser = await User.findOne({
          $or: [{ username }, { email }]
      })
      //console.log(existedUser);


      if(existedUser){
          throw new ApiError(409, "User with email or username already exists")
      }

      const avatarLocalPath = req.files?.avatar[0]?.path
      //console.log(avatarLocalPath);
      //const coverImageLocalPath = req.files?.coverImage[0]?.path
       //console.log(req.files);

       let coverImageLocalPath;

       if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
              coverImageLocalPath = req.files.coverImage[0].path
       }


      if(!avatarLocalPath){
          throw new ApiError(400, "Avatar file is required");
      }

      const avatar = await uploadOnCloudinary(avatarLocalPath);
      const coverImage = await uploadOnCloudinary(coverImageLocalPath);

      if(!avatar){
          throw new ApiError(400, "Avatar file is required")
      }

      const user = await User.create({
          fullName,
          avatar: avatar.url,
          coverImage: coverImage?.url || "",
          email,
          password,
          username: username.toLowerCase()
      })

      const createdUser = await User.findById(user._id).select(
          "-password -refreshToken"
      )

      if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
      }

      return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
      )

} )

// login user
const loginUser = asyncHandler(async (req, res) => {
    // TODOS

     // req.body => data
     // username and email
     // find the user
     // password check 
     // access and refresh token
     // send cookie

    const {email, username, password} = req.body
    console.log(email);
    

    if(!username && !email){    // check if username or email is present or not ?
        // username and password must be required
        throw new ApiError(400, "username or email is required");
    }

    // here is alternatively of code based on logical discussion
    // if(!(username || email)){      // username and password two options madhe ek field
    //     throw new ApiError(400, "username or email is required");
    // }

    const user = await User.findOne({
      $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")

    //console.log(loggedInUser);
    

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
            user: loggedInUser, accessToken, refreshToken
        },
        "User logged In Successfully"
      )
    )

})

//logout User
const logoutUser = asyncHandler(async (req, res) => {
    //Todos
    // cookies clear
    // But clear refresh token from user data that is called logout


    //User.findOne()// email or password
    //User.findById()  // userId

    await User.findByIdAndUpdate(
      req.user._id,
      {
          $set: {refreshToken: undefined}
      },
      {
          new: true
      }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))


})


const refreshAccessToken =  asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken  // getting refresh token from cookies or body also

    if(incomingRefreshToken){
        throw new ApiError(401, "unAuthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        // verify incomingRefreshToken by using jwt
    
        const user = await User.findById(decodedToken?._id);
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired and used")
        }
        
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }

})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
}