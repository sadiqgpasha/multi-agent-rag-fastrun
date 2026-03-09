from langchain_aws import ChatBedrock
from langchain_core.messages import SystemMessage
from app.config import settings
from app.agents.state import AgentState
from app.rag.retriever import get_retriever

llm = ChatBedrock(model_id="mistral.mistral-7b-instruct-v0:2", region_name=settings.AWS_REGION)

def researcher_node(state: AgentState):
    """Retrieves context using RAG based on the latest user message"""
    messages = state["messages"]
    last_message = messages[-1].content
    
    retriever = get_retriever()
    docs = retriever.invoke(last_message)
    
    context = "\n\n".join(doc.page_content for doc in docs)
    response = f"Here is the retrieved context for the user query:\n{context}"
    
    return {"messages": [SystemMessage(content=response, name="Researcher")]}

def synthesizer_node(state: AgentState):
    """Synthesizes the final answer using the original query and research context"""
    messages = state["messages"]
    
    system_msg = SystemMessage(
        content="You are a helpful assistant. Answer the user's question using the provided research context."
    )
    
    response = llm.invoke([system_msg] + messages)
    # The response is an AIMessage, we can tag its name
    response.name = "Synthesizer"
    return {"messages": [response]}
