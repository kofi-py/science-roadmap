# Science Roadmap - Complete Learning Platform

A comprehensive science learning platform with Next.js, Tailwind CSS, Express.js, Node.js, and PostgreSQL.

## 🔬 Features

- **90 Curated Science Courses** from kindergarten through graduate level
- **20 Learning Levels** across all science disciplines
- **Full-Stack Forum** with PostgreSQL database
- **Progress Tracking** with user authentication
- **Interactive Diagnostic Test**
- **Real-time Course Search**
- **Science-Themed Design** with electric cyan, neon green, fusion purple

## 🎨 Color Palette

**Deep Space Blue** (#0A1128) - Cosmos, depth
**Electric Cyan** (#00D9FF) - Energy, chemistry
**Neon Green** (#39FF14) - Biology, life
**Fusion Purple** (#B24BF3) - Physics, quantum

## 📁 Project Structure

```
science-roadmap/
├── backend/              # Express.js API + PostgreSQL
│   ├── server.js        # Main API server
│   ├── schema.sql       # Database schema
│   ├── package.json
│   └── .env.example
├── frontend/            # Next.js 14 + Tailwind
│   ├── src/
│   │   ├── app/        # Next.js app router
│   │   ├── components/ # React components
│   │   ├── lib/        # Utilities
│   │   └── data/       # Course data (90 courses)
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. Install PostgreSQL and create database:
```bash
createdb science_roadmap
```

2. Navigate to backend and install dependencies:
```bash
cd backend
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Initialize database:
```bash
npm run init-db
```

5. Start backend server:
```bash
npm run dev
```

Backend runs on http://localhost:5000

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
npm install
```

2. Create .env.local:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

3. Start development server:
```bash
npm run dev
```

Frontend runs on http://localhost:3000

## 🗄️ Database Schema

**Tables:**
- `users` - User accounts
- `categories` - Forum categories
- `forum_posts` - Forum discussions
- `forum_replies` - Replies to posts
- `user_progress` - Course completion tracking
- `helpful_marks` - Helpful reply tracking

## 🎯 API Endpoints

**Forum:**
- `GET /api/categories` - Get all categories
- `GET /api/forum/posts` - Get posts with pagination
- `GET /api/forum/posts/:id` - Get single post with replies
- `POST /api/forum/posts` - Create new post
- `POST /api/forum/posts/:id/replies` - Create reply
- `POST /api/forum/replies/:id/helpful` - Mark reply helpful

**Progress:**
- `GET /api/progress/:email` - Get user progress
- `POST /api/progress` - Update course progress

## 📚 Course Levels

1. **K-2**: Science Foundations
2. **3-5**: Elementary Science
3. **6-8**: Middle School (Life, Earth, Physical)
4. **9-12**: High School (Biology, Chemistry, Physics)
5. **College**: Advanced topics, specializations

## 🎨 Design System

**Components use Tailwind classes:**
- `gradient-text-science` - Cyan→Purple→Green gradient
- `science-card` - Glowing hover effects
- `btn-primary` - Cyan/Purple gradient button
- `glow-on-hover` - Neon glow effects

## 🔐 Security Notes

- User authentication via email (no passwords for MVP)
- Input sanitization on all endpoints
- CORS configured for frontend URL
- SQL injection prevention with parameterized queries

## 📝 Free Science Resources Used

- Khan Academy
- MIT OpenCourseWare
- PhET Interactive Simulations
- NASA Education
- NOAA Education
- Crash Course
- HHMI BioInteractive
- OpenStax
- And many more!

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS 3
- TypeScript
- Axios

**Backend:**
- Express.js
- Node.js
- PostgreSQL
- CORS

## 📦 Production Deployment

**Backend (Heroku/Railway/Render):**
```bash
git push heroku main
```

**Frontend (Vercel):**
```bash
vercel --prod
```

Update API_URL in frontend .env to production backend URL.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file

## 🙏 Acknowledgments

- All free science education providers
- Open source community
- Scientific research community

## 🍪 HTTP Cookies Implementation

This platform uses **HTTP-only cookies** for secure session management!

### Cookie Types:
1. **Session Cookie** (HTTP-only) - Secure authentication, cannot be accessed by JavaScript
2. **User Info Cookie** - Non-sensitive user data for UI (username, email)
3. **Preferences Cookie** - Theme, notifications, etc.

### Security Features:
- ✅ **HttpOnly** - Session cookie protected from XSS
- ✅ **Secure** - HTTPS only in production
- ✅ **SameSite=Lax** - CSRF protection
- ✅ **7-day expiration** - Automatic logout
- ✅ **withCredentials** - Cookies sent with every API call

### How It Works:

**Backend (Express):**
```javascript
// Session stored in HTTP-only cookie
req.session.userId = user.id;

// Protected routes
app.post('/api/forum/posts', requireAuth, handler);
```

**Frontend (Next.js):**
```typescript
// Cookies automatically sent!
await forumAPI.createPost(title, content, categoryId);

// Read non-sensitive data
const user = cookieUtils.getUserInfo();
```

**No manual token management needed!** The browser automatically:
- Sends cookies with every request
- Stores cookies securely
- Handles expiration

See **COOKIES-GUIDE.md** for complete documentation.

