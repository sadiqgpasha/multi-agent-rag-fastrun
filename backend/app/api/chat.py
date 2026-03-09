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

async def event_generator(messages):
    """Generate SSE events for the Vercel AI SDK"""
    human_msg = HumanMessage(content=messages[-1].content)
    full_content = ""
    message_id = f"msg-{os.urandom(4).hex()}"
    
    # Send initial message event
    yield f'data: {{"id": "{message_id}", "role": "assistant", "content": ""}}\n\n'
    
    try:
        async for event in graph.astream_events({"messages": [human_msg], "next": ""}, version="v2"):
            event_type = event.get("event", "")
            metadata = event.get("metadata", {})
            node_name = metadata.get("langgraph_node", "")
            
            # Stream tokens from Synthesizer node
            if event_type == "on_chat_model_stream" and node_name == "Synthesizer":
                chunk = event.get("data", {}).get("chunk", {})
                if hasattr(chunk, 'content') and chunk.content:
                    full_content += chunk.content
                    # Send SSE formatted for Vercel AI SDK
                    yield f'data: {{"id": "{message_id}", "role": "assistant", "content": {json.dumps(full_content)}}}\n\n'
            
            # Log agent activity for debugging
            elif event_type == "on_chain_start":
                logger.info(f"Agent started: {node_name}")
            elif event_type == "on_chain_end":
                logger.info(f"Agent completed: {node_name}")
                
    except Exception as e:
        logger.error(f"Error in event generator: {str(e)}")
        error_msg = f"Error processing request: {str(e)}"
        yield f'data: {{"id": "{message_id}", "role": "assistant", "content": {json.dumps(error_msg)}}}\n\n'
    
    # Send completion marker
    yield f'data: {{"id": "{message_id}", "role": "assistant", "content": {json.dumps(full_content)}, "finish_reason": "stop"}}\n\n'
    yield 'data: [DONE]\n\n'

@router.post("/")
async def chat_interaction(request: ChatRequest):
    return StreamingResponse(event_generator(request.messages), media_type="text/event-stream")
