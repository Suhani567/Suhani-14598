const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path'); // ← add this
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

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    // Point to the React/Vite build folder
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    
    // Handle any other routes and serve index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));