from langchain_aws import ChatBedrock
from app.config import settings
from app.agents.state import AgentState

def supervisor_node(state: AgentState):
    llm = ChatBedrock(
        model_id="mistral.mistral-7b-instruct-v0:2", 
        region_name=settings.AWS_REGION
    )
    messages = state["messages"]
    
    system_prompt = (
        "You are a supervisor deciding who should act next.\n"
        "You must respond with EXACTLY ONE of these words: 'Researcher', 'Synthesizer', or 'FINISH'.\n\n"
        "Rules:\n"
        "- If the user asks a factual question that requires research, respond: Researcher\n"
        "- If the last message contains research context and should be answered, respond: Synthesizer\n"
        "- If the conversation is complete and the user is satisfied, respond: FINISH\n\n"
        "Your response must be exactly one word from the list above."
    )
    
    response = llm.invoke([
        {"role": "system", "content": system_prompt},
        *messages
    ])
    
    # Parse the response to extract the decision
    content = response.content.strip()
    
    # Try to match one of the valid options
    if "FINISH" in content.upper():
        decision = "FINISH"
    elif "SYNTHESIZER" in content.upper():
        decision = "Synthesizer"
    elif "RESEARCHER" in content.upper():
        decision = "Researcher"
    else:
        # Default to Synthesizer if unclear and there's context, else Researcher
        has_context = any(
            "retrieved context" in (msg.content or "").lower() 
            for msg in messages 
            if hasattr(msg, 'name') and msg.name == "Researcher"
        )
        decision = "Synthesizer" if has_context else "Researcher"
    
    return {"next": decision}
