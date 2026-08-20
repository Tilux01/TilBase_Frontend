import React, { useState, useEffect } from 'react';
import DocsLayout from '../DocsLayout';
import CodeWindow from '../../../Components/CodeWindow';

const sections = [
    { id: 'concepts', title: 'Core Concepts' },
    { id: 'nodes', title: 'Managing Nodes' },
    { id: 'edges', title: 'Managing Edges' },
    { id: 'queries', title: 'Graph Traversal' },
    { id: 'global', title: 'Global Graph Operations' },
    { id: 'realtime', title: 'Real-time Listeners' },
];

const DocsGraphDB = () => {
    const [activeSection, setActiveSection] = useState(sections[0].id);

    useEffect(() => {
        const handleScroll = () => {
            let current = '';
            sections.forEach(section => {
                const element = document.getElementById(section.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 200 && rect.bottom >= 200) {
                        current = section.id;
                    }
                }
            });
            if (current && current !== activeSection) {
                setActiveSection(current);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeSection]);

    const scrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const toc = (
        <div className="space-y-1">
            {sections.map((section) => (
                <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeSection === section.id 
                            ? 'bg-surface-container-highest text-primary font-bold' 
                            : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                >
                    {section.title}
                </button>
            ))}
        </div>
    );

    return (
        <DocsLayout toc={toc}>
            <div className="mb-12 border-b border-black/5 dark:border-black/5 dark:border-white/5 pb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm">Database SDKs</span>
                    <span className="material-symbols-outlined text-outline-variant/50 text-[16px]">chevron_right</span>
                    <span className="text-on-surface-variant font-medium text-sm">Graph DB</span>
                </div>
                <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-4">
                    Graph DB SDK
                </h1>
                <p className="text-on-surface-variant text-base max-w-3xl leading-relaxed">
                    Designed for highly interconnected data. The Graph engine maps complex relationships instantly, making it perfect for social networks, recommendation systems, and mapping physical networks.
                </p>
            </div>

            <section id="concepts" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">hub</span>
                    Core Concepts
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    In a Graph database, entities (like users, places, or objects) are stored as <strong>Nodes</strong>. The relationships connecting those entities (like "FRIENDS_WITH" or "PURCHASED") are stored as <strong>Edges</strong>. By querying edges, you can traverse massive networks in milliseconds.
                </p>
                <CodeWindow 
                    title="Initialize SDK" 
                    language="javascript"
                    code={`const TilBase = require("tilbase-sdk");
const db = new TilBase();

await db.Auth(profileKey, projectKey, clusterKey, dbUser, dbPassword, serverName);

// Access the Graph Engine
const graphStore = db.graph();`} 
                />
            </section>

            <section id="nodes" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">trip_origin</span>
                    Managing Nodes
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    A node represents a single entity and contains an arbitrary JSON properties object.
                </p>
                <CodeWindow 
                    title="Node CRUD" 
                    language="javascript"
                    code={`// Create a new Node (Node Label, JSON Properties)
const userNode = await graphStore.addNode("User", {
    userId: "u123",
    name: "Alice",
    age: 28
});
console.log("Node ID:", userNode.id); // e.g., "node_999"

// Update an existing Node's properties
await graphStore.updateNode(userNode.id, {
    status: "Active"
});

// Delete a Node (This automatically deletes all connected Edges)
await graphStore.deleteNode(userNode.id);`} 
                />
            </section>

            <section id="edges" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">share</span>
                    Managing Edges
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Once you have nodes, connect them by creating an edge with a specific relationship type. Edges can also hold their own JSON properties (e.g., date established, weight, distance).
                </p>
                <CodeWindow 
                    title="Edge CRUD" 
                    language="javascript"
                    code={`// Connect Alice (u123) to Bob (u456)
await graphStore.addEdge(
    "u123",           // From Node ID
    "u456",           // To Node ID
    "FOLLOWS",        // Relationship Type / Label
    { since: 2024 }   // Optional Edge Properties
);

// Update an Edge's properties
await graphStore.updateEdge("u123", "u456", "FOLLOWS", {
    since: 2024,
    interaction_count: 5
});

// Delete a specific relationship
await graphStore.deleteEdge("u123", "u456", "FOLLOWS");`} 
                />
            </section>

            <section id="queries" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">search</span>
                    Graph Traversal & Queries
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Query the graph to find out how nodes are connected. You can fetch direct neighbors or use complex structural queries to match patterns.
                </p>
                <CodeWindow 
                    title="Traversals" 
                    language="javascript"
                    code={`// Find everyone Alice follows directly (1-hop)
const following = await graphStore.getNeighbors("u123", "FOLLOWS");
console.log("Alice follows:", following);

// Execute a complex structural pattern query
// E.g., Find nodes labelled 'User' that have an 'age' > 20
const queryData = await graphStore.queryGraph({
    label: "User",
    properties: {
        age: { operator: ">", value: 20 }
    }
});
console.log("Matching nodes:", queryData);`} 
                />
            </section>

            <section id="global" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">public</span>
                    Global Graph Operations
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Export the entire graph visualization data or perform full infrastructure resets.
                </p>
                <CodeWindow 
                    title="Global Control" 
                    language="javascript"
                    code={`// Get the complete graph structure (All Nodes and Edges)
// Useful for rendering visual diagrams (e.g., D3.js or Force Graphs)
const fullGraph = await graphStore.getGraph();
console.log(fullGraph.nodes, fullGraph.edges);

// CAUTION: Completely wipe all nodes and edges from the cluster
await graphStore.clearGraph();`} 
                />
            </section>

            <section id="realtime" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">bolt</span>
                    Real-time Listeners
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Graph clusters support real-time WebSocket events. The SDK emits events whenever any node or edge is created, updated, or deleted, allowing you to build live interactive visualizers.
                </p>
                <CodeWindow 
                    title="Live Socket Subscription" 
                    language="javascript"
                    code={`// Listen to any mutation across the entire graph
graphStore.onUpdate((event) => {
    console.log("Graph mutated! Action:", event.action); // e.g., 'ADD_NODE', 'DELETE_EDGE'
    console.log("Data:", event.data);
});

// To stop listening:
// graphStore.socket.off('graph_update');`} 
                />
            </section>
        </DocsLayout>
    );
};

export default DocsGraphDB;
