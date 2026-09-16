const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const { dbRun, dbGet, dbAll } = require('./database');
const GeminiChat = require('./gemini');

const app = express();
const PORT = process.env.PORT || 5000;

const JWT_SECRET =
  process.env.JWT_SECRET || 'mindful_chat_secret_change_this';

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(bodyParser.json({
  limit: '1mb'
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));


// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Authentication required'
    });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Invalid authentication token'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Invalid or expired token'
    });
  }
};


// =====================================================
// AUTH APIs
// =====================================================

// Create account
app.post('/api/auth/signup', async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email and password are required'
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        error: 'Name must contain at least 2 characters'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must contain at least 6 characters'
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const existingUser = await dbGet(
      `SELECT id FROM users WHERE email = ?`,
      [normalizedEmail]
    );

    if (existingUser) {
      return res.status(409).json({
        error: 'An account with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const result = await dbRun(
      `INSERT INTO users
       (name, email, password)
       VALUES (?, ?, ?)`,
      [
        name.trim(),
        normalizedEmail,
        hashedPassword
      ]
    );

    const user = await dbGet(
      `SELECT
        id,
        name,
        email,
        createdAt
       FROM users
       WHERE id = ?`,
      [result.id]
    );

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email
      },
      JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user
    });

  } catch (error) {
    console.error('Signup error:', error);

    res.status(500).json({
      error: 'Failed to create account'
    });
  }
});


// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const user = await dbGet(
      `SELECT *
       FROM users
       WHERE email = ?`,
      [normalizedEmail]
    );

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email
      },
      JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      error: 'Failed to login'
    });
  }
});


// Get current user
app.get(
  '/api/auth/me',
  authenticateToken,
  async (req, res) => {
    try {
      const user = await dbGet(
        `SELECT
          id,
          name,
          email,
          createdAt
         FROM users
         WHERE id = ?`,
        [req.user.id]
      );

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      res.json(user);

    } catch (error) {
      console.error('Get user error:', error);

      res.status(500).json({
        error: 'Failed to get user'
      });
    }
  }
);


// =====================================================
// CONVERSATIONS API
// =====================================================

// Get all conversations for logged-in user
app.get(
  '/api/conversations',
  authenticateToken,
  async (req, res) => {
    try {
      const conversations = await dbAll(
        `SELECT
          id,
          title,
          createdAt,
          updatedAt
         FROM conversations
         WHERE userId = ?
         ORDER BY updatedAt DESC`,
        [req.user.id]
      );

      res.json(conversations);

    } catch (error) {
      console.error(
        'Error fetching conversations:',
        error
      );

      res.status(500).json({
        error: 'Failed to fetch conversations'
      });
    }
  }
);


// Create new conversation
app.post(
  '/api/conversations',
  authenticateToken,
  async (req, res) => {
    try {
      const title =
        req.body.title?.trim() || 'New chat';

      const result = await dbRun(
        `INSERT INTO conversations
         (
           userId,
           title,
           createdAt,
           updatedAt
         )
         VALUES
         (
           ?,
           ?,
           datetime('now'),
           datetime('now')
         )`,
        [
          req.user.id,
          title
        ]
      );

      const conversation = await dbGet(
        `SELECT
          id,
          title,
          createdAt,
          updatedAt
         FROM conversations
         WHERE id = ?
         AND userId = ?`,
        [
          result.id,
          req.user.id
        ]
      );

      res.status(201).json(conversation);

    } catch (error) {
      console.error(
        'Error creating conversation:',
        error
      );

      res.status(500).json({
        error: 'Failed to create conversation'
      });
    }
  }
);


// Get one conversation with messages
app.get(
  '/api/conversations/:id',
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      const conversation = await dbGet(
        `SELECT
          id,
          title,
          createdAt,
          updatedAt
         FROM conversations
         WHERE id = ?
         AND userId = ?`,
        [
          id,
          req.user.id
        ]
      );

      if (!conversation) {
        return res.status(404).json({
          error: 'Conversation not found'
        });
      }

      const messages = await dbAll(
        `SELECT
          id,
          role,
          content,
          createdAt
         FROM messages
         WHERE conversationId = ?
         ORDER BY createdAt ASC`,
        [id]
      );

      res.json({
        ...conversation,
        messages
      });

    } catch (error) {
      console.error(
        'Error fetching conversation:',
        error
      );

      res.status(500).json({
        error: 'Failed to fetch conversation'
      });
    }
  }
);


// Delete conversation
app.delete(
  '/api/conversations/:id',
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      const conversation = await dbGet(
        `SELECT id
         FROM conversations
         WHERE id = ?
         AND userId = ?`,
        [
          id,
          req.user.id
        ]
      );

      if (!conversation) {
        return res.status(404).json({
          error: 'Conversation not found'
        });
      }

      await dbRun(
        `DELETE FROM messages
         WHERE conversationId = ?`,
        [id]
      );

      await dbRun(
        `DELETE FROM conversations
         WHERE id = ?
         AND userId = ?`,
        [
          id,
          req.user.id
        ]
      );

      res.json({
        success: true,
        message: 'Conversation deleted'
      });

    } catch (error) {
      console.error(
        'Error deleting conversation:',
        error
      );

      res.status(500).json({
        error: 'Failed to delete conversation'
      });
    }
  }
);


