from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import shutil
import google.generativeai as genai
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains.question_answering import load_qa_chain
from langchain_core.prompts import PromptTemplate
import uuid

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# FastAPI setup
app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request body model
class QARequest(BaseModel):
    text: str
    question: str


# Utility functions
def get_text_chunks(text: str):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=10000, chunk_overlap=1000
    )
    chunks = text_splitter.split_text(text)
    return chunks


def get_vector_store(text_chunks, index_name):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local(index_name)
    return index_name


def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context. If the answer is not in
    the provided context, just say "answer is not available in the context" and do not guess.

    Context:
    {context}

    Question:
    {question}

    Answer:
    """

    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3)
    prompt = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain


current_index_name = None

class PDFContentRequest(BaseModel):
    text: str

class QueryRequest(BaseModel):
    question: str

@app.post("/upload_pdf")
async def upload_pdf_content(request: PDFContentRequest):
    global current_index_name
    try:
        # Create a unique index name
        current_index_name = f"faiss_index_{uuid.uuid4().hex}"

        # Split text & create vector store
        text_chunks = get_text_chunks(request.text)
        get_vector_store(text_chunks, current_index_name)

        return {"message": "PDF content processed and index created."}
    except Exception as e:
        print("Error in /upload_pdf:", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ask")
async def ask_question(request: QueryRequest):
    global current_index_name
    if not current_index_name:
        raise HTTPException(status_code=400, detail="No PDF content indexed. Upload PDF content first.")

    try:
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        db = FAISS.load_local(current_index_name, embeddings, allow_dangerous_deserialization=True)
        docs = db.similarity_search(request.question)

        chain = get_conversational_chain()
        result = chain(
            {"input_documents": docs, "question": request.question},
            return_only_outputs=True
        )

        return {"answer": result["output_text"]}

    except Exception as e:
        print("Error in /ask:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/clear_pdf")
async def clear_pdf_context():
    global current_index_name
    try:
        if current_index_name:
            shutil.rmtree(current_index_name, ignore_errors=True)
            current_index_name = None
        return {"status": "success", "message": "PDF context cleared."}
    except Exception as e:
        return {"status": "error", "message": str(e)}