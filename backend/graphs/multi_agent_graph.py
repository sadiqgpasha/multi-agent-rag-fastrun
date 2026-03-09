from langgraph.graph import StateGraph, START, END
from app.agents.state import AgentState
from app.agents.nodes import researcher_node, synthesizer_node
from app.agents.supervisor import supervisor_node

def build_graph():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("Supervisor", supervisor_node)
    workflow.add_node("Researcher", researcher_node)
    workflow.add_node("Synthesizer", synthesizer_node)
    
    workflow.add_edge(START, "Supervisor")
    
    workflow.add_conditional_edges(
        "Supervisor",
        lambda x: x["next"],
        {
            "Researcher": "Researcher",
            "Synthesizer": "Synthesizer",
            "FINISH": END
        }
    )
    
    workflow.add_edge("Researcher", "Supervisor")
    workflow.add_edge("Synthesizer", "Supervisor")
    
    return workflow.compile()

graph = build_graph()
