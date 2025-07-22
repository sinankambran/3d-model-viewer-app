require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const modelRoutes = require('./routes/modelRoutes');

const app = express();

const allowedOrigins = [
   process.env.VITE_CLIENT_URL,
];

app.use(cors({
origin: function (origin, callback) {
 if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE'],
}));


app.use(express.json());
// app.use('/model', express.static(path.join(__dirname, 'uploads')));
app.use('/', modelRoutes);

mongoose.connect(process.env.MONGO_URI ,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

  module.exports = app;