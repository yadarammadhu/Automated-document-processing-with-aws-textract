require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uploadRoute = require('./routes/upload');
const documentRoutes = require('./routes/documentRoutes');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/upload', uploadRoute);
app.use('/documents', documentRoutes);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

