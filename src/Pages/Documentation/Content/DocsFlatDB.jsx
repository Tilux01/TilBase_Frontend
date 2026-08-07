import React, { useState, useEffect } from 'react';
import DocsLayout from '../DocsLayout';
import CodeWindow from '../../../Components/CodeWindow';

const sections = [
    { id: 'concepts', title: 'Core Concepts' },
    { id: 'set', title: 'Set Value' },
    { id: 'get', title: 'Get Value' },
    { id: 'increment', title: 'Atomic Increment' },
    { id: 'subscribe', title: 'Real-time Subscribe' },
    { id: 'buckets', title: 'Buckets & Keys' },
    { id: 'delete', title: 'Delete Key' },
    { id: 'delete_bucket', title: 'Delete Bucket' },
];

const DocsFlatDB = () => {
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
                    <span className="text-on-surface-variant font-medium text-sm">Flat DB</span>
                </div>
                <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-4">
                    Flat DB SDK
                </h1>
                <p className="text-on-surface-variant text-base max-w-3xl leading-relaxed">
                    An ultra-fast, minimalist Key-Value store engine built into TilBase. Ideal for caching, session storage, and rapid data retrieval utilizing Buckets.
                </p>
            </div>

            {}
            <section id="concepts" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">description</span>
                    Core Concepts
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Data in Flat DB is stored via a simple <code>Bucket</code> and <code>Key</code> architecture. A Bucket is analogous to a folder, and Keys are the unique identifiers for your string or JSON payloads.
                </p>
                <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/20 text-center font-mono text-primary text-base">
                    <code>bucketName / keyName = Value Payload</code>
                </div>
                <CodeWindow 
                    title="Initialize SDK" 
                    language="javascript"
                    code={`const TilBase = require("tilbase-server");
const db = new TilBase();

await db.Auth(profileKey, projectKey, clusterKey, dbUser, dbPassword, serverName);

// Access the Flat Engine
const flatStore = db.flat();`} 
                />
            </section>

            {}
            <section id="set" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">add_box</span>
                    Set Value
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Write data directly to a Key inside a Bucket. The engine supports raw Strings and nested JSON payloads out of the box. Storage limits apply instantly during the write process.
                </p>
                <CodeWindow 
                    title="Set Data" 
                    language="javascript"
                    code={`// Saves a JSON payload into the 'sessions' bucket under key 'user_123'
const response = await flatStore.setValue("sessions", "user_123", {
    active: true,
    token: "abc-123",
    timestamp: Date.now()
});

console.log(response.success); // true`} 
                />
            </section>

            {}
            <section id="get" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">download</span>
                    Get Value
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Retrieve a value instantly using its Bucket and Key. The Flat SDK handles parsing automatically if the payload was stored as JSON.
                </p>
                <CodeWindow 
                    title="Read Data" 
                    language="javascript"
                    code={`const data = await flatStore.getValue("sessions", "user_123");

if (data.exists) {
    console.log(data.value.token); // "abc-123"
} else {
    console.log("Key not found or expired.");
}`} 
                />
            </section>

            {}
            <section id="increment" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">exposure_plus_1</span>
                    Atomic Increment
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Atomically increment or decrement numerical values stored in a key without risking race conditions or performing expensive read-write cycles.
                </p>
                <CodeWindow 
                    title="Increment Value" 
                    language="javascript"
                    code={`// Increment page views by 1
const viewCount = await flatStore.increment("metrics", "page_views", 1);
console.log(viewCount.value); // returns the new incremented value

// Decrement by 5
const tokenCount = await flatStore.increment("credits", "user_123", -5);`} 
                />
            </section>

            {}
            <section id="subscribe" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">sensors</span>
                    Real-time Subscribe
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Listen to live changes on a specific key using WebSockets. Whenever another client updates the value, the new data is instantly pushed to your callback function.
                </p>
                <CodeWindow 
                    title="Listen for Changes" 
                    language="javascript"
                    code={`// Subscribe to a configuration key
flatStore.subscribe("config", "theme", (newData) => {
    console.log("Theme just changed in real-time to:", newData);
});

// To stop listening later (if necessary)
// flatStore.unsubscribe("config", "theme");`} 
                />
            </section>

            {}
            <section id="buckets" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">folder_open</span>
                    Buckets & Keys
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    You can retrieve a list of all active Buckets in your cluster, or list all Keys inside a specific Bucket.
                </p>
                <CodeWindow 
                    title="List Operations" 
                    language="javascript"
                    code={`// Get all Buckets
const buckets = await flatStore.getBuckets();
console.log(buckets); // ['sessions', 'cache', 'logs']

// Get all Keys in a Bucket
const keys = await flatStore.getKeys("sessions");
console.log(keys); // ['user_123', 'user_456']`} 
                />
            </section>

            {}
            <section id="delete" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">delete</span>
                    Delete Key
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Remove a key-value pair from a Bucket permanently to free up global storage space.
                </p>
                <CodeWindow 
                    title="Delete Data" 
                    language="javascript"
                    code={`const response = await flatStore.deleteKey("sessions", "user_123");
console.log(response.message); // "Key deleted successfully"`} 
                />
            </section>

            {}
            <section id="delete_bucket" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">delete_sweep</span>
                    Delete Bucket
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Instantly wipe an entire Bucket and all of its associated Keys in a single command. The storage footprint will be completely refunded to your cluster.
                </p>
                <CodeWindow 
                    title="Wipe Bucket" 
                    language="javascript"
                    code={`const response = await flatStore.deleteBucket("sessions");
console.log(response.message); // "Bucket deleted successfully"`} 
                />
            </section>
        </DocsLayout>
    );
};

export default DocsFlatDB;
