const multer = require("multer");
const path = require("path");

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../fluttercar/assets");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = new Date().toISOString().replace(/[-:.]/g, "").slice(0, -5);
    const originalNameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
    const fileExtension = path.extname(file.originalname);
    const uniqueFileName = `${originalNameWithoutExt}-${uniqueSuffix}${fileExtension}`;
    cb(null, uniqueFileName);
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 7000000 },
}).array("myImages", 5);

// Middleware for handling file uploads
const uploadFileMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    console.log("Request Body:", req.body); // Log the request body after upload
    console.log("Request Files:", req.files); // Log request files after upload

    if (err instanceof multer.MulterError) {
      // Multer error
      let errorMessage;
      if (err.code === "LIMIT_FILE_SIZE") {
        errorMessage = "Error: File size exceeds the limit.";
      } else {
        console.log(err);
        errorMessage = `Error: ${err.message}`;
      }
      return res.status(400).json({ error: errorMessage });
    } else if (err) {
      // Other errors
      return res.status(400).json({ error: `Error: ${err}` });
    } else {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "Error: No File Selected!" });
      } else {
        // Continue processing or pass the files to the next middleware/controller
        next();
      }
    }
  });
};

module.exports = {
  uploadFileMiddleware,
};