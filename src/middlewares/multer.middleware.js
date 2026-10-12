import multer from "multer";
import path from "path";
import fs from "fs";

// Create the temporary upload directory if it does not exist
const uploadDir = path.resolve("public/temp");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    console.log(
      "Receiving file:",
      file.fieldname,
      file.originalname
    );

    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
});