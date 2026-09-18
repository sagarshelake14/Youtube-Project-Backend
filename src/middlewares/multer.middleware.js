import multer from "multer";
const crypto = require('crypto')

// middleware
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
      console.log("File data : ", file);
      cb(null, file.originalname);
  }
})

export const upload = multer({ 
        storage: storage 
})