const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

const GEMINI_MODEL =
  process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const GEMINI_API_BASE =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent`;

if (!GEMINI_API_KEY) {
  console.error(
    '❌ GOOGLE_API_KEY not found in .env file. Chat will not work until this is set.'
  );
}


// =====================================================
// BASE AI PERSONALITY
// =====================================================

const SYSTEM_PROMPT = `
You are Mindful Chat, a compassionate and helpful AI companion.

Rules:
- Be empathetic, supportive, and non-judgmental.
- Answer the user's actual question directly.
- Use simple and easy-to-understand language.
- Do not unnecessarily repeat the user's question.
- Do not diagnose medical or mental health conditions.
- Do not prescribe medication.
- For serious mental health concerns, encourage professional support.
- Maintain a warm and natural conversational tone.

FORMATTING RULES:
- Use **bold text** for important headings.
- Use bullet points with "-" when listing multiple points.
- Keep paragraphs short.
- Do not create unnecessary headings.
`;


// =====================================================
// RESPONSE MODE PROMPTS
// =====================================================

const SIMPLE_MODE_PROMPT = `
RESPONSE MODE: SIMPLE

Give a short and direct answer.

Rules:
- Prefer 2-5 short sentences or a few bullet points.
- Explain only the most important information.
- Use simple words.
- Avoid long introductions.
- Avoid unnecessary details.
- If a heading is useful, use **bold Markdown**.
- Be concise but still helpful.
`;

const DEEP_MODE_PROMPT = `
RESPONSE MODE: DEEP

Give a detailed but well-organized answer.

Rules:
- Explain the reasoning clearly.
- Break complex ideas into simple sections.
- Use **bold Markdown headings** where useful.
- Use bullet points when they improve readability.
- Include examples when useful.
- Do not make the answer unnecessarily long.
`;


// =====================================================
// GEMINI CHAT CLASS
// =====================================================

class GeminiChat {

  constructor() {
    this.conversationHistory = [];
  }


  // ===================================================
  // ADD MESSAGE TO HISTORY
  // ===================================================

  addToHistory(role, content) {

    this.conversationHistory.push({
      role:
        role === 'assistant'
          ? 'model'
          : 'user',

      parts: [
        {
          text: content
        }
      ]
    });

  }


  // ===================================================
  // CLEAR HISTORY
  // ===================================================

  clearHistory() {

    this.conversationHistory = [];

  }


  // ===================================================
  // STREAM RESPONSE
  // ===================================================

  async *streamResponse(
    userMessage,
    mode = 'simple'
  ) {

    if (!GEMINI_API_KEY) {

      throw new Error(
        'GOOGLE_API_KEY is missing. Add it to backend/.env and restart the server.'
      );

    }


    // Select response mode
    const modePrompt =
      mode === 'deep'
        ? DEEP_MODE_PROMPT
        : SIMPLE_MODE_PROMPT;


    // Add current user message
    this.addToHistory(
      'user',
      userMessage
    );


    // Build request body
    const requestBody = {

      contents: [

        // System instructions
        {
          role: 'user',

          parts: [
            {
              text:
                SYSTEM_PROMPT +
                '\n\n' +
                modePrompt
            }
          ]
        },

        // Conversation history
        ...this.conversationHistory
      ],


      generationConfig: {
        temperature: 0.7,

        topP: 0.95,

        topK: 40,

        maxOutputTokens:
          mode === 'deep'
            ? 2048
            : 500,

        candidateCount: 1
      },


      safetySettings: [

        {
          category: 'HARM_CATEGORY_HARASSMENT',

          threshold:
            'BLOCK_MEDIUM_AND_ABOVE'
        },

        {
          category:
            'HARM_CATEGORY_HATE_SPEECH',

          threshold:
            'BLOCK_MEDIUM_AND_ABOVE'
        },

        {
          category:
            'HARM_CATEGORY_SEXUALLY_EXPLICIT',

          threshold:
            'BLOCK_MEDIUM_AND_ABOVE'
        },

        {
          category:
            'HARM_CATEGORY_DANGEROUS_CONTENT',

          threshold:
            'BLOCK_MEDIUM_AND_ABOVE'
        }

      ]

    };


    let response;


    try {

      response = await axios.post(

        `${GEMINI_API_BASE}?key=${GEMINI_API_KEY}&alt=sse`,

        requestBody,

        {

          headers: {
            'Content-Type':
              'application/json',

            'Accept':
              'text/event-stream'
          },


          responseType:
            'stream',


          timeout:
            60000

        }

      );

    } catch (error) {

      const status =
        error.response?.status;

      const apiMessage =
        error.response?.data?.error?.message;


      console.error(
        'Gemini API error:',
        status,
        apiMessage ||
        error.message
      );


      if (
        status === 400 &&
        apiMessage?.includes(
          'API key not valid'
        )
      ) {

        throw new Error(
          'Your GOOGLE_API_KEY is invalid. Double-check it in backend/.env.'
        );

      }


      if (status === 404) {

        throw new Error(
          `Model "${GEMINI_MODEL}" was not found. Check GEMINI_MODEL in your .env file.`
        );

      }


      if (status === 429) {

        throw new Error(
          'Gemini API rate limit or quota exceeded. Please wait and try again.'
        );

      }


      if (status === 403) {

        throw new Error(
          'API key lacks permission or the Generative Language API is not enabled.'
        );

      }


      throw new Error(
        apiMessage ||
        'Failed to get a response from Gemini.'
      );

    }


    // ===================================================
    // PROCESS REAL STREAMING RESPONSE
    // ===================================================

    let buffer = '';

    let fullResponse = '';


    for await (
      const chunk of response.data
    ) {

      buffer +=
        chunk.toString();


      const lines =
        buffer.split('\n');


      // Keep incomplete line for next chunk
      buffer =
        lines.pop() || '';


      for (
        const line of lines
      ) {

        const trimmed =
          line.trim();


        // Ignore empty lines
        if (!trimmed) {
          continue;
        }


        // Gemini SSE data starts with "data:"
        if (
          !trimmed.startsWith(
            'data:'
          )
        ) {
          continue;
        }


        const jsonString =
          trimmed
            .replace(
              /^data:\s*/,
              ''
            );


        if (
          !jsonString ||
          jsonString === '[DONE]'
        ) {
          continue;
        }


        try {

          const data =
            JSON.parse(
              jsonString
            );


          const text =
            data
              ?.candidates
              ?.[0]
              ?.content
              ?.parts
              ?.[0]
              ?.text;


          if (text) {

            fullResponse +=
              text;


            // Send chunk immediately
            yield text;

          }


        } catch (parseError) {

          console.error(
            'Error parsing Gemini stream:',
            parseError.message
          );

        }

      }

    }


    // Check if Gemini returned anything
    if (!fullResponse) {

      throw new Error(
        'Gemini returned an empty response.'
      );

    }


    // Save complete AI response in history
    this.addToHistory(
      'assistant',
      fullResponse
    );

  }


  // ===================================================
  // GET COMPLETE RESPONSE
  // ===================================================

  async getResponse(
    userMessage,
    mode = 'simple'
  ) {

    let fullResponse = '';


    for await (
      const chunk of this.streamResponse(
        userMessage,
        mode
      )
    ) {

      fullResponse += chunk;

    }


    return fullResponse;

  }


  // ===================================================
  // LOAD PREVIOUS CHAT HISTORY
  // ===================================================

  initializeWithHistory(
    messages = []
  ) {

    this.clearHistory();


    messages.forEach(
      msg => {

        this.addToHistory(
          msg.role,
          msg.content
        );

      }
    );

  }

}


module.exports = GeminiChat;