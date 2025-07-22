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

const storage = multer.diskStorage()



const upload = multer({ storage, fileFilter ,limits: { fileSize: 50 * 1024 * 1024}, });

module.exports = upload;