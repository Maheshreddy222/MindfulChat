const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'db.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }

  console.log('✓ Connected to SQLite database');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize tables
const initializeTables = () => {
  db.serialize(() => {

    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Users table error:', err);
      else console.log('✓ Users table ready');
    });


    // Conversations table
    db.run(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        title TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) {
        console.error('Conversations table error:', err);
      } else {
        console.log('✓ Conversations table ready');

        // Add userId automatically if this is an existing database
        db.run(`
          ALTER TABLE conversations ADD COLUMN userId INTEGER
        `, (alterErr) => {
          if (
            alterErr &&
            !alterErr.message.includes('duplicate column name')
          ) {
            console.error('Adding userId column error:', alterErr.message);
          }
        });
      }
    });


    // Messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversationId INTEGER NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversationId)
          REFERENCES conversations(id)
          ON DELETE CASCADE
      )
    `, (err) => {
      if (err) console.error('Messages table error:', err);
      else console.log('✓ Messages table ready');
    });


    // Index for messages
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_messages_conversationId
      ON messages(conversationId)
    `, (err) => {
      if (err) console.error('Messages index error:', err);
    });


    // Index for user conversations
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_conversations_userId
      ON conversations(userId)
    `, (err) => {
      if (err) console.error('User conversations index error:', err);
      else console.log('✓ Database indexes ready');
    });

  });
};


// Promise-based wrappers
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else {
        resolve({
          id: this.lastID,
          changes: this.changes
        });
      }
    });
  });
};


const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};


const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};


// Initialize database
initializeTables();


module.exports = {
  db,
  dbRun,
  dbGet,
  dbAll
};