# 🚀 Mindful Chat - Quick Start Guide

## Files Created

### Backend Setup (/backend/)
- ✅ `server.js` - Express server with all API routes
- ✅ `database.js` - SQLite database initialization
- ✅ `gemini.js` - Google Gemini API wrapper
- ✅ `package.json` - Node.js dependencies
- ✅ `.env.example` - Environment variables template

### Frontend (/frontend/)
- ✅ `index.html` - Complete chat interface with CSS & JavaScript

### Documentation (/docs/)
- ✅ `API_DOCS.md` - Full API endpoint documentation
- ✅ `DEPLOYMENT.md` - Production deployment guides

### Root Files
- ✅ `README.md` - Complete project documentation
- ✅ `PROJECT_SETUP.md` - Detailed setup instructions
- ✅ `QUICK_START.md` - This file
- ✅ `.gitignore` - Git configuration

---

## 5-Minute Setup

### 1️⃣ Install Node.js
Download from [nodejs.org](https://nodejs.org) (v16+)

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Get Google Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### 4️⃣ Create Environment File

Create `backend/.env`:
```env
GOOGLE_API_KEY=paste_your_key_here
PORT=5000
NODE_ENV=development
```

### 5️⃣ Start Server
```bash
npm run dev
```

**Output should show:**
```
✓ Server running at http://localhost:5000
```

### 6️⃣ Open in Browser
Visit: **http://localhost:5000**

---

## What Each File Does

### Backend Files

#### `server.js` 🖥️
- Express.js server
- All API endpoints
- Static file serving
- Streaming message responses
- Error handling

**Key Routes:**
- `GET /api/conversations` - List all chats
- `POST /api/conversations` - Create new chat
- `POST /api/conversations/:id/messages` - Send message (streaming)
- `DELETE /api/conversations/:id` - Delete chat

#### `database.js` 💾
- SQLite3 database setup
- Table initialization
- Promise-based query wrappers
- Auto-creates `db.sqlite`

**Tables Created:**
- `conversations` - Chat sessions
- `messages` - Individual messages

#### `gemini.js` 🤖
- Google Gemini API integration
- Message streaming
- Conversation history management
- Safety filters

**Key Methods:**
- `streamResponse(message)` - Stream AI response
- `getResponse(message)` - Get full response
- `initializeWithHistory(messages)` - Load past context

### Frontend Files

#### `index.html` 💬
- Complete chat UI
- Real-time message rendering
- Session management
- Responsive design

**Key Features:**
- Send/receive messages
- Create/delete sessions
- Display streaming responses
- Offensive content detection

---

## File Connections

```
User Browser
    ↓
index.html (frontend)
    ↓ (HTTP API calls)
    ↓
server.js (backend)
    ├→ database.js (stores messages in db.sqlite)
    ├→ gemini.js (calls Google Gemini API)
    └→ responds with streamed text
    ↓
Browser displays response in real-time
```

---

## Common Tasks

### Run Development Server
```bash
npm run dev
```
- Auto-reloads on file changes
- Shows all console logs
- Great for development

### Run Production Server
```bash
npm start
```
- Single process
- No auto-reload
- For deployment

### Check Database
```bash
# SQLite3 must be installed
sqlite3 backend/db.sqlite

# View tables
.tables

# View conversations
SELECT * FROM conversations;

# Exit
.quit
```

### Test API with cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Create conversation
curl -X POST http://localhost:5000/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title":"My Chat"}'

# List conversations
curl http://localhost:5000/api/conversations
```

---

## Troubleshooting

### "Module not found"
```bash
npm install
npm install sqlite3
```

### "GOOGLE_API_KEY not found"
- Create `backend/.env` file
- Add: `GOOGLE_API_KEY=your_key_here`
- Restart server

### Port already in use
Change port in `backend/.env`:
```env
PORT=3000
```

### Database errors
```bash
# Delete old database
rm backend/db.sqlite

# Restart server
npm run dev
```

### Gemini API errors
1. Verify API key is correct
2. Check Google Cloud Console for quotas
3. Free tier: ~60 requests/minute limit

---

## Project Flow

```
1. User types message in browser
   ↓
2. index.html sends to /api/conversations/:id/messages
   ↓
3. server.js receives request
   ↓
4. Saves user message to db.sqlite
   ↓
5. Calls gemini.js with message
   ↓
6. gemini.js calls Google Gemini API
   ↓
7. API streams response back
   ↓
8. server.js forwards to browser via SSE
   ↓
9. index.html displays in real-time
   ↓
10. Saves assistant message to db.sqlite
```

---

## Architecture Overview

```
MINDFUL CHAT
├── FRONTEND (Client)
│   └── index.html - Chat interface
│
├── BACKEND (Server)
│   ├── server.js - API endpoints
│   ├── database.js - SQLite queries
│   └── gemini.js - AI integration
│
├── DATABASE (Storage)
│   └── db.sqlite - Conversations & messages
│
└── EXTERNAL API
    └── Google Gemini - AI responses
```

---

## Key Technologies

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Server | Node.js + Express | Handle HTTP requests |
| Frontend | HTML5 + Vanilla JS | Chat interface |
| Database | SQLite3 | Store conversations |
| AI | Google Gemini API | Generate responses |
| Streaming | Server-Sent Events | Real-time responses |

---

## Development Tips

### Add New API Endpoint
```javascript
// In server.js
app.get('/api/new-endpoint', async (req, res) => {
  try {
    const data = await dbGet('SELECT * FROM messages LIMIT 5');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

### Modify Frontend
Edit `frontend/index.html` and refresh browser (auto-reload in dev mode)

### Add Database Table
```javascript
// In database.js initializeTables()
db.run(`
  CREATE TABLE IF NOT EXISTS new_table (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    column1 TEXT,
    column2 INTEGER
  )
`);
```

---

## Next Steps

1. ✅ Complete quick start above
2. 📖 Read `README.md` for full docs
3. 🔌 Read `docs/API_DOCS.md` for API details
4. 🚀 For deployment, see `docs/DEPLOYMENT.md`
5. 🛡️ Add authentication for production
6. 📊 Set up monitoring/logging
7. 🧪 Load test the application

---

## File Checklist

Make sure you have all these files:

### Backend (/backend/)
- [ ] `server.js`
- [ ] `database.js`
- [ ] `gemini.js`
- [ ] `package.json`
- [ ] `.env` (create from .env.example)

### Frontend (/frontend/)
- [ ] `index.html`

### Documentation
- [ ] `README.md`
- [ ] `PROJECT_SETUP.md`
- [ ] `QUICK_START.md`
- [ ] `docs/API_DOCS.md`
- [ ] `docs/DEPLOYMENT.md`

### Config
- [ ] `.gitignore`

---

## Getting Help

**Stuck?** Try this in order:

1. Check the console: `npm run dev` shows all errors
2. Read `README.md` for common issues
3. Check `docs/API_DOCS.md` for endpoint details
4. Verify `.env` file has `GOOGLE_API_KEY`
5. Test API with curl commands above
6. Check database: `sqlite3 backend/db.sqlite`

---

## Production Checklist

Before deploying to production:

- [ ] Add user authentication
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Add input validation
- [ ] Set up rate limiting
- [ ] Enable logging
- [ ] Add error monitoring
- [ ] Create privacy policy
- [ ] Add terms of service
- [ ] Test all API endpoints
- [ ] Set up database backups
- [ ] Configure security headers

See `docs/DEPLOYMENT.md` for full production setup.

---

## Architecture Decisions

Why this stack?

- **Node.js + Express**: Fast, JavaScript-based, easy to learn
- **SQLite**: Lightweight, no server setup needed, perfect for MVP
- **Google Gemini**: State-of-art AI, free tier, no authentication hassle
- **Vanilla JavaScript**: No build tools needed, simple to deploy
- **Server-Sent Events**: Real-time streaming without WebSockets

---

## Performance Tips

- Messages are streamed (not sent all at once)
- Database queries use indexes
- Frontend caches DOM efficiently
- SQLite auto-commits (remove for batch operations)
- CORS is configured for performance

---

## Security Notes

🔐 Current implementation:
- Offensive content detection (frontend)
- Crisis resources links
- Clear disclaimers
- Input trimming

🔒 Before production, add:
- User authentication
- Rate limiting
- HTTPS enforcement
- Input validation/sanitization
- CORS restrictions
- Security headers

---

## Support Resources

- 📚 **Documentation**: README.md
- 🔌 **API Reference**: docs/API_DOCS.md
- 🚀 **Deployment**: docs/DEPLOYMENT.md
- 🤖 **Gemini Docs**: https://ai.google.dev
- 💙 **Crisis Support**: https://988lifeline.org

---

## Quick Commands Reference

```bash
# Setup
npm install
cp backend/.env.example backend/.env

# Development
npm run dev              # Start with auto-reload
npm start               # Start production

# Database
sqlite3 backend/db.sqlite
.tables
SELECT * FROM conversations;

# Testing
curl http://localhost:5000/api/health

# Deployment
npm start               # Ready for production server
```

---

## Version

**Mindful Chat v1.0.0**
- Full-stack chat application
- Google Gemini integration
- SQLite persistence
- Real-time streaming
- Production-ready backend

---

Good luck! You're ready to build. 🚀

Start with `npm run dev` and open http://localhost:5000
