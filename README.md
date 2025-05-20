# DocuChat- Gemini PDF Chatbot with Authentication and Chat History
This is a full-stack chatbot application built using **React.js**, **Supabase**, and **FastAPI**. It integrates with the **Gemini API** to allow authenticated users to upload PDF documents, ask questions about them, and receive intelligent responses. Chat History is stored for each user.

---

## Features
### User Authentication
- User registration, login, and logout using Supabase Auth.
- Access control: Only logged-in users can interact with the chatbot.
### Gemini Chatbot
- Users can upload PDF documents.
- Extracts text using `pdf-parse`.
- Sends queries to the Gemini API and returns meaningful responses.
### Chat History (Stored in PostgreSQL via Supabase)
- Stores:
  - User ID
  - Timestamp
  - User Query
  - Chatbot Response
- Authenticated users can view their previous conversations.
### Deployment
- Frontend deployed on [Vercel](https://docuchat-ai-five.vercel.app/)
- Backend deployed on [Render](https://docuchat-ai.onrender.com)

---

## 🛠️ Technologies Used

- **Frontend:** React.js, TailwindCSS
- **Backend:** FastAPI, Uvicorn, Langchain
- **Auth & DB:** Supabase (PostgreSQL)
- **PDF Parsing:** `pdf-parse`
- **LLM API:** Gemini API (Google Generative AI)
- **Deployment:** Vercel (frontend), Render (backend)

---

## Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd DocuChat_AI
```

#### Install dependencies: *(in frontend and backend folders)*
```
npm install
```

#### Set up environment variables (.env file): *(in backend folder)*
```bash
GOOGLE_API_KEY=<your_google_api_key>
```

#### Set up environment variables (.env file): *(in frontend folder)*
```bash
VITE_SUPABASE_URL=<supabase_url>
VITE_SUPABASE_ANON_KEY=<supabase_anon_key>
VITE_BACKEND_URL=<backend_url>
```

#### Run the backend: *(in backend folder)*
```
uvicorn server:app --reload --port 5000
```

#### Run the frontend: *(in frontend folder)*
```
npm run dev
```

---

## API Endpoints
#### POST /upload_pdf
- Accepts a multipart/form-data file
- Extracts and stores PDF content

#### POST /ask
- Request: { "question": <any_ques_from_pdf> }
- Response: { "answer": <response> }

---

## Sample Queries & Responses
- *See: sample_chat_log.txt*

---

## Citation
- Gemini API documentation: https://ai.google.dev
- Supabase documentation: https://supabase.io/docs
- FastAPI documentation: https://fastapi.tiangolo.com
