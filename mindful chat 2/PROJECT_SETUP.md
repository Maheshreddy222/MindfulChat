# Mindful Chat - Full Stack Setup Guide

## Project Structure

```
mindful-chat/
├── backend/
│   ├── server.js                 # Express server
│   ├── database.js               # SQLite setup
│   ├── gemini.js                 # Google Gemini API wrapper
│   ├── routes/
│   │   ├── conversations.js      # Conversation endpoints
│   │   └── messages.js           # Message endpoints
│   ├── middleware/
│   │   └── errorHandler.js       # Error handling
│   ├── models/
│   │   ├── Conversation.js       # Conversation model
│   │   └── Message.js            # Message model
│   ├── .env                      # Environment variables
│   ├── package.json              # Dependencies
│   └── db.sqlite                 # SQLite database (auto-created)
│
├── frontend/
│   ├── index.html                # Main chat interface
│   └── styles/
│       └── index.css             # Styling
│
├── docs/
│   ├── API_DOCS.md              # API documentation
│   └── DEPLOYMENT.md             # Deployment guide
│
├── .gitignore
└── README.md
```

## Technologies

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **AI**: Google Generative AI (Gemini API)
- **Streaming**: Server-Sent Events (SSE)

## Prerequisites

- Node.js v16+ 
- npm or yarn
- Google Cloud account with Gemini API enabled
- SQLite3 (optional, node-sqlite3 handles it)

## Step 1: Initialize Project

```bash
mkdir mindful-chat
cd mindful-chat

# Initialize npm
npm init -y

# Create directory structure
mkdir backend frontend frontend/styles docs
touch backend/server.js backend/database.js backend/gemini.js
mkdir backend/routes backend/middleware backend/models
```

## Step 2: Install Dependencies

```bash
npm install express cors dotenv sqlite3 axios body-parser

# Dev dependencies
npm install --save-dev nodemon
```

## Step 3: Setup Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
GOOGLE_API_KEY=your_gemini_api_key_here
DATABASE_PATH=./db.sqlite
```

## Step 4: Get Google Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key and paste in `.env`
4. Enable the Generative AI API in Google Cloud Console

## Step 5: Run the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Server runs at http://localhost:5000
```

## Step 6: Access the Application

- Chat Interface: http://localhost:5000
- API Base: http://localhost:5000/api

## Important Notes

- All conversations and messages are stored in SQLite
- AI responses are streamed in real-time using Server-Sent Events
- Offensive content detection is built-in (on frontend)
- No authentication required (add it for production)
