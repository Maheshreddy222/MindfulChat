# 📁 Mindful Chat - Complete Project Structure

## Full Directory Layout

```
mindful-chat/
│
├── 📄 README.md                 ← START HERE! Full documentation
├── 📄 QUICK_START.md            ← 5-minute setup guide
├── 📄 BUILD_SUMMARY.md          ← Project overview & what's included
├── 📄 PROJECT_SETUP.md          ← Detailed setup instructions
├── 📄 .gitignore                ← Git configuration
│
├── 📁 backend/                  ← Node.js/Express backend
│   ├── server.js                (Main Express server, 300+ lines)
│   ├── database.js              (SQLite setup & queries, 150+ lines)
│   ├── gemini.js                (Google Gemini API wrapper, 200+ lines)
│   ├── package.json             (Dependencies list)
│   ├── .env.example             (Environment template)
│   └── .env                     (YOUR CONFIG - created by you)
│
├── 📁 frontend/                 ← HTML/CSS/JS frontend
│   └── index.html               (Complete chat UI, 600+ lines)
│
├── 📁 docs/                     ← Documentation
│   ├── API_DOCS.md             (Complete API reference)
│   └── DEPLOYMENT.md           (Production deployment guides)
│
└── 📁 db.sqlite                ← Database (auto-created)
    ├── conversations table
    └── messages table
```

---

## File Descriptions

### 📄 Root Level Documentation

#### `README.md` (Primary Guide)
- **Purpose**: Complete project documentation
- **Read Time**: 20 minutes
- **Contains**: Features, tech stack, usage guide, troubleshooting
- **Best For**: Understanding the full project

#### `QUICK_START.md` (Fast Setup)
- **Purpose**: Get running in 5 minutes
- **Read Time**: 5 minutes
- **Contains**: 3-step setup, common tasks, troubleshooting
- **Best For**: Getting started quickly

#### `BUILD_SUMMARY.md` (Overview)
- **Purpose**: Project summary and learning paths
- **Read Time**: 10 minutes
- **Contains**: What's built, architecture, next steps
- **Best For**: Understanding scope and what's included

#### `PROJECT_SETUP.md` (Detailed Setup)
- **Purpose**: Step-by-step setup instructions
- **Read Time**: 15 minutes
- **Contains**: Prerequisites, installation, verification steps
- **Best For**: Detailed setup walkthrough

