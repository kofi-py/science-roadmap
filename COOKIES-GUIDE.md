# HTTP Cookies Implementation Guide

## Overview

The Science Roadmap platform uses HTTP cookies for secure session management and user preferences. This implementation follows security best practices including HttpOnly cookies, SameSite protection, and proper CORS configuration.

## Cookie Types Used

### 1. **Session Cookie (HTTP-Only)**
**Name:** `science_roadmap_session`
**Purpose:** Secure session management and authentication
**Security:** HttpOnly, Secure (HTTPS in production), SameSite=Lax
**Lifespan:** 7 days
**Access:** Server-side only (cannot be read by JavaScript)

This cookie stores the session ID that maps to user data on the server. It's the most secure way to handle authentication.

### 2. **User Info Cookie (Readable)**
**Name:** `user_info`
**Purpose:** Store non-sensitive user information for client-side access
**Security:** SameSite=Lax
**Lifespan:** 7 days
**Access:** Client and server (JavaScript can read)
**Contents:** `{ username, email }`

This allows the frontend to display user information without making API calls.

### 3. **User Preferences Cookie (Readable)**
**Name:** `user_preferences`
**Purpose:** Store user UI preferences
**Security:** SameSite=Lax
**Lifespan:** 1 year
**Access:** Client and server (JavaScript can read)
**Contents:** `{ theme, notifications, emailUpdates }`

## Backend Implementation

### Express.js Configuration

```javascript
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Enable CORS with credentials
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // CRITICAL: Allows cookies
}));

app.use(cookieParser());

// Session middleware
app.use(session({
  name: 'science_roadmap_session',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    httpOnly: true, // Prevents XSS attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax' // CSRF protection
  }
}));
```

### Authentication Flow

**Login/Register:**
```javascript
app.post('/api/auth/login', async (req, res) => {
  const { username, email } = req.body;
  
  // Get or create user in database
  const user = await getUserByEmail(email);
  
  // Set session (creates HTTP-only cookie)
  req.session.userId = user.id;
  req.session.email = user.email;
  
  // Set readable cookie for frontend
  res.cookie('user_info', JSON.stringify({
    username: user.username,
    email: user.email
  }), {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: false, // JS can read
    sameSite: 'lax'
  });
  
  res.json({ success: true, user });
});
```

**Logout:**
```javascript
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('science_roadmap_session');
  res.clearCookie('user_info');
  res.json({ success: true });
});
```

**Protected Routes:**
```javascript
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

app.post('/api/forum/posts', requireAuth, async (req, res) => {
  // Only authenticated users can create posts
  const userId = req.session.userId; // From HTTP-only cookie
  // ... create post
});
```

## Frontend Implementation

### Axios Configuration

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true, // CRITICAL: Sends cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Cookie Utilities

```typescript
export const cookieUtils = {
  // Read cookie value
  getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  },
  
  // Parse JSON cookie
  getJSONCookie(name: string): any | null {
    const value = this.getCookie(name);
    if (!value) return null;
    try {
      return JSON.parse(decodeURIComponent(value));
    } catch (e) {
      return null;
    }
  },
  
  // Get user info from cookie
  getUserInfo(): { username: string; email: string } | null {
    return this.getJSONCookie('user_info');
  },
  
  // Get preferences
  getUserPreferences() {
    return this.getJSONCookie('user_preferences');
  }
};
```

### Usage in React Components

```tsx
'use client';
import { useEffect, useState } from 'react';
import { authAPI, cookieUtils } from '@/lib/api';

export default function ProfileComponent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Read user from cookie (no API call needed!)
    const userInfo = cookieUtils.getUserInfo();
    if (userInfo) {
      setUser(userInfo);
    } else {
      // Verify session is still valid
      authAPI.getCurrentUser().then(data => {
        if (data.authenticated) {
          setUser(data.user);
        }
      });
    }
  }, []);

  return (
    <div>
      {user ? (
        <p>Welcome, {user.username}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Making Authenticated Requests

```typescript
import { forumAPI } from '@/lib/api';

