const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const orgAuthRoutes = require('./routes/orgAuth');
const volunteerAuthRoutes = require('./routes/volunteerAuth');
const tasksRoutes = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api/org', orgAuthRoutes);
app.use('/api/volunteer', volunteerAuthRoutes);
app.use('/api/auth', orgAuthRoutes);
app.use('/api/tasks', tasksRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('MongoDB connected');
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