#### `.gitignore`
- **Purpose**: Git ignore rules
- **Contains**: node_modules/, .env, db.sqlite, etc.
- **Used By**: Git (don't edit unless needed)

---

### 🖥️ Backend Directory (`/backend/`)

#### `server.js` (Main Application)
```
Lines: ~400
Purpose: Express.js server with all API routes
Contains:
  ├── Middleware setup (CORS, body parser)
  ├── Static file serving
  ├── GET /api/conversations
  ├── POST /api/conversations
  ├── GET /api/conversations/:id
  ├── DELETE /api/conversations/:id
  ├── POST /api/conversations/:id/messages (streaming)
  ├── GET /api/health
  └── Error handling
Key Functions:
  - Express app initialization
  - Route handlers
  - Error middleware
  - Server startup
```

#### `database.js` (Database Layer)
```
Lines: ~150
Purpose: SQLite database initialization and query wrappers
Contains:
  ├── SQLite connection setup
  ├── Table creation (conversations, messages)
  ├── Promise-based query wrappers (dbRun, dbGet, dbAll)
  └── Index creation for optimization
Key Functions:
  - Database initialization
  - Promise wrappers for async queries
  - Table schema definition
  - Auto-creates db.sqlite on startup
```

#### `gemini.js` (AI Integration)
```
Lines: ~200
Purpose: Google Gemini API wrapper with streaming
Contains:
  ├── System prompt configuration
  ├── GeminiChat class
  ├── Conversation history management
  ├── Streaming response generator
  ├── Safety filters
  └── Error handling
Key Functions:
  - streamResponse() - Async generator for streaming
  - getResponse() - Promise-based full response
  - addToHistory() - Conversation memory
  - initializeWithHistory() - Load past context
```

#### `package.json` (Dependencies)
```
Contains:
  ├── Project metadata
  ├── Dependencies:
  │   ├── express (web server)
  │   ├── cors (cross-origin)
  │   ├── dotenv (environment variables)
  │   ├── sqlite3 (database)
  │   ├── axios (HTTP client)
  │   └── body-parser (request parsing)
  ├── Dev dependencies:
  │   └── nodemon (auto-reload)
  └── Scripts:
      ├── npm start (production)
      └── npm run dev (development)
```

#### `.env.example` (Environment Template)
```
Purpose: Template for .env file
Contains:
  ├── PORT=5000
  ├── NODE_ENV=development
  ├── GOOGLE_API_KEY=your_key_here
  └── DATABASE_PATH=./db.sqlite
Action: Copy to .env and fill in your values
```

#### `.env` (Your Configuration - Create This)
```
Action: Create by copying .env.example
Fill in:
  GOOGLE_API_KEY=your_actual_key_here
  (Keep other values as default for development)
```

---

### 💬 Frontend Directory (`/frontend/`)

#### `index.html` (Complete UI)
```
Lines: ~600
Purpose: Full chat interface (all HTML, CSS, JS in one file)
Structure:
  ├── CSS Styles:
  │   ├── Variables (colors, spacing)
  │   ├── Layout (sidebar, main, input)
  │   ├── Components (messages, buttons)
  │   └── Responsive (mobile support)
  │
  ├── HTML:
  │   ├── Sidebar (conversation list)
  │   ├── Chat header
  │   ├── Messages container
  │   ├── Input area
  │   └── Modals (loading, toast)
  │
  └── JavaScript:
      ├── API communication
      ├── Message streaming
      ├── DOM manipulation
      ├── Session management
      ├── Safety filters
      └── UI interactions

Key Features:
  - Real-time message streaming
  - Conversation management
  - Responsive design
  - Offline content detection
  - User-friendly UI
```

---

### 📚 Documentation Directory (`/docs/`)

#### `API_DOCS.md` (API Reference)
```
Read Time: 15 minutes
Contains:
  ├── Base URL: http://localhost:5000/api
  ├── Conversations endpoints
  │   ├── GET /conversations
  │   ├── POST /conversations
  │   ├── GET /conversations/:id
  │   └── DELETE /conversations/:id
  ├── Messages endpoints
  │   └── POST /conversations/:id/messages
  ├── Health endpoints
  │   └── GET /health
  ├── Error responses
  ├── Database schema
  ├── Testing examples (cURL)
  └── Rate limiting notes
Best For: Understanding API structure
```

#### `DEPLOYMENT.md` (Production Guide)
```
Read Time: 30 minutes
Contains:
  ├── Heroku deployment
  ├── Railway.app deployment
  ├── AWS EC2 setup
  ├── Docker containerization
  ├── Vercel serverless
  ├── DigitalOcean setup
  ├── Production hardening
  │   ├── Security headers
  │   ├── Input validation
  │   ├── Rate limiting
  │   ├── HTTPS setup
  │   └── Database backups
  ├── PostgreSQL migration
  ├── Performance optimization
  ├── Monitoring & alerts
  └── Troubleshooting
Best For: Deploying to production
```

---

### 💾 Database (`/backend/db.sqlite`)

Auto-created on first run. Contains:

#### `conversations` table
```sql
Columns:
  - id (PRIMARY KEY)
  - title (TEXT)
  - createdAt (DATETIME)
  - updatedAt (DATETIME)

Example Row:
  id=1, title="New Conversation", createdAt=2024-01-15...
```

#### `messages` table
```sql
Columns:
  - id (PRIMARY KEY)
  - conversationId (FOREIGN KEY)
  - role (user or assistant)
  - content (TEXT)
  - createdAt (DATETIME)

Example Row:
  id=1, conversationId=1, role=user, content="Hello...", ...
```

---

## File Dependencies & Flow

```
User Browser
    ↓
    └─→ frontend/index.html
        ├─ CSS (styling)
        ├─ HTML (structure)
        └─ JavaScript
           ├ Sends requests to:
           └─→ backend/server.js
              ├─ Routes HTTP requests
              ├─ Calls: database.js
              │  └─ Queries: db.sqlite
              └─ Calls: gemini.js
                 ├─ Google Gemini API
                 └─ Returns: Streamed responses
           └─ Receives responses
           └─ Updates DOM in real-time
```

---

## File Size Reference

| File | Size | Type |
|------|------|------|
| backend/server.js | ~15 KB | JavaScript |
| backend/database.js | ~6 KB | JavaScript |
| backend/gemini.js | ~8 KB | JavaScript |
| frontend/index.html | ~45 KB | HTML/CSS/JS |
| docs/API_DOCS.md | ~20 KB | Markdown |
| docs/DEPLOYMENT.md | ~40 KB | Markdown |
| README.md | ~50 KB | Markdown |
| db.sqlite | ~100 KB | Database |

**Total Backend Code: ~29 KB**  
**Total Frontend Code: ~45 KB**  
**Total: ~74 KB of code**

---

## Configuration File Locations

### Environment Configuration
- **File**: `backend/.env`
- **Purpose**: Store secrets (API keys, database path, port)
- **Created By**: You (copy from .env.example)
- **Should NOT commit**: Add .env to .gitignore

### Application Config
- **File**: `backend/server.js` (top section)
- **Purpose**: Server configuration (port, environment)
- **Customization**: Change PORT, API endpoints, middleware

### Database Config
- **File**: `backend/database.js` (top section)
- **Purpose**: Database path, table schema
- **Customization**: Add tables, modify schema

### AI Config
- **File**: `backend/gemini.js` (SYSTEM_PROMPT constant)
- **Purpose**: AI behavior and personality
- **Customization**: Modify system prompt

### Frontend Config
- **File**: `frontend/index.html` (CSS variables, constants)
- **Purpose**: UI colors, API base URL
- **Customization**: Change colors, styling

---

## Which Files to Modify

### To Change AI Behavior
→ Edit: `backend/gemini.js` (SYSTEM_PROMPT)

### To Change UI Styling
→ Edit: `frontend/index.html` (CSS section)

### To Add API Endpoints
→ Edit: `backend/server.js` (routes section)

### To Add Database Tables
→ Edit: `backend/database.js` (initializeTables function)

### To Change Server Port
→ Edit: `backend/.env` (PORT=your_port)

### To Add New Features
→ Modify: Multiple files (coordination needed)

---

## File Modification Guide

### Safe to Modify Without Breaking Anything
- ✅ `frontend/index.html` (UI styling & layout)
- ✅ `backend/.env` (configuration values)
- ✅ `backend/gemini.js` (SYSTEM_PROMPT)
- ✅ `README.md` (documentation)

### Requires Understanding
- ⚠️ `backend/server.js` (API changes affect frontend)
- ⚠️ `backend/database.js` (schema changes need migration)
- ⚠️ `frontend/index.html` (JavaScript logic changes)

### Critical - Handle with Care
- 🔴 `package.json` (dependency versions)
- 🔴 `backend/db.sqlite` (production data)

---

## Setup Checklist by File

### Before First Run
- [ ] Check: `backend/package.json` exists
- [ ] Run: `npm install`
- [ ] Copy: `backend/.env.example` → `backend/.env`
- [ ] Edit: `backend/.env` (add GOOGLE_API_KEY)
- [ ] Verify: All files in structure exist

### On First Startup
- [ ] Run: `npm run dev`
- [ ] Watch: `backend/db.sqlite` is created
- [ ] Check: Two tables created (conversations, messages)
- [ ] Verify: Server starts on port 5000
- [ ] Open: `frontend/index.html` in browser

### Regular Checks
- [ ] Monitor: `backend/server.js` logs
- [ ] Check: `backend/db.sqlite` size (growing)
- [ ] Verify: Messages saved in database
- [ ] Test: API endpoints in `docs/API_DOCS.md`

---

## File Organization Best Practices

**Current Structure (Good for MVP):**
- Everything needed is included
- Single HTML file for frontend
- Clear backend/frontend separation
- Easy to understand

**As You Scale (Consider):**
- Split frontend into multiple files
- Add backend service layer
- Separate route handlers
- Add middleware directory
- Create utils directory

---

## Backup & Version Control

### Files to Backup
- 🟢 `backend/db.sqlite` (critical data)
- 🟢 `backend/.env` (secrets)
- 🟡 `frontend/index.html` (UI changes)
- 🟡 `backend/gemini.js` (custom AI)

### Files to Ignore (in .gitignore)
- `node_modules/`
- `backend/.env`
- `backend/db.sqlite`
- `.DS_Store`
- `*.log`

### Files to Track in Git
- All `.js` files
- All `.html` files
- All `.md` files
- `package.json`
- `.gitignore`

---

## Quick Navigation Guide

**Need to...**

| Task | Go to File |
|------|-----------|
| Change AI response | backend/gemini.js |
| Modify UI colors | frontend/index.html |
| Add API endpoint | backend/server.js |
| Configure server | backend/.env |
| Understand API | docs/API_DOCS.md |
| Deploy to production | docs/DEPLOYMENT.md |
| Get started quickly | QUICK_START.md |

---

## File Integrity Checklist

After copying all files, verify:

```bash
# Check backend files exist
ls -la backend/server.js
ls -la backend/database.js
ls -la backend/gemini.js
ls -la backend/package.json

# Check frontend exists
ls -la frontend/index.html

# Check documentation
ls -la docs/API_DOCS.md
ls -la docs/DEPLOYMENT.md

# Check root files
ls -la README.md
ls -la .gitignore
```

All should show file details without "not found" errors.

---

## Storage & Size Management

### Typical Growth
- **Start**: ~5 KB database
- **After 100 conversations**: ~200 KB
- **After 1000 conversations**: ~2 MB
- **After 10,000 conversations**: ~20 MB

### Database Maintenance
```bash
# Check size
du -sh backend/db.sqlite

# Backup database
cp backend/db.sqlite backend/db.sqlite.backup

# Clean old conversations (SQL)
DELETE FROM conversations WHERE createdAt < '2024-01-01';
```

---

## Production File Checklist

Before deploying, ensure:

- [ ] `.env` file is secure (not committed)
- [ ] `db.sqlite` is backed up
- [ ] `backend/` has all required files
- [ ] `frontend/index.html` is minified (optional)
- [ ] All dependencies in `package.json`
- [ ] Documentation is current

---

You now have the complete, documented, production-ready project structure!

**Start with**: QUICK_START.md (5 minutes)  
**Then read**: README.md (20 minutes)  
**For details**: API_DOCS.md or DEPLOYMENT.md
