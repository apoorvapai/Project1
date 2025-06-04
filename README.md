### HR Resource Query Chatbot
### Overview
The HR Resource Query Chatbot is a web application designed to assist HR teams in finding suitable candidates from an employee database based on specific skill and experience requirements. Users can input natural language queries (e.g., "Find Python developers with 3+ years experience"), and the system returns a structured response listing matching candidates followed by reasoning for the selection. The project leverages a Retrieval-Augmented Generation (RAG) approach, combining semantic search with a local LLM for response refinement, ensuring accurate and professional outputs without relying on external APIs.

### Features
**Natural Language Queries:** Process queries in plain English to search for employees by skills, experience, projects, or availability.
**Semantic Search:** Uses sentence-transformers and FAISS for vector-based similarity search to match queries with employee profiles.
**Structured Output:** Returns candidate details (name, experience, skills, projects, availability) followed by reasoning for selection or exclusion.
**Responsive UI:** Built with React, providing a clean interface for query input and result display.
**Local Execution:** Runs entirely on local hardware, prioritizing privacy and zero external API costs.

### Architecture
The system follows a modular, client-server architecture:

### Frontend (React):

- Built with React for a dynamic, single-page application.
 - Components: App.jsx for query input and result display, EmployeeCard.jsx for rendering candidate details.
- Communicates with the backend via HTTP POST requests to /chat.


### Backend (FastAPI):

- Built with FastAPI for high-performance API endpoints.
- main.py: Defines the /chat endpoint, handling query processing and CORS for frontend integration.
- rag.py: Implements the RAG system, combining semantic search and LLM refinement.
- Semantic Search: Uses sentence-transformers (all-MiniLM-L6-v2) to encode employee data and queries.
- LLM Refinement: Calls Ollama to polish responses, with a fallback to raw output if Ollama fails.


**Data:**
employees.json stores employee profiles (name, experience_years, skills, projects, availability).


**Local LLM (Ollama):**

Runs llama3.1 locally for response refinement, ensuring privacy and no external API costs.



### Data Flow:

User submits a query via the frontend.
Frontend sends a POST request to /chat with the query.

Backend’s RAG system:
Encodes the query using sentence-transformers.
Searches FAISS index for top-3 matching employees.
Filters for Python developers with 3+ years experience.
Generates a draft response with candidate details and reasoning.
Refines the response using Ollama.
Backend returns the response to the frontend for display.


### Setup & Installation
Follow these steps to run the chatbot locally on a Windows system.
Prerequisites

Git: Install from git-scm.com (git --version).
Node.js: Install v16+ from nodejs.org (node --version).
Python: Install v3.10+ from python.org (python --version).
Ollama: Download from ollama.com and install.

### Steps

Clone the Repository:
```bash
git clone https://github.com/your-username/hr-chatbot.git
```
```bash
cd hr-chatbot
```

**Set Up Ollama:**

Install Ollama and pull llamma3.1:
```bash 
ollama pull llama3.1
```
```bash
ollama run llama3.1
```

Keep this running in a separate Command Prompt.


**Set Up Backend:**
Move to backend folder
```bash
cd backend
```
Install the necessary packages
```bash
pip install -r requirements.txt
```
Start the Server
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Requirements (requirements.txt):
```bash
fastapi==0.115.0
uvicorn==0.31.1
sentence-transformers==3.1.1
faiss-cpu==1.9.0
ollama==0.3.3
pydantic==2.9.2
```



Set Up Frontend:
Move to frontend folder
```bash
cd frontend
```
Install the necessary packages
```bash
npm install
```
Start the server
```bash
npm start
```

Opens http://localhost:3000 in your browser.


### Test the Application:

Navigate to http://localhost:3000.
Enter: "Find Python developers with 3+ years experience."
Verify output includes match1, match2, and reasoning.



### API Documentation
The backend exposes a single endpoint for querying the chatbot.
Endpoint: /chat

Method: POST
```bash
URL: http://localhost:8000/chat
Request Body:{
  "query": "string"
}
```

query: Natural language query (e.g., "Find Python developers with 3+ years experience").

