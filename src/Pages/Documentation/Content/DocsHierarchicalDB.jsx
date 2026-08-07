import React, { useState, useEffect } from 'react';
import DocsLayout from '../DocsLayout';
import CodeWindow from '../../../Components/CodeWindow';

const sections = [
    { id: 'concepts', title: 'Core Concepts' },
    { id: 'create', title: 'Creating Hierarchies' },
    { id: 'query', title: 'Advanced Querying' },
    { id: 'update', title: 'Updating & Merging' },
    { id: 'realtime', title: 'Real-time Listeners' },
];

const DocsHierarchicalDB = () => {
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
                    <span className="text-on-surface-variant font-medium text-sm">Hierarchical DB</span>
                </div>
                <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-4">
                    Hierarchical DB SDK
                </h1>
                <p className="text-on-surface-variant text-base max-w-3xl leading-relaxed">
                    Designed for strict parent-child data structures. Perfect for representing corporate directories, folder systems, and deeply nested categories with enterprise-grade querying and live updates.
                </p>
            </div>

            <section id="concepts" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">account_tree</span>
                    Core Concepts
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Unlike relational databases, Hierarchical DB forces data into a strict tree structure. Every record (node) has exactly one parent, except for the root node. You navigate data by moving up and down the tree branches.
                </p>
            </section>

            <section id="create" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">library_add</span>
                    Creating Hierarchies
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Add new items by specifying their parent. If you don't specify a parent (or pass \`null\`), the item becomes a root node.
                </p>
                <CodeWindow 
                    title="Insert Nodes" 
                    language="javascript"
                    code={`const treeStore = db.hierarchical();

// Create the Root (e.g., Company CEO)
const ceo = await treeStore.addNode(null, {
    role: "CEO",
    name: "Alice"
});

// Create a Child (e.g., VP reporting to CEO)
const vp = await treeStore.addNode(ceo.id, {
    role: "VP of Engineering",
    name: "Bob"
});`} 
                />
            </section>

            <section id="query" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">lan</span>
                    Advanced Querying
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    You can instantly fetch a node's children, its ancestors, or search across branches. Pass an optional \`queryOptions\` object to \`getChildren\` to filter, sort, and limit your results on the server-side.
                </p>
                <CodeWindow 
                    title="Ordered Query" 
                    language="javascript"
                    code={`// Fetch the top 10 children, sorted by a specific JSON property
const topUsers = await treeStore.getChildren(ceo.id, {
    orderBy: 'performance_score',
    orderDirection: 'DESC',
    limit: 10
});

// Get the entire reporting chain up to the top (ancestors)
const chain = await treeStore.getAncestors(vp.id); // Returns [ceo]

// Free-text search across all nodes
const searchResults = await treeStore.searchNodes("Alice");`} 
                />
            </section>

            <section id="update" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">edit_document</span>
                    Updating & Merging
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    By default, \`updateNode\` will completely replace the target node's JSON payload. To update specific properties while retaining the rest, pass the \`merge: true\` option.
                </p>
                <CodeWindow 
                    title="Partial Node Updates" 
                    language="javascript"
                    code={`// Replaces the ENTIRE payload of the node
await treeStore.updateNode(vp.id, { new_status: "Active" }); 

// Safely merges these properties into the existing payload
await treeStore.updateNode(vp.id, { 
    new_status: "Active",
    last_login: "2026-08-05"
}, { merge: true });`} 
                />
            </section>

            <section id="realtime" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">bolt</span>
                    Real-time Listeners
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Tap directly into the exact lifecycle events you care about. The SDK exposes granular listeners that fire instantly across connected clients.
                </p>
                <CodeWindow 
                    title="Live Socket Subscriptions" 
                    language="javascript"
                    code={`// Fires instantly when a new child is appended to a node
const unsubAdd = treeStore.onChildAdded(vp.id, (event) => {
    console.log("New employee added under VP:", event);
});

// Fires when an existing child's payload is updated
treeStore.onChildChanged(vp.id, (event) => {
    console.log("Employee details changed:", event);
});

// Fires when a child is deleted
treeStore.onChildRemoved(vp.id, (event) => {
    console.log("Employee removed:", event);
});

// Fires when a child is re-parented to a new location
treeStore.onChildMoved(vp.id, (event) => {
    console.log("Employee transferred:", event);
});

// Watch a single node for any changes
treeStore.onValue(ceo.id, (event) => {
    console.log("CEO node updated:", event);
});

// Always unsubscribe when the component unmounts!
unsubAdd();`} 
                />
            </section>
        </DocsLayout>
    );
};

export default DocsHierarchicalDB;
