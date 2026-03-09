import os
import json
import logging
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
from langchain_core.messages import HumanMessage
from graphs.multi_agent_graph import graph

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class MessageDict(BaseModel):
    role: str
    content: str
    
class ChatRequest(BaseModel):
    messages: List[MessageDict]

async def event_generator(messages: List[MessageDict]):
    """Generate simple text stream for AI SDK"""
    human_msg = HumanMessage(content=messages[-1].content)
    
    try:
        async for event in graph.astream_events({"messages": [human_msg], "next": ""}, version="v2"):
            event_type = event.get("event", "")
            metadata = event.get("metadata", {})
            node_name = metadata.get("langgraph_node", "")
            
            # Stream tokens from Synthesizer node
            if event_type == "on_chat_model_stream" and node_name == "Synthesizer":
                chunk = event.get("data", {}).get("chunk", {})
                content = getattr(chunk, 'content', None)
                
                # Only stream if it's a string with actual content
                if isinstance(content, str) and content:
                    yield content
            
            # Log agent activity
            elif event_type == "on_chain_start":
                logger.info(f"Agent started: {node_name}")
            elif event_type == "on_chain_end":
                logger.info(f"Agent completed: {node_name}")
                
    except Exception as e:
        logger.error(f"Error in event generator: {str(e)}")
        yield f"Error: {str(e)}"

@router.post("/")
async def chat_interaction(request: ChatRequest):
    return StreamingResponse(
        event_generator(request.messages), 
        media_type="text/plain; charset=utf-8",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )
