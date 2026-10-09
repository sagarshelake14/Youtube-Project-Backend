import multer from "multer";
import crypto from "crypto"

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


// middleware name: upload
export const upload = multer({ 
        storage: storage 
})