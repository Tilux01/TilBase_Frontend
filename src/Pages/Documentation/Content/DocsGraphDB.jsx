import React, { useState, useEffect } from 'react';
import DocsLayout from '../DocsLayout';
import CodeWindow from '../../../Components/CodeWindow';

const sections = [
    { id: 'concepts', title: 'Core Concepts' },
    { id: 'nodes', title: 'Managing Nodes' },
    { id: 'edges', title: 'Creating Edges' },
    { id: 'queries', title: 'Graph Traversal' },
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
                            ? 'bg-primary/10 text-primary font-bold' 
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
            <div className="mb-12 border-b border-outline-variant/20 pb-8">
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
            </section>

            <section id="nodes" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">trip_origin</span>
                    Managing Nodes
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    A node represents a single entity and contains arbitrary JSON properties.
                </p>
                <CodeWindow 
                    title="Create a Node" 
                    language="javascript"
                    code={`const graphStore = db.graph();

// Create a User node
const userNode = await graphStore.addNode("User", {
    userId: "u123",
    name: "Alice",
    age: 28
});

console.log("Node created with ID:", userNode.id);`} 
                />
            </section>

            <section id="edges" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">share</span>
                    Creating Edges
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Once you have nodes, you connect them by creating an edge with a specific relationship type.
                </p>
                <CodeWindow 
                    title="Create an Edge" 
                    language="javascript"
                    code={`// Connect Alice (u123) and Bob (u456)
await graphStore.addEdge(
    "u123",           // From Node ID
    "u456",           // To Node ID
    "FOLLOWS",        // Relationship Type
    { since: 2024 }   // Optional Edge Properties
);`} 
                />
            </section>

            <section id="queries" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">search</span>
                    Graph Traversal
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Query the graph to find out how nodes are connected. You can find all followers of a user instantly.
                </p>
                <CodeWindow 
                    title="Query Relationships" 
                    language="javascript"
                    code={`// Find everyone Alice follows
const following = await graphStore.getNeighbors("u123", "FOLLOWS");
console.log("Alice follows:", following);

// Find nodes connected by multiple hops (e.g., friends of friends)
const connections = await graphStore.traverse("u123", {
    relationship: "FOLLOWS",
    depth: 2
});`} 
                />
            </section>
        </DocsLayout>
    );
};

export default DocsGraphDB;