```bash
Response:{
  "response": "string"
}
```

response: Structured text with candidate details and reasoning.

```bash
Example:curl -X POST http://localhost:8000/chat -H "Content-Type: application/json" -d "{\"query\": \"Find Python developers with 3+ years experience\"}"
```

```bash
Response:{
  "response": "Based on your requirements for Python developers with 3+ years experience, I found 2 excellent candidates:\n\n**Olivia Davis** would be a strong candidate. They have 3 years of experience, with skills including Python, Flask, Redis. They have worked on projects such as Real-time Analytics Dashboard. Availability: available.\n\n**Alice Johnson** would be a strong candidate. They have 5 years of experience, with skills including Python, React, AWS. They have worked on projects such as E-commerce Platform, Healthcare Dashboard. Availability: available.\n\nThese candidates were selected because they have 3+ years of experience with Python and relevant project experience. Other Python developers, such as Sophia Martinez, were not selected as their experience or skills (e.g., focus on frameworks like Django) may not align as closely with your needs."
}
```


### AI Development Process
AI tools played a significant role in developing this project, streamlining various phases.

**AI Coding Assistants Used:**

Grok: Primary assistant for code generation, debugging, and architectural guidance.


**How AI Helped:**

Code Generation: Grok generated initial versions of rag.py, main.py, and App.jsx, including the RAG pipeline and React components. 
Debugging: Grok identified issues in FAISS indexing and Ollama integration.
Architecture Decisions: Grok proposed the RAG architecture (semantic search + LLM) and recommended sentence-transformers for embeddings and FAISS for vector search, balancing performance and simplicity.

**Percentage of Code:**

AI-Assisted: ~30% (initial drafts of backend logic, frontend components, and Dockerfile).
Hand-Written: ~70% (customizations for local setup, query filtering logic, and UI styling tweaks).


### Technical Decisions

**OpenAI vs Open-Source Models:**

Choice: Used Ollama (open-source) instead of OpenAI’s GPT models.
Reason: OpenAI requires a paid API key, conflicting with the no-cost constraint. Open-source models via Ollama run locally, ensuring zero cost and data privacy.
Trade-Offs: Ollama is less powerful than GPT-4, producing simpler refinements, but sufficient for polishing responses. Local execution avoids latency and privacy risks of cloud APIs.


**Local LLM (Ollama) vs Cloud API:**

Choice: Local Ollama .
Reason: Cloud APIs (e.g., OpenAI, Anthropic) require payment, Local Ollama uses existing hardware, avoiding external dependencies.
Trade-Offs:
Performance: Local execution is slower on low-end hardware.
Cost: Zero cost vs. potential cloud fees.
Privacy: Local processing keeps employee data secure, critical for HR applications.




**Performance vs Cost vs Privacy:**

Performance: Sacrificed some response quality (using tinyllama vs. larger models) for cost and privacy benefits. FAISS and sentence-transformers ensure fast search.
Cost: Prioritized free tools (FastAPI, React, Ollama) and local execution to meet no-credit-card constraint.
Privacy: Local LLM and data storage (employees.json) prevent data leaks, aligning with HR data sensitivity.



### Future Improvements
With more time, I would:

Advanced Search: Add filters for location, salary, or certifications in queries.
UI Upgrades: Implement pagination for results and a query history feature.
Cloud Deployment: Explore persistent free hosting (e.g., Replit with paid upgrades) for Ollama, avoiding session timeouts.
Testing: Add unit tests for rag.py and end-to-end tests for the API and frontend.
Analytics: Track query patterns to suggest trending skills or roles.

### Demo


https://github.com/user-attachments/assets/cf7fff70-dbe4-4c7a-a10a-d3c45c733972

Screenshots:

<img width="1280" alt="Screenshot 2025-06-04 at 9 13 31 AM" src="https://github.com/user-attachments/assets/9a2c35d8-d86e-4714-a2d8-c50ba06e4a50" />
<img width="1280" alt="Screenshot 2025-06-04 at 9 14 39 AM" src="https://github.com/user-attachments/assets/09b3b99e-9085-45ff-b359-a633b23bb29f" />



