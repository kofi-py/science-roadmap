const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: !process.env.DATABASE_URL ? (process.env.DB_USER || 'postgres') : undefined,
  host: !process.env.DATABASE_URL ? (process.env.DB_HOST || 'localhost') : undefined,
  database: !process.env.DATABASE_URL ? (process.env.DB_NAME || 'science_roadmap') : undefined,
  password: !process.env.DATABASE_URL ? (process.env.DB_PASSWORD || 'postgres') : undefined,
  port: !process.env.DATABASE_URL ? (process.env.DB_PORT || 5432) : undefined,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
  console.error('WARNING: DATABASE_URL is not set. The server will attempt to connect to localhost, which will fail on Render.');
}

// Root route to prevent 404 during deployment health checks
app.get('/', (req, res) => {
  res.json({ message: 'Science Roadmap API is active', version: '1.0.0' });
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again later.' }
});

const forumLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 forum posts/replies per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many forum interactions, please try again later.' }
});

// Middleware
app.use(helmet()); // Basic security headers
app.use(morgan('dev')); // Structured logging
app.use(globalLimiter); // Apply global rate limit to all requests
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration with cookies
app.use(session({
  name: 'science_roadmap_session', // Custom cookie name
  secret: process.env.SESSION_SECRET || 'science-is-awesome-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  proxy: true, // Required for secure cookies on Render/Heroku
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Allow cross-site cookies in production
  }
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Session: ${req.session?.userId || 'none'}`);
  next();
});

// ==================== AUTH MIDDLEWARE ====================

// Middleware to check if user is authenticated via session
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Middleware to optionally get user from session
const optionalAuth = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const result = await pool.query(
        'SELECT id, username, email FROM users WHERE id = $1',
        [req.session.userId]
      );
      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
  next();
};

// ==================== AUTH ROUTES ====================

// Login/Register route (creates or gets user and sets session cookie)
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
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
        [username || 'Scientist', email]
      );
      user = newUserResult.rows[0];
    } else {
      user = userResult.rows[0];
    }

    // Set session
    req.session.userId = user.id;
    req.session.email = user.email;

    // Also set a separate cookie for client-side access (non-sensitive data)
    res.cookie('user_info', JSON.stringify({
      username: user.username,
      email: user.email
    }), {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: false, // Allow JavaScript to read this cookie
      sameSite: 'lax'
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      message: 'Logged in successfully'
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout route (clears session and cookies)
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('science_roadmap_session');
    res.clearCookie('user_info');
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Get current user from session
app.get('/api/auth/me', optionalAuth, (req, res) => {
  if (req.user) {
    res.json({ user: req.user, authenticated: true });
  } else {
    res.json({ user: null, authenticated: false });
  }
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
app.get('/api/forum/posts', optionalAuth, async (req, res) => {
  try {
    const { category, page = 1, limit = 20, search } = req.query;
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
    const conditions = [];

    if (category && category !== 'all') {
      params.push(category);
      conditions.push(`c.name = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(fp.title ILIKE $${params.length} OR fp.content ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY fp.id, u.username, u.id, c.name, c.icon';
    query += ' ORDER BY fp.created_at DESC';
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) 
      FROM forum_posts fp
      LEFT JOIN categories c ON fp.category_id = c.id
    `;
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await pool.query(countQuery, params.slice(0, conditions.length));
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
app.get('/api/forum/posts/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Increment view count (only if not the author viewing their own post)
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

    // Get replies with helpful marks from current user
    const repliesResult = await pool.query(
      `SELECT 
        fr.id,
        fr.content,
        fr.helpful_count,
        fr.created_at,
        fr.updated_at,
        u.username as author,
        u.id as author_id,
        CASE WHEN hm.id IS NOT NULL THEN true ELSE false END as marked_helpful_by_user
      FROM forum_replies fr
      LEFT JOIN users u ON fr.user_id = u.id
      LEFT JOIN helpful_marks hm ON fr.id = hm.reply_id AND hm.user_id = $2
      WHERE fr.post_id = $1
      ORDER BY fr.created_at ASC`,
      [id, req.user?.id || null]
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

// Create new forum post (requires authentication)
app.post('/api/forum/posts', requireAuth, forumLimiter, async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

    // Create post using session userId
    const postResult = await pool.query(
      `INSERT INTO forum_posts (user_id, category_id, title, content)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [req.session.userId, categoryId, title, content]
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

// Create reply to a post (requires authentication)
app.post('/api/forum/posts/:id/replies', requireAuth, forumLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content required' });
    }

    // Create reply using session userId
    const replyResult = await pool.query(
      `INSERT INTO forum_replies (post_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [id, req.session.userId, content]
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

// Mark reply as helpful (requires authentication)
app.post('/api/forum/replies/:id/helpful', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

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

// Get user progress (uses session authentication)
app.get('/api/progress', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const progressResult = await pool.query(
      'SELECT course_id, completed, completed_at FROM user_progress WHERE user_id = $1',
      [userId]
    );

    res.json({ progress: progressResult.rows });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Update course progress (requires authentication)
app.post('/api/progress', requireAuth, async (req, res) => {
  try {
    const { courseId, completed } = req.body;
    const userId = req.session.userId;

    if (!courseId) {
      return res.status(400).json({ error: 'courseId required' });
    }

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

// ==================== COOKIE PREFERENCE ROUTES ====================

// Set user preferences in cookies
app.post('/api/preferences', (req, res) => {
  try {
    const { theme, notifications, emailUpdates } = req.body;

    const preferences = {
      theme: theme || 'light',
      notifications: notifications !== false,
      emailUpdates: emailUpdates !== false
    };

    // Set preference cookie (non-httpOnly so JS can read it)
    res.cookie('user_preferences', JSON.stringify(preferences), {
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      httpOnly: false,
      sameSite: 'lax'
    });

    res.json({ success: true, preferences });
  } catch (error) {
    console.error('Error setting preferences:', error);
    res.status(500).json({ error: 'Failed to set preferences' });
  }
});

// Get user preferences from cookies
app.get('/api/preferences', (req, res) => {
  try {
    const preferences = req.cookies.user_preferences
      ? JSON.parse(req.cookies.user_preferences)
      : { theme: 'light', notifications: true, emailUpdates: true };

    res.json({ preferences });
  } catch (error) {
    console.error('Error getting preferences:', error);
    res.json({
      preferences: { theme: 'light', notifications: true, emailUpdates: true }
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    cookies_enabled: true,
    session_active: !!req.session.userId
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
  console.log(`Cookies enabled: HTTP-only session cookies + user preference cookies`);
});

module.exports = app;
