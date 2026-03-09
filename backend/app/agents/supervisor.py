from langchain_aws import ChatBedrock
from pydantic import BaseModel, Field
from typing import Literal
from app.config import settings
from app.agents.state import AgentState

class RouterParams(BaseModel):
    next: Literal["Researcher", "Synthesizer", "FINISH"] = Field(
        description="The next agent to act. If the user needs new info, use Researcher. If research context is provided, use Synthesizer. If the conversation should end, use FINISH."
    )

def supervisor_node(state: AgentState):
    llm = ChatBedrock(model_id="mistral.mistral-7b-instruct-v0:2", region_name=settings.AWS_REGION)
    messages = state["messages"]
    
    system_prompt = (
        "You are a supervisor deciding who should act next. "
        "Options: 'Researcher', 'Synthesizer', or 'FINISH'.\n"
        "If the user asks a factual question, route to 'Researcher'.\n"
        "If 'Researcher' just provided context, route to 'Synthesizer' to answer the user.\n"
        "If the user is satisfied, route to 'FINISH'."
    )
    
    router_llm = llm.with_structured_output(RouterParams)
    decision = router_llm.invoke([{"role": "system", "content": system_prompt}] + messages)
    
    return {"next": decision.next}
