const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
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
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ==================== AUTHENTICATION MIDDLEWARE ====================

// Middleware to check for user session via cookie
const getUserFromCookie = async (req, res, next) => {
  const userId = req.cookies.userId;
  
  if (userId) {
    try {
      const result = await pool.query(
        'SELECT id, username, email FROM users WHERE id = $1',
        [userId]
      );
      
      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    } catch (error) {
      console.error('Error fetching user from cookie:', error);
    }
  }
  
  next();
};

// Apply middleware to all routes
app.use(getUserFromCookie);

// ==================== AUTH ROUTES ====================

// Login or create user (sets HTTP cookie)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // Get or create user
    let userResult = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE email = $1',
      [email]
    );

    let user;
    if (userResult.rows.length === 0) {
      // Create new user
      const newUserResult = await pool.query(
        'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id, username, email, created_at',
        [username || 'Anonymous', email]
      );
      user = newUserResult.rows[0];
    } else {
      user = userResult.rows[0];
      
      // Update username if provided and different
      if (username && username !== user.username) {
        const updateResult = await pool.query(
          'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, email, created_at',
          [username, user.id]
        );
        user = updateResult.rows[0];
      }
    }

    // Set HTTP-only cookie with user ID (expires in 30 days)
    res.cookie('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Set username cookie (accessible by client for display)
    res.cookie('username', user.username, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout (clear cookies)
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('userId');
  res.clearCookie('username');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Get current user from cookie
app.get('/api/auth/me', (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
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

    // Get replies with helpful marks for current user
    const repliesQuery = `
      SELECT 
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
      ORDER BY fr.created_at ASC
    `;
    
    const repliesResult = await pool.query(repliesQuery, [id, req.user?.id || null]);

    res.json({
      post: postResult.rows[0],
      replies: repliesResult.rows
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create new forum post (requires authentication via cookie)
app.post('/api/forum/posts', async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Create post
    const postResult = await pool.query(
      `INSERT INTO forum_posts (user_id, category_id, title, content)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [req.user.id, categoryId, title, content]
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

// Create reply to a post (requires authentication via cookie)
app.post('/api/forum/posts/:id/replies', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content required' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Create reply
    const replyResult = await pool.query(
      `INSERT INTO forum_replies (post_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [id, req.user.id, content]
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

// Mark reply as helpful (requires authentication via cookie)
app.post('/api/forum/replies/:id/helpful', async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if already marked
    const existingMark = await pool.query(
      'SELECT id FROM helpful_marks WHERE reply_id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (existingMark.rows.length > 0) {
      // Remove mark
      await pool.query(
        'DELETE FROM helpful_marks WHERE reply_id = $1 AND user_id = $2',
        [id, req.user.id]
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
        [id, req.user.id]
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

// Get user progress (from authenticated cookie)
app.get('/api/progress', async (req, res) => {
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

// Update course progress (requires authentication via cookie)
app.post('/api/progress', async (req, res) => {
  try {
    const { courseId, completed } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'courseId required' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Upsert progress
    await pool.query(
      `INSERT INTO user_progress (user_id, course_id, completed, completed_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, course_id)
       DO UPDATE SET 
         completed = $3,
         completed_at = $4`,
      [req.user.id, courseId, completed, completed ? new Date() : null]
    );

    res.json({ success: true, message: 'Progress updated' });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Get user statistics (requires authentication)
app.get('/api/user/stats', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get completed courses count
    const progressResult = await pool.query(
      'SELECT COUNT(*) as completed_count FROM user_progress WHERE user_id = $1 AND completed = true',
      [req.user.id]
    );

    // Get forum posts count
    const postsResult = await pool.query(
      'SELECT COUNT(*) as posts_count FROM forum_posts WHERE user_id = $1',
      [req.user.id]
    );

    // Get forum replies count
    const repliesResult = await pool.query(
      'SELECT COUNT(*) as replies_count FROM forum_replies WHERE user_id = $1',
      [req.user.id]
    );

    res.json({
      completedCourses: parseInt(progressResult.rows[0].completed_count),
      forumPosts: parseInt(postsResult.rows[0].posts_count),
      forumReplies: parseInt(repliesResult.rows[0].replies_count),
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    authenticated: !!req.user,
    user: req.user || null
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
  console.log(`CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;
