# DocuChat- Gemini PDF Chatbot with Authentication and Chat History
This is a full-stack chatbot application built using **React.js**, **Supabase**, and **FastAPI**. It integrates with the **Gemini API** to allow authenticated users to upload PDF documents, ask questions about them, and receive intelligent responses. Chat History is stored for each user.
#### 🌐 Live Demo - [DocuChat AI](https://docuchat-ai-five.vercel.app/)
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

---

## 🛠️ Technologies Used

- **Frontend:** React.js, TailwindCSS
- **Backend:** FastAPI, Uvicorn, Langchain
- **Auth & DB:** Supabase
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
- Response: { "answer": <corresponding_ans> }

---

## Sample Queries & Responses
- *See:* `sample_chat_log.txt`
- *For testing:* Use `testing.pdf`

---

## Citation
- Gemini API documentation: https://ai.google.dev
- Supabase documentation: https://supabase.io/docs
- FastAPI documentation: https://fastapi.tiangolo.com

---

## PFA-
- ![image](https://github.com/user-attachments/assets/545e1a2b-430b-4da9-8929-e36d6cde9c89)
- ![image](https://github.com/user-attachments/assets/b4163e18-6bd7-485e-8de1-615ae71667b2)
- ![image](https://github.com/user-attachments/assets/9c7d751e-8632-4f9d-905b-692f6a3a5c92)
- ![image](https://github.com/user-attachments/assets/1ed65b7f-e873-4d49-92ec-d067b9f4115c)
- ![image](https://github.com/user-attachments/assets/2e5611f1-5419-40a1-811f-0364614bfc1e)
