# 🧠 Mindful Chat - AI Mental Health Support Platform

A full-stack web application providing compassionate AI-powered mental health support using Google's Gemini API.

## Features

✨ **Core Features**
- Real-time AI conversations powered by Google Gemini
- Multiple conversation sessions with full history
- Message streaming for smooth, natural responses
- Clean, intuitive chat interface
- Conversation management (create, view, delete)
- SQLite database for persistent storage

🛡️ **Safety & Support**
- Offensive content detection
- Mental health crisis resources (988 Lifeline)
- Compassionate AI responses
- Clear disclaimers about AI limitations
- Privacy-focused design

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite3 |
| **AI** | Google Generative AI (Gemini) |
| **Streaming** | Server-Sent Events (SSE) |

## Quick Start

### Prerequisites

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Google API Key** for Gemini (free tier available)

### Step 1: Clone & Setup

```bash
# Clone or download the project
cd mindful-chat

# Install dependencies
npm install

# Copy environment template
cp backend/.env.example backend/.env
```

### Step 2: Get Gemini API Key

1. Visit [Google Makersuite](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy the generated key
4. Paste it in `backend/.env`:
   ```env
   GOOGLE_API_KEY=your_key_here
   ```

### Step 3: Start the Server

```bash
# Development mode (auto-reload on file changes)
npm run dev

# Production mode
npm start
```

Output:
```
╔════════════════════════════════════════════════╗
║       🧠 Mindful Chat - Backend Server         ║
╚════════════════════════════════════════════════╝

✓ Server running at http://localhost:5000
✓ Frontend: http://localhost:5000
✓ API Base: http://localhost:5000/api
```

### Step 4: Open in Browser

Navigate to **http://localhost:5000** in your web browser

---

## Project Structure

```
mindful-chat/
├── backend/
│   ├── server.js              # Express server & routes
│   ├── database.js            # SQLite setup & queries
│   ├── gemini.js              # Gemini API wrapper
│   ├── package.json           # Dependencies
│   ├── .env.example           # Environment template
│   └── db.sqlite              # Database (auto-created)
│
├── frontend/
│   └── index.html             # Full chat interface
│
├── docs/
│   ├── API_DOCS.md           # API endpoint documentation
│   └── DEPLOYMENT.md         # Production deployment guide
│
├── README.md
├── .gitignore
└── PROJECT_SETUP.md
```

---

## API Endpoints

### Conversations
- `GET /api/conversations` - List all conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/:id` - Get conversation with messages
- `DELETE /api/conversations/:id` - Delete conversation

### Messages
- `POST /api/conversations/:id/messages` - Send message (streaming response)

### Health
- `GET /api/health` - Server status check

**Full API documentation:** See [docs/API_DOCS.md](./docs/API_DOCS.md)

---

## Usage Guide

### Starting a Conversation

1. Click **"New Space"** in the sidebar
2. Type your message in the input field
3. Press **Enter** or click the send button
4. AI responds in real-time

### Managing Sessions

- **View Previous Chats**: Click any session in the sidebar
- **Delete Session**: Hover over a session and click the ✕ button
- **Create New Chat**: Click "New Space" button

### Tips for Best Results

- Be specific about what's on your mind
- The AI gets better context from multi-message conversations
- Share feelings openly - it's a judgment-free space
- For serious concerns, seek professional help (dial 988)

---

## Environment Variables

Create `backend/.env` with these variables:

```env
# Required
GOOGLE_API_KEY=your_gemini_api_key_here

# Optional (defaults shown)
PORT=5000
NODE_ENV=development
DATABASE_PATH=./db.sqlite
```

**Getting Your API Key:**
1. Go to [Google Makersuite](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and paste in `.env`

---

## Database Schema

### Conversations Table
Stores all chat sessions with metadata.

```sql
CREATE TABLE conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Messages Table
Stores individual messages within conversations.

```sql
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversationId INTEGER NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversationId) REFERENCES conversations(id) ON DELETE CASCADE
);
```

---

## Deployment

### Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create mindful-chat-app

# Set environment variable
heroku config:set GOOGLE_API_KEY=your_key_here

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Other Platforms

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for:
- Vercel/Netlify deployment
- AWS EC2 setup
- Docker containerization
- Production security checklist

---

## Safety Features

🛡️ **Built-In Protections**

1. **Offensive Content Detection** - Flags concerning messages
2. **Crisis Resources** - Links to 988 Suicide & Crisis Lifeline
3. **Clear Disclaimers** - AI is not a replacement for professional help
4. **Compassionate Responses** - AI trained to be supportive and non-judgmental

⚠️ **Important Disclaimer**

Mindful Chat is an AI companion and **not a licensed therapist**. If you're experiencing:
- Suicidal thoughts
- Self-harm urges
- Mental health crisis

**Please reach out:**
- Call **988** (Suicide & Crisis Lifeline) - US
- Text **HOME** to **741741** (Crisis Text Line) - US
- Contact local emergency services

---

## Development

### Install Dependencies
```bash
npm install
```

### Development Mode (Auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Testing API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Create conversation
curl -X POST http://localhost:5000/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title":"Test"}'

# Send message (streaming)
curl -X POST http://localhost:5000/api/conversations/1/messages \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello"}' \
  -N
```

---

## Troubleshooting

### "Cannot find module 'sqlite3'"
```bash
npm install sqlite3
```

### "GOOGLE_API_KEY not found"
- Create `backend/.env` file
- Add your API key: `GOOGLE_API_KEY=your_key`
- Restart the server

### "Database connection failed"
- Check file permissions on `backend/` directory
- Ensure SQLite3 is installed: `npm install sqlite3`
- Try deleting `db.sqlite` and restarting

### "Port 5000 already in use"
Change port in `.env`:
```env
PORT=3000
```

### API responses are slow
- Check your internet connection
- Verify Gemini API quota at [Google Console](https://console.cloud.google.com/)
- Free tier has rate limits (~60 requests/minute)

---

## Contributing

We welcome contributions! Areas for improvement:

- [ ] User authentication & profiles
- [ ] Message search & filtering
- [ ] Export conversation to PDF
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Advanced emotion analysis
- [ ] Integration with mental health resources

---

## Security Considerations

⚠️ **Before Production Deployment:**

1. **Add Authentication** - Implement JWT or OAuth
2. **Enable HTTPS** - Use SSL certificates
3. **Validate Inputs** - Sanitize all user input
4. **Rate Limiting** - Prevent API abuse
5. **Database Backups** - Regular encrypted backups
6. **Environment Secrets** - Never commit `.env` files
7. **CORS Configuration** - Restrict to your domain
8. **Content Moderation** - Enhanced safety filters
9. **Data Privacy** - GDPR/privacy policy compliance
10. **Monitoring** - Error tracking and analytics

---

## License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## Support & Resources

- 📖 **API Documentation**: [docs/API_DOCS.md](./docs/API_DOCS.md)
- 🚀 **Deployment Guide**: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- 📝 **Setup Guide**: [PROJECT_SETUP.md](./PROJECT_SETUP.md)
- 🔗 **Google Gemini Docs**: [ai.google.dev](https://ai.google.dev)

---

## Mental Health Resources

If you need immediate help:

🇺🇸 **United States**
- **988** - Suicide & Crisis Lifeline (call or text)
- **Crisis Text Line** - Text `HOME` to `741741`

🇬🇧 **United Kingdom**
- **116 123** - Samaritans (24/7)

🌍 **International**
- [FindAHelpline.com](https://findahelpline.com)

---

## Acknowledgments

- Built with ❤️ for mental health support
- Powered by Google Gemini AI
- Inspired by accessible, compassionate design

---

## Questions?

Open an issue on the repository or reach out with questions about setup or deployment.

---

**Last Updated:** January 2024  
**Version:** 1.0.0

Made with 🧠 for mental wellbeing
