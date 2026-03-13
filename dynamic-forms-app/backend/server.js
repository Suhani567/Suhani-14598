const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/forms', require('./routes/api/forms'));
app.use('/api/submissions', require('./routes/api/submissions'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
