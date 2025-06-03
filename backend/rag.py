from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import ollama
import json

class RAGSystem:
    def __init__(self, employees):
        self.employees = employees
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.index = self._build_index()

    def _employee_to_text(self, employee):
        return (f"{employee['name']} has {employee['experience_years']} years of experience, "
                f"skills: {', '.join(employee['skills'])}, "
                f"projects: {', '.join(employee['projects'])}, "
                f"availability: {employee['availability']}")

    def _build_index(self):
        texts = [self._employee_to_text(emp) for emp in self.employees]
        embeddings = self.model.encode(texts)
        index = faiss.IndexFlatL2(embeddings.shape[1])
        index.add(embeddings)
        return index

    def process_query(self, query):
        # Retrieval
        query_embedding = self.model.encode([query])[0]
        distances, indices = self.index.search(np.array([query_embedding]), k=3)
        
        # Augmentation
        relevant_employees = [self.employees[i] for i in indices[0]]
        context = "\n".join([self._employee_to_text(emp) for emp in relevant_employees])
        prompt = f"Query: {query}\n\nEmployee Data:\n{context}\n\nGenerate a natural language response recommending employees based on the query."

        # Generation
        response = ollama.generate(model='llama3.1', prompt=prompt)
        return response['response']