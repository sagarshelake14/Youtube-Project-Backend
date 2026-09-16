import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"    // it is used for refreshtoken
import bcrypt from "bcrypt"      // it used for hash password

const userSchema = new Schema(
         {
                  username: {
                           type: String,
                           required: true,
                           unique: true,
                           lowercase: true,
                           trim: true,
                           index: true,   // it is used for searching think first you want to use
                  },       // beacause of index username field would be searchable
                  email: {
                           type: String,
                           required: true,
                           unique: true,
                           lowercase: true,
                           trim: true,
                  },
                  fullName: {
                           type: String,
                           required: true,
                           trim: true,
                           index: true,
                  },
                  avatar: {
                           type: String,     // cloudinary Url
                           required: true,
                  },
                  coverImage: {
                           type: String,     // cloudinary Url
                  },
                  watchHistory: [            // watchHistory would be array of objects  
                           {
                                    type: Schema.Types.ObjectId,   // watchHistory is depends on video
                                    ref: "Video"
                           }
                  ],
                  password: {        // standard practice is password stored in the form of encrypted 
                           type: String,
                           required: [true, "Passowrd is required"],
                  },
                  refreshToken: {
                           type: String,
                  }
         },
         { timestamps: true }
);

// pre() it is hook used in middleware that execute just  before storing
userSchema.pre("save", async function (next)  {    // arrow function is not allowed
        // encryption and decryption are process are time consuming so that we use async await
        // next () is flag that passes to next middleware
         if(!this.isModified("password"))  return next()

         this.password = bcrypt.hash(this.password, 10); //(field, rounds)
         next();
});

// custom methods
// it solve the problem that encrypted passsword stored in database with user 12344 passowrd
userSchema.methods.isPasswordCorrect = async function (password){  
        return await bcrypt.compare(password, this.password);
}


userSchema.methods.generateAccessToken = function(){          // json web token  -> it is creating sessions                                                   it not stores in database
    return jwt.sign(
        {                     // payload
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,    // token         it handles sessions + cookies
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY       // token expiry
        }
    )
}

userSchema.methods.generateRefreshtoken = function () {    // refresh token   it stores in database
        return jwt.sign(        // payload
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,       // token
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY    // token expiry
        }
    )
}    

export const User = mongoose.model("User", userSchema);