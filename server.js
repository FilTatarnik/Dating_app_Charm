require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.userId;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};


// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, dateOfBirth } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (email, password, name, date_of_birth) VALUES ($1, $2, $3, $4) RETURNING id',
      [email, hashedPassword, name, dateOfBirth]
    );
    const token = generateToken(newUser.rows[0].id);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

//Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user.rows[0].id);
    
    // Send user data along with the token
    res.json({ 
      token,
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        name: user.rows[0].name,
        profileCompleted: user.rows[0].profile_completed || false
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET profile route
app.get('/api/profile', verifyToken, async (req, res) => {
  try {
    console.log('Fetching profile for user ID:', req.userId); // Add this log
    const user = await pool.query(
      'SELECT id, email, name, date_of_birth, bio, gender, orientation, location FROM users WHERE id = $1',
      [req.userId]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('Sending profile data:', user.rows[0]); // Add this log
    res.json(user.rows[0]);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT profile update route
app.put('/api/profile', verifyToken, async (req, res) => {
  try {
    console.log('Received profile update request:', req.body);
    const { bio, gender, orientation, location, profileCompleted } = req.body;
   
    // Construct the SQL query dynamically based on the fields provided
    let updateFields = [];
    let values = [];
    let valueIndex = 1;

    if (bio !== undefined) {
      updateFields.push(`bio = $${valueIndex}`);
      values.push(bio);
      valueIndex++;
    }
    if (gender !== undefined) {
      updateFields.push(`gender = $${valueIndex}`);
      values.push(gender);
      valueIndex++;
    }
    if (orientation !== undefined) {
      updateFields.push(`orientation = $${valueIndex}`);
      values.push(orientation);
      valueIndex++;
    }
    if (location !== undefined) {
      updateFields.push(`location = $${valueIndex}`);
      values.push(location);
      valueIndex++;
    }
    // Add profileCompleted to the update fields if it's provided
    if (profileCompleted !== undefined) {
      updateFields.push(`profile_completed = $${valueIndex}`);
      values.push(profileCompleted);
      valueIndex++;
    }

    // Add the user ID as the last parameter
    values.push(req.userId);

    const updateQuery = `
      UPDATE users
      SET ${updateFields.join(', ')}
      WHERE id = $${valueIndex}
      RETURNING id, email, name, date_of_birth, bio, gender, orientation, location, profile_completed
    `;

    const result = await pool.query(updateQuery, values);
   
    console.log('Profile update result:', result.rows[0]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in profile update:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});


app.post('/api/photos', verifyToken, async (req, res) => {
  try {
    const { url } = req.body;
    const newPhoto = await pool.query(
      'INSERT INTO photos (user_id, url) VALUES ($1, $2) RETURNING *',
      [req.userId, url]
    );
    res.json(newPhoto.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/matches/potential', verifyToken, async (req, res) => {
  try {
    const potentialMatches = await pool.query(
      'SELECT id, name, bio FROM users WHERE id != $1 AND id NOT IN (SELECT liked_user_id FROM likes WHERE user_id = $1)',
      [req.userId]
    );
    res.json(potentialMatches.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/matches/like', verifyToken, async (req, res) => {
  try {
    const { likedUserId } = req.body;
    await pool.query(
      'INSERT INTO likes (user_id, liked_user_id) VALUES ($1, $2)',
      [req.userId, likedUserId]
    );
    // Check if it's a match
    const match = await pool.query(
      'SELECT * FROM likes WHERE user_id = $1 AND liked_user_id = $2',
      [likedUserId, req.userId]
    );
    if (match.rows.length > 0) {
      await pool.query(
        'INSERT INTO matches (user1_id, user2_id) VALUES ($1, $2)',
        [req.userId, likedUserId]
      );
      res.json({ message: 'It\'s a match!' });
    } else {
      res.json({ message: 'Like recorded' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/matches', verifyToken, async (req, res) => {
  try {
    const matches = await pool.query(
      'SELECT u.id, u.name FROM users u JOIN matches m ON (u.id = m.user1_id OR u.id = m.user2_id) WHERE (m.user1_id = $1 OR m.user2_id = $1) AND u.id != $1',
      [req.userId]
    );
    res.json(matches.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/messages', verifyToken, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const newMessage = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, receiverId, content]
    );
    res.json(newMessage.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/messages/:partnerId', verifyToken, async (req, res) => {
  try {
    const { partnerId } = req.params;
    const messages = await pool.query(
      'SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY created_at ASC',
      [req.userId, partnerId]
    );
    res.json(messages.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});