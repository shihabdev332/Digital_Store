import multer from 'multer';

/**
 * @desc    Configure storage for uploaded files
 * @details Files will be stored with their original name. 
 * Using diskStorage allows more control over files.
 */
const storage = multer.diskStorage({
  // In diskStorage, you can also define 'destination' if needed
  filename: function (req, file, callback) {
    // Generate a unique suffix to prevent file name collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    callback(null, uniqueSuffix + '-' + file.originalname);
  }
});

/**
 * @desc    Filter files by type (Optional but recommended)
 */
const fileFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image/')) {
    callback(null, true);
  } else {
    callback(new Error('Only images are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit: 5MB
  }
});

export default upload;