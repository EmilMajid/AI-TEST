import json
import networkx as nx
from pathlib import Path
import sys

def build_knowledge_graph(chunks_file: str, output_dir: str = "data"):
    """
    Reads chunks.jsonl, extracts triples from the 'knowledge' field,
    and builds a NetworkX graph.
    """
    graph = nx.DiGraph()
    chunks_path = Path(chunks_file)
    
    if not chunks_path.exists():
        print(f"Error: {chunks_file} not found.")
        return

    print(f"Reading chunks from {chunks_file}...")
    
    triple_count = 0
    with open(chunks_path, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip():
                continue
            
            try:
                chunk = json.loads(line)
                knowledge_raw = chunk.get("knowledge")
                
                if not knowledge_raw:
                    continue
                
                # Knowledge might be a JSON string or already parsed list (depending on extraction output)
                # The llm_utils returns a JSON string, so we need to parse it if it's a string
                triples = []
                if isinstance(knowledge_raw, str):
                    try:
                        # Sometimes LLM returns markdown code blocks ```json ... ```
                        clean_json = knowledge_raw.replace("```json", "").replace("```", "").strip()
                        triples = json.loads(clean_json)
                    except json.JSONDecodeError:
                        # print(f"Warning: Could not parse knowledge JSON: {knowledge_raw[:50]}...")
                        continue
                elif isinstance(knowledge_raw, list):
                    triples = knowledge_raw
                
                if not isinstance(triples, list):
                    continue

                for triple in triples:
                    subj = triple.get("subject")
                    pred = triple.get("predicate")
                    obj = triple.get("object")
                    
                    if subj and pred and obj:
                        # Add nodes (implicitly created if not exist)
                        graph.add_node(subj, type="entity")
                        graph.add_node(obj, type="entity")
                        
                        # Add edge
                        # Handle potential None for source_chunk_id
                        chunk_id = chunk.get("id")
                        if chunk_id is None:
                            chunk_id = "unknown"
                        
                        graph.add_edge(subj, obj, relation=pred, source_chunk_id=str(chunk_id))
                        triple_count += 1
                        
            except Exception as e:
                print(f"Error processing line: {e}")
                continue

    print(f"Graph built with {graph.number_of_nodes()} nodes and {graph.number_of_edges()} edges.")
    
    # Save Graph
    out_path = Path(output_dir)
    out_path.mkdir(exist_ok=True)
    
    # 1. Save as GEXF (for Gephi visualization)
    gexf_path = out_path / "knowledge_graph.gexf"
    nx.write_gexf(graph, gexf_path)
    print(f"Saved GEXF to {gexf_path}")
    
    # 2. Save as JSON (node-link data) for frontend
    json_path = out_path / "knowledge_graph.json"
    data = nx.node_link_data(graph)
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Saved JSON to {json_path}")
    
    return graph

if __name__ == "__main__":
    # Default path assuming script is run from project root
    chunks_file = "data/textbook-chunks.jsonl"
    build_knowledge_graph(chunks_file)
