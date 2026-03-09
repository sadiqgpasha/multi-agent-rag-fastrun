import os
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
from langchain_core.messages import HumanMessage
from graphs.multi_agent_graph import graph

router = APIRouter()

class MessageDict(BaseModel):
    role: str
    content: str
    
class ChatRequest(BaseModel):
    messages: List[MessageDict]

async def event_generator(messages):
    human_msg = HumanMessage(content=messages[-1].content)
    
    async for event in graph.astream_events({"messages": [human_msg]}, version="v2"):
        if event["event"] == "on_chat_model_stream" and event["metadata"].get("langgraph_node") == "Synthesizer":
            chunk = event["data"]["chunk"]
            if chunk.content:
                yield chunk.content

@router.post("/")
async def chat_interaction(request: ChatRequest):
    return StreamingResponse(event_generator(request.messages), media_type="text/event-stream")
