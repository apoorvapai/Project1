from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import os
from rag import RAGSystem
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HR Resource Query Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

class ChatQuery(BaseModel):
    query: str

class SearchQuery(BaseModel):
    skills: list[str] | None = None
    min_experience: int | None = None
    project: str | None = None

# Load employee data
with open("data/employees.json", "r") as f:
    employees = json.load(f)["employees"]

# Initialize RAG system
rag = RAGSystem(employees)

@app.post("/chat")
async def chat(query: ChatQuery):
    try:
        response = rag.process_query(query.query)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/employees/search")
async def search_employees(skills: str = None, min_experience: int = None, project: str = None):
    try:
        filtered_employees = employees
        if skills:
            skills_list = [s.strip().lower() for s in skills.split(",")]
            filtered_employees = [
                emp for emp in filtered_employees
                if any(skill.lower() in [s.lower() for s in emp["skills"]] for skill in skills_list)
            ]
        if min_experience:
            filtered_employees = [
                emp for emp in filtered_employees if emp["experience_years"] >= min_experience
            ]
        if project:
            filtered_employees = [
                emp for emp in filtered_employees
                if any(project.lower() in p.lower() for p in emp["projects"])
            ]
        return {"employees": filtered_employees}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))