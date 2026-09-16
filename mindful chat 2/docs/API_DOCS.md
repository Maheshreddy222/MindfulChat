# Mindful Chat API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### Conversations

#### Get All Conversations
```http
GET /conversations
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "New Conversation",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
]
```

---

#### Create New Conversation
```http
POST /conversations
Content-Type: application/json

{
  "title": "My First Conversation"
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "My First Conversation",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### Get Conversation with Messages
```http
GET /conversations/:id
```

**Response:**
```json
{
  "id": 1,
  "title": "My First Conversation",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:35:00.000Z",
  "messages": [
    {
      "id": 1,
      "role": "user",
      "content": "Hello, how are you?",
      "createdAt": "2024-01-15T10:31:00.000Z"
    },
    {
      "id": 2,
      "role": "assistant",
      "content": "I'm doing well, thank you for asking!",
      "createdAt": "2024-01-15T10:31:30.000Z"
    }
  ]
}
```

---

#### Delete Conversation
```http
DELETE /conversations/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Conversation deleted"
}
```

---

### Messages

#### Send Message (Streaming Response)
```http
POST /conversations/:id/messages
Content-Type: application/json

{
  "content": "I've been feeling stressed lately"
}
```

**Response Type:** Server-Sent Events (SSE)

The response streams in real-time with the following events:

```
data: {"content": "I'm "}
data: {"content": "sorry "}
data: {"content": "to "}
data: {"content": "hear "}
...
data: {"done": true}
```

**JavaScript Example:**
```javascript
const eventSource = new EventSource(
  `/api/conversations/1/messages`,
  { method: 'POST', body: JSON.stringify({ content: 'Hello' }) }
);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.content) {
    console.log('Streaming:', data.content);
  }
  if (data.done) {
    eventSource.close();
  }
};
```

**Using Fetch with Readable Stream:**
```javascript
const response = await fetch(
  `/api/conversations/1/messages`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: 'Hello' })
  }
);

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const text = decoder.decode(value);
  const lines = text.split('\n');
  
  lines.forEach(line => {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      console.log(data);
    }
  });
}
```

---

### Health Check

#### Server Status
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Mindful Chat API is running"
}
```

---

## Error Responses

All errors return appropriate HTTP status codes with error details:

```json
{
  "error": "Error message describing what went wrong",
  "message": "Additional details (only in development mode)"
}
```

### Common Status Codes
- **200 OK** - Successful GET request
- **201 Created** - Successful POST request (resource created)
- **400 Bad Request** - Invalid input
- **404 Not Found** - Conversation or resource not found
- **500 Internal Server Error** - Server error

---

## Authentication & Security

Currently, the API has **no authentication**. For production:

1. Add JWT token authentication
2. Implement rate limiting
3. Add CORS restrictions
4. Use HTTPS only
5. Sanitize all inputs
6. Add input validation

---

## Rate Limiting

Not implemented yet. Add before production deployment.

---

## CORS

Currently allows all origins. Configure in production:

```javascript
cors({
  origin: ['https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'DELETE']
})
```

---

## Streaming Implementation Details

The message endpoint uses **Server-Sent Events (SSE)** for real-time streaming:

- Headers: `Content-Type: text/event-stream`
- Connection remains open while streaming
- Messages sent as JSON in SSE format: `data: {json}\n\n`
- Automatically closes after `done: true` is sent
- No authentication required (add for production)

---

## Database Schema

### conversations table
```sql
CREATE TABLE conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### messages table
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

## Environment Variables

Required for operation:

```env
PORT=5000
NODE_ENV=development
GOOGLE_API_KEY=your_gemini_api_key
DATABASE_PATH=./db.sqlite
```

---

## Testing with cURL

### Create Conversation
```bash
curl -X POST http://localhost:5000/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Conversation"}'
```

### Send Message (streaming)
```bash
curl -X POST http://localhost:5000/api/conversations/1/messages \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello, how are you?"}' \
  -N
```

### Get All Conversations
```bash
curl http://localhost:5000/api/conversations
```

### Delete Conversation
```bash
curl -X DELETE http://localhost:5000/api/conversations/1
```
