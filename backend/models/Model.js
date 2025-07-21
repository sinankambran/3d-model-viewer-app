const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String },
  public_id: { type: String },
  contentType: { type: String },
  createdAt: { type: Date, default: Date.now }
},{
   timestamps: true
});
module.exports = mongoose.model("Model", modelSchema);