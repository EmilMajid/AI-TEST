import networkx as nx
import json
from pathlib import Path
import sys

# Try to import llm_utils, add fallback if needed
try:
    from llm_utils import extract_triples, call_openai_compatible
except ImportError:
    import sys
    sys.path.append(str(Path(__file__).parent))
    from llm_utils import extract_triples, call_openai_compatible

class KAGSolver:
    """
    KAG (Knowledge-Augmented Generation) Solver.
    Uses a Knowledge Graph to answer questions by traversing relationships
    instead of just retrieving similar text.
    """
    
    def __init__(self, graph_path="data/knowledge_graph.gexf"):
        self.graph = None
        self.graph_path = Path(graph_path)
        self.load_graph()

    def load_graph(self):
        """Loads the Knowledge Graph from GEXF file."""
        if self.graph_path.exists():
            try:
                self.graph = nx.read_gexf(self.graph_path)
                print(f"✅ Knowledge Graph loaded: {self.graph.number_of_nodes()} concepts, {self.graph.number_of_edges()} relations.")
            except Exception as e:
                print(f"❌ Error loading graph: {e}")
                self.graph = nx.DiGraph() # Empty graph fallback
        else:
            print(f"⚠️ Graph file not found at {self.graph_path}. creating empty graph.")
            self.graph = nx.DiGraph()

    def find_concept(self, query):
        """
        Simple Entity Linking: Finds the graph node that best matches the query.
        (Case-insensitive substring match)
        """
        query_lower = query.lower()
        matches = []
        for node in self.graph.nodes():
            if query_lower in node.lower():
                matches.append(node)
        
        # Sort by length (prefer exact match)
        matches.sort(key=len)
        return matches[0] if matches else None

    def get_context(self, concept, depth=1):
        """
        Retrieves the 'Knowledge Context' - the concept and its neighbors.
        Returns a list of readable strings describing the relations.
        """
        if not concept or concept not in self.graph:
            return []

        context_lines = []
        
        # 1. Direct relations (Outgoing)
        if hasattr(self.graph, 'out_edges'):
             out_edges = self.graph.out_edges(concept, data=True)
             for u, v, data in out_edges:
                 relation = data.get("relation", "related_to")
                 context_lines.append(f"{u} -> [{relation}] -> {v}")
        
        # 2. Incoming relations (What leads to this concept?)
        if hasattr(self.graph, 'in_edges'):
            in_edges = self.graph.in_edges(concept, data=True)
            for u, v, data in in_edges:
                relation = data.get("relation", "related_to")
                context_lines.append(f"{u} -> [{relation}] -> {v}")
                
        return context_lines

    def solve_question(self, question):
        """
        Main entry point for KAG:
        1. Parse Question (Identify Entity)
        2. Lookup in Graph
        3. Retrieve Logical Context
        4. Synthesize Answer (via LLM - simplified here)
        """
        print(f"🤔 Analyzing question: '{question}'...")
        
        # Step 1: Identify Key Concept (Simplified)
        # In a real system, use LLM to extract entity. Here we check likely words.
        target_concept = None
        words = question.split()
        
        # Try finding any word/phrase from question in our graph
        for node in self.graph.nodes():
            if node.lower() in question.lower():
                # Pick the longest matching concept (greedy)
                if target_concept is None or len(node) > len(target_concept):
                    target_concept = node
        
        if not target_concept:
            return "Mən bu sualdakı əsas anlayışı Bilik Bazasında tapa bilmədim. (Entity not found)"

        print(f"💡 Identified Concept: '{target_concept}'")
        
        # Step 2 & 3: Get Graph Context
        facts = self.get_context(target_concept)
        
        if not facts:
            return f"'{target_concept}' haqqında məlumatım var, amma heç bir əlaqə tapılmadı."
            
        facts_text = "\n".join(facts)
        
        # Step 4: Synthesize Answer
        # In a full system, we send `facts_text` to LLM.
        # Here we just return the reasoning trace.
        
        response = f"""
KAG Reasoning Trace:
-------------------
Identified Key Concept: {target_concept}

Knowledge Graph Facts:
{facts_text}

Derived Answer:
Bilik qrafikimə əsasən, {target_concept} aşağıdakı əlaqələrə malikdir:
{facts_text}
"""
        return response

if __name__ == "__main__":
    # Simple CLI test
    solver = KAGSolver()
    
    # Check if we have nodes (Mock data might be sparse)
    if solver.graph.number_of_nodes() > 0:
        first_node = list(solver.graph.nodes())[0]
        print("\nTest Query for first node:")
        print(solver.solve_question(f"Tell me about {first_node}"))
    else:
        print("Graph is empty, cannot run test.")
