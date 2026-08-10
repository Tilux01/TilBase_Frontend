import React, { useState, useEffect } from 'react';
import DocsLayout from '../DocsLayout';
import CodeWindow from '../../../Components/CodeWindow';

const sections = [
    { id: 'concepts', title: 'Core Concepts' },
    { id: 'upsert', title: 'Insert & Upsert' },
    { id: 'semantic', title: 'Semantic Query' },
    { id: 'hybrid', title: 'Hybrid Search' },
    { id: 'filters', title: 'Metadata Filtering' },
    { id: 'realtime', title: 'Realtime & Management' },
];

const DocsVectorDB = () => {
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
                    <span className="text-on-surface-variant font-medium text-sm">Vector DB</span>
                </div>
                <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-4">
                    Vector DB SDK
                </h1>
                <p className="text-on-surface-variant text-base max-w-3xl leading-relaxed">
                    A high-performance, enterprise-grade vector engine built natively into the TilBase Node Module. 
                    Utilize the elegant Builder Pattern to execute complex Hybrid Semantic Searches securely and efficiently.
                </p>
            </div>

            {}
            <section id="concepts" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">data_array</span>
                    Core Concepts
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Access the Vector Engine using <code>db.vector()</code>, and organize your embeddings into <b>Namespaces</b> (collections of vectors). Each vector object requires an <code>id</code> and a dense <code>vector</code> array, with optional <code>sparse</code> text and <code>metadata</code> object payloads.
                </p>
                <CodeWindow 
                    title="Initialize Namespace" 
                    language="javascript"
                    code={`const TilBase = require("tilbase-server");
const db = new TilBase();

await db.Auth(profileKey, projectKey, clusterKey, dbUser, dbPassword, serverName);

// Access a Vector Namespace
const products = db.vector().namespace("products_catalog");`} 
                />
            </section>

            {}
            <section id="upsert" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">upload</span>
                    Insert & Upsert
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Use <code>upsert()</code> to insert or overwrite a single vector. Use <code>bulkUpsert()</code> to ingest massive arrays of embeddings in a single high-performance network request. Note: If you exceed your global Storage Limit, these operations will be blocked and throw a <b>403 Forbidden</b> error.
                </p>
                <CodeWindow 
                    title="Upsert and Bulk Injection" 
                    language="javascript"
                    code={`// Single Upsert
await products.upsert({
    id: "prod_1",
    vector: [0.12, -0.45, 0.88, ...],
    sparse: "Wireless Bluetooth Headphones",
    metadata: { category: "electronics", price: 150 }
});

// Bulk Ingestion
await products.bulkUpsert([
    {
        id: "prod_2",
        vector: [0.11, -0.55, 0.91, ...],
        sparse: "Mechanical Gaming Keyboard",
        metadata: { category: "electronics", price: 90 }
    },
    // ... thousands more
]);`} 
                />
            </section>

            {}
            <section id="semantic" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">scatter_plot</span>
                    Semantic Query (Dense Search)
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Perform blazing-fast Nearest Neighbor search using the chainable <b>Query Builder</b>. Select your <code>metric()</code> (cosine, euclidean, or dotProduct) to match your AI embedding model.
                </p>
                <CodeWindow 
                    title="Dense Vector Query" 
                    language="javascript"
                    code={`const results = await products.query()
    .dense([0.12, -0.45, 0.81, ...]) // Array from your AI Model
    .metric("cosine") // 'cosine' | 'euclidean' | 'dotProduct'
    .limit(5)
    .execute();

console.log("Top Score:", results[0].score);
console.log("Metadata:", results[0].metadata);`} 
                />
            </section>

            {}
            <section id="hybrid" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">join_inner</span>
                    Hybrid Search (Dense + Sparse)
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Pure semantic searches can miss exact keywords (e.g. searching for a specific product ID). Chain the <code>sparse()</code> method to natively fuse full-text SQL matching with Semantic Similarity!
                </p>
                <CodeWindow 
                    title="Advanced Hybrid Search" 
                    language="javascript"
                    code={`const results = await products.query()
    .dense([0.15, 0.42, -0.91, ...]) // Semantic match
    .sparse("Bluetooth")             // Exact Keyword match
    .metric("cosine")
    .limit(10)
    .execute();`} 
                />
            </section>

            {}
            <section id="filters" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">filter_alt</span>
                    Metadata Pre-Filtering
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Pre-filter your data using raw JSON schemas before performing heavy vector math. TilBase translates this to native SQL JSON parsing on the backend for zero latency overhead.
                </p>
                <CodeWindow 
                    title="Filtered Query" 
                    language="javascript"
                    code={`const results = await products.query()
    .dense([0.12, -0.45, 0.81, ...])
    .filter({ "category": "electronics", "price": { "$lt": 200 } })
    .limit(10)
    .execute();`} 
                />
            </section>

            {}
            <section id="realtime" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">bolt</span>
                    Realtime WebSockets & Management
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    TilBase natively supports Realtime WebSockets for Vector clusters. Use <code>onSnapshot()</code> to instantly detect changes across your microservices. You can also surgically <code>delete()</code> individual vectors.
                </p>
                <CodeWindow 
                    title="Realtime Sync and Deletion" 
                    language="javascript"
                    code={`// Subscribe to realtime changes on the namespace
const unsubscribe = products.onSnapshot((event) => {
    console.log("Vector Namespace Updated:", event);
});

// Delete a specific vector
await products.delete("prod_1");`} 
                />
            </section>

        </DocsLayout>
    );
};

export default DocsVectorDB;
