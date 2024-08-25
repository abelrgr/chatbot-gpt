# Chatbot GPT (Backend)

This is the backend of the chatbot GPT. It is a REST API that uses the GPT-40 mini model to generate responses to user messages. The backend is using Express.js to create the server and handle the requests, and threads.

## Installation

1. Create an API key on the OpenAI platform.
2. Create an assitant on the OpenAI platform and get assistant key, for example create an asistant with:
```
Only answer the question is if referenced to software development, if not answer the question with a NO-ACTION.
If the answer is valid put a "Can I help you with anything else?" at the end of the response.
The response should be no more than 30 words.
The response should be in the language of the question.
```
3. Set the environment variables `OPENAI_API_KEY1` and `OPENAI_ASSISTANT_KEY` with the API keys.
4. Install the dependencies with `npm install`.
5. Run the server with `npm start`.

## Endpoints

### GET /
Returns a welcome message.

### GET /thread
Returns the current thread id to start a new conversation.

### POST /message
Send a message to the chatbot and get a response.

