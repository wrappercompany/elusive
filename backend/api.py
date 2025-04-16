from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uuid
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional

# Load environment variables
from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file

# Import services
from services.supabase import DBConnection
from services.llm import make_llm_api_call

# Models
class ThreadCreate(BaseModel):
    project_id: str

class MessageCreate(BaseModel):
    content: str

class ProjectCreate(BaseModel):
    name: str

# Create FastAPI instance
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db = DBConnection()
    await db.initialize()
    yield
    # Shutdown
    await db.disconnect()

app = FastAPI(lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/api/health-check")
async def health_check():
    return {
        "status": "ok", 
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "instance_id": str(uuid.uuid4())[:8]
    }

# Project endpoints
@app.post("/api/project")
async def create_project(project_data: ProjectCreate):
    db = DBConnection()
    client = await db.client
    
    # Create project
    project_result = await client.table('projects').insert({
        'name': project_data.name,
    }).execute()
    
    return project_result.data[0]

# Thread endpoints
@app.post("/api/thread")
async def create_thread(thread_data: ThreadCreate):
    db = DBConnection()
    client = await db.client
    
    project_id = thread_data.project_id
    if not is_valid_uuid(project_id):
        # Try to find project by name
        project_response = await client.table('projects').select('project_id').eq('name', project_id).execute()
        
        if project_response.data and len(project_response.data) > 0:
            # Use the existing project ID
            project_id = project_response.data[0]['project_id']
        else:
            # Create a new project with this name
            project_result = await client.table('projects').insert({
                'name': project_id,
            }).execute()
            project_id = project_result.data[0]['project_id']
    else:
        # Verify the project exists
        project_response = await client.table('projects').select('project_id').eq('project_id', project_id).execute()
        if not project_response.data or len(project_response.data) == 0:
            raise HTTPException(status_code=404, detail=f"Project with ID {project_id} not found")
    
    # Create thread
    thread_result = await client.table('threads').insert({
        'project_id': project_id,
    }).execute()
    
    return thread_result.data[0]

# Helper function to check if a string is a valid UUID
def is_valid_uuid(val):
    try:
        uuid.UUID(str(val))
        return True
    except ValueError:
        return False

@app.get("/api/thread/{thread_id}/messages")
async def get_thread_messages(thread_id: str):
    db = DBConnection()
    client = await db.client
    
    # Get messages
    messages = await client.table('messages').select('*').eq('thread_id', thread_id).order('created_at').execute()
    
    return messages.data

@app.post("/api/thread/{thread_id}/message")
async def add_message(thread_id: str, message: MessageCreate):
    db = DBConnection()
    client = await db.client
    
    # Add message
    message_result = await client.table('messages').insert({
        'thread_id': thread_id,
        'type': 'text',
        'content': message.content,
        'is_llm_message': False
    }).execute()
    
    return message_result.data[0]

# Agent endpoint
@app.post("/api/thread/{thread_id}/agent/run")
async def run_agent(thread_id: str):
    db = DBConnection()
    client = await db.client
    
    # Create agent run
    agent_run = await client.table('agent_runs').insert({
        'thread_id': thread_id,
        'status': 'running',
        'started_at': datetime.now(timezone.utc).isoformat()
    }).execute()
    
    # Get thread messages
    messages = await client.table('messages').select('*').eq('thread_id', thread_id).order('created_at').execute()
    
    # Format messages for LLM
    formatted_messages = [
        {"role": "system", "content": "You are a helpful assistant."}
    ]
    
    for msg in messages.data:
        role = "assistant" if msg.get('is_llm_message') else "user"
        formatted_messages.append({"role": role, "content": msg.get('content')})
    
    # Make LLM call
    response = await make_llm_api_call(
        messages=formatted_messages,
        model_name="gpt-4o",  # or your preferred model
        temperature=0,
    )
    
    # Save response
    await client.table('messages').insert({
        'thread_id': thread_id,
        'type': 'text',
        'content': response.choices[0].message.content,
        'is_llm_message': True
    }).execute()
    
    # Update agent run status
    await client.table('agent_runs').update({
        'status': 'completed',
        'completed_at': datetime.now(timezone.utc).isoformat()
    }).eq('id', agent_run.data[0]['id']).execute()
    
    return {
        "status": "completed",
        "response": response.choices[0].message.content
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 