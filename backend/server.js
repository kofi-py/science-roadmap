const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'science_roadmap',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration with cookies
app.use(session({
  name: 'science_roadmap_session',
  secret: process.env.SESSION_SECRET || 'science-is-awesome-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ==================== AUTHENTICATION MIDDLEWARE ====================

// Middleware to get or create user from session/cookie
const getUserFromSession = async (req, res, next) => {
  try {
    // Check if user is in session
    if (req.session.userId) {
      const result = await pool.query(
        'SELECT id, username, email FROM users WHERE id = $1',
        [req.session.userId]
      );
      if (result.rows.length > 0) {
        req.user = result.rows[0];
        return next();
      }
    }
    
    // Check for user cookie
    if (req.cookies.user_id) {
      const result = await pool.query(
        'SELECT id, username, email FROM users WHERE id = $1',
        [req.cookies.user_id]
      );
      if (result.rows.length > 0) {
        req.user = result.rows[0];
        req.session.userId = result.rows[0].id;
        return next();
      }
    }
    
    next();
  } catch (error) {
    console.error('Error in getUserFromSession:', error);
    next();
  }
};

// ==================== AUTH ROUTES ====================

// Set user session (login/register)
app.post('/api/auth/set-user', async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Get or create user
    let userResult = await pool.query(
      'SELECT id, username, email FROM users WHERE email = $1',
      [email]
    );

    let user;
    if (userResult.rows.length === 0) {
      // Create new user
      const newUserResult = await pool.query(
        'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id, username, email',
        [username || email.split('@')[0], email]
      );
      user = newUserResult.rows[0];
    } else {
      user = userResult.rows[0];
      
      // Update username if provided
      if (username && username !== user.username) {
        await pool.query(
          'UPDATE users SET username = $1 WHERE id = $2',
          [username, user.id]
        );
        user.username = username;
      }
    }

    // Set session
    req.session.userId = user.id;
    
    // Set persistent cookie (30 days)
    res.cookie('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    // Set user info cookie (accessible to frontend)
    res.cookie('user_info', JSON.stringify({
      username: user.username,
      email: user.email
    }), {
      httpOnly: false, // Frontend can read this
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error setting user:', error);
    res.status(500).json({ error: 'Failed to set user' });
  }
});

// Get current user from session
app.get('/api/auth/me', getUserFromSession, (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
    }
    res.clearCookie('science_roadmap_session');
    res.clearCookie('user_id');
    res.clearCookie('user_info');
    res.json({ success: true, message: 'Logged out' });
  });
});

// ==================== FORUM ROUTES ====================

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get all forum posts with pagination
app.get('/api/forum/posts', async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        fp.id,
        fp.title,
        fp.content,
        fp.views,
        fp.created_at,
        fp.updated_at,
        u.username as author,
        u.id as author_id,
        c.name as category_name,
        c.icon as category_icon,
        COUNT(DISTINCT fr.id) as reply_count
      FROM forum_posts fp
      LEFT JOIN users u ON fp.user_id = u.id
      LEFT JOIN categories c ON fp.category_id = c.id
      LEFT JOIN forum_replies fr ON fp.id = fr.post_id
    `;

    const params = [];
    if (category && category !== 'all') {
      query += ' WHERE c.name = $1';
      params.push(category);
    }

    query += ' GROUP BY fp.id, u.username, u.id, c.name, c.icon';
    query += ' ORDER BY fp.created_at DESC';
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM forum_posts fp';
    const countParams = [];
    if (category && category !== 'all') {
      countQuery += ' LEFT JOIN categories c ON fp.category_id = c.id WHERE c.name = $1';
      countParams.push(category);
    }
    const countResult = await pool.query(countQuery, countParams);
    const totalPosts = parseInt(countResult.rows[0].count);

    res.json({
      posts: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalPosts,
        totalPages: Math.ceil(totalPosts / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    res.status(500).json({ error: 'Failed to fetch forum posts' });
  }
});

// Get single post with replies
app.get('/api/forum/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Increment view count
    await pool.query(
      'UPDATE forum_posts SET views = views + 1 WHERE id = $1',
      [id]
    );

    // Get post details
    const postResult = await pool.query(
      `SELECT 
        fp.id,
        fp.title,
        fp.content,
        fp.views,
        fp.created_at,
        fp.updated_at,
        u.username as author,
        u.id as author_id,
        c.name as category_name,
        c.icon as category_icon
      FROM forum_posts fp
      LEFT JOIN users u ON fp.user_id = u.id
      LEFT JOIN categories c ON fp.category_id = c.id
      WHERE fp.id = $1`,
      [id]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Get replies
    const repliesResult = await pool.query(
      `SELECT 
        fr.id,
        fr.content,
        fr.helpful_count,
        fr.created_at,
        fr.updated_at,
        u.username as author,
        u.id as author_id
      FROM forum_replies fr
      LEFT JOIN users u ON fr.user_id = u.id
      WHERE fr.post_id = $1
      ORDER BY fr.created_at ASC`,
      [id]
    );

    res.json({
      post: postResult.rows[0],
      replies: repliesResult.rows
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create new forum post (uses cookies for auth)
app.post('/api/forum/posts', getUserFromSession, async (req, res) => {
  try {
    const { title, content, categoryId, username, email } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    let userId;

    // Use authenticated user from session/cookie
    if (req.user) {
      userId = req.user.id;
    } else {
      // Create anonymous user if not authenticated
      if (!email) {
        return res.status(400).json({ error: 'Email required for anonymous posts' });
      }

      let userResult = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
        const newUserResult = await pool.query(
          'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id',
          [username || email.split('@')[0], email]
        );
        userId = newUserResult.rows[0].id;
        
        // Set user in session and cookie
        req.session.userId = userId;
        res.cookie('user_id', userId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 1000 * 60 * 60 * 24 * 30,
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });
      } else {
        userId = userResult.rows[0].id;
      }
    }

    // Create post
    const postResult = await pool.query(
      `INSERT INTO forum_posts (user_id, category_id, title, content)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [userId, categoryId, title, content]
    );

    res.status(201).json({
      success: true,
      postId: postResult.rows[0].id,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Create reply to a post (uses cookies for auth)
app.post('/api/forum/posts/:id/replies', getUserFromSession, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, username, email } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    let userId;

    // Use authenticated user from session/cookie
    if (req.user) {
      userId = req.user.id;
    } else {
      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }

      let userResult = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
        const newUserResult = await pool.query(
          'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id',
          [username || email.split('@')[0], email]
        );
        userId = newUserResult.rows[0].id;
      } else {
        userId = userResult.rows[0].id;
      }
    }

    // Create reply
    const replyResult = await pool.query(
      `INSERT INTO forum_replies (post_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [id, userId, content]
    );

    res.status(201).json({
      success: true,
      replyId: replyResult.rows[0].id,
      message: 'Reply created successfully'
    });
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ error: 'Failed to create reply' });
  }
});

// Mark reply as helpful (uses cookies to prevent duplicate votes)
app.post('/api/forum/replies/:id/helpful', getUserFromSession, async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: 'Must be logged in to mark helpful' });
    }

    const userId = req.user.id;

    // Check if already marked
    const existingMark = await pool.query(
      'SELECT id FROM helpful_marks WHERE reply_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingMark.rows.length > 0) {
      // Remove mark
      await pool.query(
        'DELETE FROM helpful_marks WHERE reply_id = $1 AND user_id = $2',
        [id, userId]
      );
      await pool.query(
        'UPDATE forum_replies SET helpful_count = helpful_count - 1 WHERE id = $1',
        [id]
      );
      res.json({ success: true, action: 'removed' });
    } else {
      // Add mark
      await pool.query(
        'INSERT INTO helpful_marks (reply_id, user_id) VALUES ($1, $2)',
        [id, userId]
      );
      await pool.query(
        'UPDATE forum_replies SET helpful_count = helpful_count + 1 WHERE id = $1',
        [id]
      );
      res.json({ success: true, action: 'added' });
    }
  } catch (error) {
    console.error('Error marking helpful:', error);
    res.status(500).json({ error: 'Failed to mark helpful' });
  }
});

// ==================== PROGRESS ROUTES ====================

// Get user progress (uses cookies)
app.get('/api/progress', getUserFromSession, async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ progress: [] });
    }

    const progressResult = await pool.query(
      'SELECT course_id, completed, completed_at FROM user_progress WHERE user_id = $1',
      [req.user.id]
    );

    res.json({ progress: progressResult.rows });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Update course progress (uses cookies)
app.post('/api/progress', getUserFromSession, async (req, res) => {
  try {
    const { courseId, completed } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'courseId required' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Must be logged in to save progress' });
    }

    const userId = req.user.id;

    // Upsert progress
    await pool.query(
      `INSERT INTO user_progress (user_id, course_id, completed, completed_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, course_id)
       DO UPDATE SET 
         completed = $3,
         completed_at = $4`,
      [userId, courseId, completed, completed ? new Date() : null]
    );

    res.json({ success: true, message: 'Progress updated' });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// ==================== PREFERENCES ROUTES ====================

// Set user preference cookie
app.post('/api/preferences/theme', (req, res) => {
  const { theme } = req.body;
  
  res.cookie('theme_preference', theme, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  
  res.json({ success: true });
});

// Set last visited page cookie
app.post('/api/preferences/last-page', (req, res) => {
  const { page } = req.body;
  
  res.cookie('last_visited', page, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  
  res.json({ success: true });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    cookies: {
      session: !!req.session.userId,
      user: !!req.cookies.user_id
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Science Roadmap API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log('Cookie-based authentication enabled');
});

module.exports = app;
