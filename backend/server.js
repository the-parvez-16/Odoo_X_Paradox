// backend/server.js

const authRoutes = require('./routes/auth');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', authRoutes); // /api/login, /api/signup

// 🔹 Get all approved events
app.get('/api/events', async (req, res) => {
  try {
    const events = await pool.query("SELECT * FROM events WHERE status = 'approved' ORDER BY datetime ASC");
    res.json(events.rows);
  } catch (err) {
    console.error('Database error on /api/events:', err.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// 🔹 Create a new event (status = pending)
app.post('/api/events', async (req, res) => {
  try {
    const { user_id, title, description, category, location, datetime } = req.body;
    await pool.query(
      "INSERT INTO events (user_id, title, description, category, location, datetime, status) VALUES ($1, $2, $3, $4, $5, $6, 'pending')",
      [user_id, title, description, category, location, datetime]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// 🔹 RSVP to an event
app.post('/api/rsvp', async (req, res) => {
  try {
    const { event_id, name, email, phone, num_guests } = req.body;
    await pool.query(
      "INSERT INTO attendees (event_id, name, email, phone, num_guests) VALUES ($1, $2, $3, $4, $5)",
      [event_id, name, email, phone, num_guests]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit RSVP' });
  }
});

// This will serve index.html from public folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/src/HTML/login.html'));
});

// Serve signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/src/HTML/signup.html'));
});

// 🔹 Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