// Create post (cookie automatically sent)
const createPost = async () => {
  try {
    const result = await forumAPI.createPost(
      'My Question',
      'Content here',
      1 // categoryId
    );
    console.log('Post created:', result);
  } catch (error) {
    if (error.response?.status === 401) {
      // Not authenticated - redirect to login
      router.push('/login');
    }
  }
};
```

## Security Best Practices

### ✅ What We Do

1. **HttpOnly Cookies:** Session cookie cannot be accessed by JavaScript (prevents XSS)
2. **Secure Flag:** Cookies only sent over HTTPS in production
3. **SameSite Protection:** Prevents CSRF attacks
4. **CORS Configuration:** Only allows requests from trusted origins
5. **Session Expiration:** Cookies expire after 7 days
6. **No Passwords:** Using email-based authentication (can be extended)

### ⚠️ Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS (required for secure cookies)
- [ ] Set strong `SESSION_SECRET` (min 32 characters)
- [ ] Configure proper CORS origin
- [ ] Enable rate limiting
- [ ] Add CSRF tokens for forms
- [ ] Implement refresh tokens for longer sessions
- [ ] Add password hashing if using passwords

## Environment Variables

**Backend (.env):**
```bash
SESSION_SECRET=your-super-secret-key-change-this-in-production-min-32-chars
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Testing Cookies

### Using Browser DevTools

1. Open browser DevTools (F12)
2. Go to **Application** → **Cookies**
3. Select your domain
4. You should see:
   - `science_roadmap_session` (HttpOnly ✓)
   - `user_info` (readable)
   - `user_preferences` (readable)

### Using Postman

1. Send POST request to `/api/auth/login`
2. Check **Cookies** tab to see set cookies
3. Subsequent requests automatically include cookies
4. Test protected routes without manual headers

### Using cURL

```bash
# Login and save cookies
curl -c cookies.txt -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Scientist","email":"test@example.com"}'

# Use cookies in subsequent requests
curl -b cookies.txt http://localhost:5000/api/progress
```

## Troubleshooting

### Cookies Not Being Set

**Problem:** Cookies not appearing in browser

**Solutions:**
1. Check CORS is configured with `credentials: true`
2. Ensure frontend uses `withCredentials: true` in axios
3. Verify domain matches (localhost or production domain)
4. Check SameSite attribute compatibility
5. For production, ensure HTTPS is enabled

### 401 Unauthorized Errors

**Problem:** Getting 401 on protected routes

**Solutions:**
1. Check session cookie exists and hasn't expired
2. Verify `withCredentials: true` in axios config
3. Check backend session middleware is configured
4. Ensure user is logged in (call `/api/auth/me`)

### Cookies Not Sent to API

**Problem:** Cookies exist but not sent with requests

**Solutions:**
1. Add `withCredentials: true` to axios instance
2. Check CORS configuration allows credentials
3. Verify API URL matches (no port/domain mismatch)
4. Check SameSite settings

## Migration from localStorage

If migrating from localStorage authentication:

```typescript
// OLD WAY (localStorage)
const token = localStorage.getItem('token');
axios.get('/api/data', {
  headers: { Authorization: `Bearer ${token}` }
});

// NEW WAY (HTTP cookies)
// No manual token management!
// Cookies sent automatically
axios.get('/api/data', {
  withCredentials: true
});
```

## Advantages Over localStorage

1. **More Secure:** HttpOnly cookies can't be stolen by XSS
2. **Automatic:** No manual token management
3. **CSRF Protection:** SameSite attribute
4. **Server-Side Control:** Server can invalidate sessions
5. **Proper Expiration:** Built-in cookie expiration

## Further Reading

- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Express Session Docs](https://expressjs.com/en/resources/middleware/session.html)
- [MDN HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [SameSite Cookies Explained](https://web.dev/samesite-cookies-explained/)
