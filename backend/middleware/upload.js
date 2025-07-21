const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb) => {
  const allowedExt = ['.glb', '.gltf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .glb or .gltf files are allowed'));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage, fileFilter });

module.exports = upload;