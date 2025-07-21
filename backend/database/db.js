const mongoose = require('mongoose');

const Connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' MongoDB connected');
  } catch (error) {
    console.error(' MongoDB connection failed:', error);
  }
};

module.exports = Connection;
