const express = require("express");
const router = express.Router();
const fs = require("fs");
const upload = require("../middleware/upload");
const Model = require("../models/Model");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");



// POST upload - Upload 3D model file
router.post("/upload", upload.single("model"), async (req, res) => {
  try {

  if(!req.file){
   return res.status(400).json({error: "No file uploaded"})
  }
   const streamUpload = (buffer) => {
    return new Promise((resolve , rejects) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "models",
        },
        (error , result) => {
          if(result) resolve(result);
          else rejects(error);

          
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
   };
   const result = await streamUpload(req.file.buffer);

       const model = new Model({
      filename: req.file.originalname,
      url: result.secure_url,
      public_id: result.public_id,
      contentType: req.file.mimetype,
    });

    await model.save()

    res.status(201).json(model);

} catch (err) {
  console.error("Upload error:" , err);
  res.status(500).json({error: err.message})
  
}
});

// GET models - List all models
router.get("/models", async (req, res) => {
  try {
    const models = await Model.find().sort({ createdAt: -1 });
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE models/:id - Delete a model
router.delete("/models/:id", async (req, res) => {
  try {
    const model = await Model.findByIdAndDelete(req.params.id);
    if (!model) return res.status(404).json({ error: "Model not found" });

    if (model.public_id) {
      await cloudinary.uploader.destroy(model.public_id, { resource_type: "raw" });
    }

    res.json({ message: "Model deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;