from kag_solver import KAGSolver
import sys

def test_kag():
    print("🚀 Starting KAG Solver Test...")
    solver = KAGSolver()
    
    # 1. Inspect Graph Content
    print(f"\n📊 Graph Stats: {solver.graph.number_of_nodes()} Nodes, {solver.graph.number_of_edges()} Edges")
    
    if solver.graph.number_of_nodes() == 0:
        print("❌ Graph is empty! Please run build_knowledge_graph.py first.")
        return

    print("\n🔍 Existing Nodes (First 5):")
    nodes = list(solver.graph.nodes())[:5]
    for n in nodes:
        print(f"  - {n}")

    # 2. Test Reasoning on specific mock concepts we know exist
    # From our Mock Fallback: result = [{"subject": "MockSubject", ...}, {"subject": "Photosynthesis", ...}]
    
    test_concepts = ["Photosynthesis", "MockSubject"]
    
    for concept in test_concepts:
        print(f"\n🧪 Testing Query: 'What produces Oxygen?' (Targeting {concept})")
        # We manually construct a query containing the concept to trigger the solver
        fake_question = f"How does {concept} work and what does it create?"
        
        response = solver.solve_question(fake_question)
        print(response)
        
if __name__ == "__main__":
    test_kag()