// =====================================================
// MESSAGES API WITH STREAMING
// =====================================================

app.post(
  '/api/conversations/:id/messages',
  
  authenticateToken,
  
  async (req, res) => {
    try {
      const { id } = req.params;

      const content =
        req.body.content?.trim();

      const mode =
        req.body.mode === 'deep'
          ? 'deep'
          : 'simple';

      if (!content) {
        return res.status(400).json({
          error: 'Message content is required'
        });
      }

      // Verify conversation belongs to current user
      const conversation = await dbGet(
        `SELECT
          id,
          title
         FROM conversations
         WHERE id = ?
         AND userId = ?`,
        [
          id,
          req.user.id
        ]
      );

      if (!conversation) {
        return res.status(404).json({
          error: 'Conversation not found'
        });
      }


      // Save user message
      await dbRun(
        `INSERT INTO messages
         (
           conversationId,
           role,
           content,
           createdAt
         )
         VALUES
         (
           ?,
           'user',
           ?,
           datetime('now')
         )`,
        [
          id,
          content
        ]
      );


      // =================================================
      // AUTO-RENAME CHAT USING FIRST USER MESSAGE
      // =================================================

      let newTitle = null;

      if (conversation.title === 'New chat') {
        newTitle = content
          .replace(/\s+/g, ' ')
          .trim();

        if (newTitle.length > 45) {
          newTitle =
            newTitle.substring(0, 45).trim() + '...';
        }

        await dbRun(
          `UPDATE conversations
           SET
             title = ?,
             updatedAt = datetime('now')
           WHERE id = ?
           AND userId = ?`,
          [
            newTitle,
            id,
            req.user.id
          ]
        );
      }


      // =================================================
      // SERVER-SENT EVENTS HEADERS
      // =================================================

      res.status(200);

      res.setHeader(
        'Content-Type',
        'text/event-stream; charset=utf-8'
      );

      res.setHeader(
        'Cache-Control',
        'no-cache, no-transform'
      );

      res.setHeader(
        'Connection',
        'keep-alive'
      );

      res.setHeader(
        'X-Accel-Buffering',
        'no'
      );

      // Send headers immediately
      res.flushHeaders();

      // Send initial event immediately so browser
      // knows the stream has started
      res.write(
        `data: ${JSON.stringify({
          started: true,
          title: newTitle
        })}\n\n`
      );


      // =================================================
      // GET CHAT HISTORY
      // =================================================

      const previousMessages = await dbAll(
        `SELECT
          role,
          content
         FROM messages
         WHERE conversationId = ?
         ORDER BY createdAt ASC`,
        [id]
      );


      // =================================================
      // INITIALIZE GEMINI
      // =================================================

      const chat = new GeminiChat();

      chat.initializeWithHistory(
        previousMessages
      );


      let fullResponse = '';


      // =================================================
      // STREAM AI RESPONSE
      // =================================================

      for await (
        const chunk of chat.streamResponse(
          content,
          mode
        )
      ) {
        if (!chunk) {
          continue;
        }

        fullResponse += chunk;

        // Send each Gemini chunk directly
        res.write(
          `data: ${JSON.stringify({
            content: chunk
          })}\n\n`
        );
      }


      // =================================================
      // SAVE ASSISTANT RESPONSE
      // =================================================

      if (fullResponse.trim()) {
        await dbRun(
          `INSERT INTO messages
           (
             conversationId,
             role,
             content,
             createdAt
           )
           VALUES
           (
             ?,
             'assistant',
             ?,
             datetime('now')
           )`,
          [
            id,
            fullResponse.trim()
          ]
        );
      }


      // =================================================
      // UPDATE CONVERSATION
      // =================================================

      await dbRun(
        `UPDATE conversations
         SET updatedAt = datetime('now')
         WHERE id = ?
         AND userId = ?`,
        [
          id,
          req.user.id
        ]
      );


      // =================================================
      // SEND COMPLETION EVENT
      // =================================================

      res.write(
        `data: ${JSON.stringify({
          done: true,
          title: newTitle
        })}\n\n`
      );

      res.end();

    } catch (error) {
      console.error(
        'Error processing message:',
        error
      );

      // If stream has not started yet
      if (!res.headersSent) {
        return res.status(500).json({
          error:
            error.message ||
            'Failed to process message'
        });
      }

      // If stream is already active
      res.write(
        `data: ${JSON.stringify({
          error:
            error.message ||
            'Failed to generate response'
        })}\n\n`
      );

      res.end();
    }
  }
);


// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Mindful Chat API is running'
  });
});


// =====================================================
// FRONTEND
// =====================================================

app.get('/', (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      '../frontend/index.html'
    )
  );
});


// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});


// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error(
    'Server error:',
    err
  );

  res.status(500).json({
    error: 'Internal server error',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : undefined
  });
});


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(`

✓ Server running at http://localhost:${PORT}


Environment: ${process.env.NODE_ENV || 'development'}
Database: SQLite (./db.sqlite)

Press Ctrl+C to stop the server
  `);
});