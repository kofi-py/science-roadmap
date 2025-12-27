# Quick Start with HTTP Cookies

## 🍪 5-Minute Cookie Setup

### Step 1: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```bash
DB_USER=postgres
DB_HOST=localhost
DB_NAME=science_roadmap
DB_PASSWORD=your_password
SESSION_SECRET=your-super-secret-random-string-min-32-characters
FRONTEND_URL=http://localhost:3000
```

Initialize database:
```bash
createdb science_roadmap
npm run init-db
```

Start server:
```bash
npm run dev
```

### Step 2: Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start Next.js:
```bash
npm run dev
```

### Step 3: Test Cookies

Open browser to `http://localhost:3000`

**Login:**
1. Enter username and email
2. Open DevTools → Application → Cookies
3. You should see:
   - `science_roadmap_session` (HttpOnly ✓)
   - `user_info` (readable)

**Test Protected Route:**
```javascript
// In browser console
fetch('http://localhost:5000/api/progress', {
  credentials: 'include' // Sends cookies!
})
.then(r => r.json())
.then(console.log);
```

## ✅ Verify Cookie Security

### Check Session Cookie:
```bash
curl -c cookies.txt -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Scientist","email":"test@example.com"}'

# Check cookie file
cat cookies.txt
```

### Test Protected Endpoint:
```bash
# Without cookies (should fail)
curl http://localhost:5000/api/progress

# With cookies (should succeed)
curl -b cookies.txt http://localhost:5000/api/progress
```

## 🔒 Security Checklist

- [x] HttpOnly session cookie (prevents XSS)
- [x] SameSite=Lax (prevents CSRF)
- [x] CORS with credentials
- [x] 7-day expiration
- [x] Secure flag in production
- [ ] HTTPS in production (required!)
- [ ] Strong session secret set

## 🎯 Common Issues

**Cookies not working?**

1. Check CORS config in backend
2. Verify `withCredentials: true` in frontend
3. Ensure domains match (both localhost)
4. Check browser doesn't block cookies

**401 Unauthorized?**

1. Login first via `/api/auth/login`
2. Check cookie exists in DevTools
3. Verify cookie hasn't expired
4. Check `withCredentials` is set

## 📱 Using Cookies in Frontend

```typescript
import { authAPI, cookieUtils, forumAPI } from '@/lib/api';

// Login (sets cookie)
await authAPI.login('MyName', 'me@example.com');

// Read user info from cookie (no API call!)
const user = cookieUtils.getUserInfo();
console.log(user); // { username, email }

// Make authenticated request (cookie sent automatically!)
await forumAPI.createPost('Title', 'Content', 1);

// Logout (clears cookies)
await authAPI.logout();
```

## 🚀 Production Deployment

**Backend (Heroku/Railway):**
```bash
# Set environment variables
SESSION_SECRET=<generate-random-32-char-string>
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

**Frontend (Vercel):**
```bash
NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com
```

**Important:** HTTPS is required for secure cookies in production!

## 📚 Learn More

- See `COOKIES-GUIDE.md` for detailed documentation
- Check `server-with-cookies.js` for implementation
- Review `src/lib/api.ts` for frontend utilities
