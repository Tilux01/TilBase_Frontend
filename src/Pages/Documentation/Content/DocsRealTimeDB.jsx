import React, { useState, useEffect } from 'react';
import DocsLayout from '../DocsLayout';
import CodeWindow from '../../../Components/CodeWindow';

const sections = [
    { id: 'init', title: 'Initialization' },
    { id: 'crud', title: 'Reading & Writing' },
    { id: 'listen', title: 'Real-Time Listeners' },
    { id: 'query', title: 'Queries & Sorting' },
    { id: 'presence', title: 'Offline & Presence' },
];

const DocsRealTimeDB = () => {
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
                    <span className="text-on-surface-variant font-medium text-sm">Realtime DB</span>
                </div>
                <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-4">
                    Realtime Database SDK
                </h1>
                <p className="text-on-surface-variant text-base max-w-3xl leading-relaxed">
                    A highly optimized, low-latency database that stores data as one large JSON tree. The TilBase Realtime SDK is built for strict 1:1 parity with Firebase Realtime Database.
                </p>
            </div>

            <section id="init" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">bolt</span>
                    Initialization
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    To interact with the Realtime Database, import the necessary modular functions from the SDK and initialize your connection.
                </p>
                <CodeWindow 
                    title="Setup SDK" 
                    language="javascript"
                    code={`const { ref, set, get, onValue } = require("tilbase-sdk");

// Initialize TilBase
const db = new TilBase();
await db.Auth(PROFILE_KEY, PROJECT_KEY, CLUSTER_KEY, DB_USER, DB_PASS, SERVER_NAME);`} 
                />
            </section>

            <section id="crud" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">edit_document</span>
                    Reading & Writing Data
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Data is written to a specific <code>ref()</code> path. You can overwrite entirely with <code>set()</code>, merge data with <code>update()</code>, or delete with <code>remove()</code>. You can fetch data once using <code>get()</code>. All write operations support an optional <code>onComplete</code> callback.
                </p>
                <CodeWindow 
                    title="Write & Read Data" 
                    language="javascript"
                    code={`const userRef = ref(db, 'users/user_123');

// Write data with an onComplete callback
await set(userRef, {
    name: "Alice",
    score: 100
}, (error) => {
    if (error) console.error("Write failed:", error);
    else console.log("Write successful!");
});

// Update specific fields without overwriting
await update(userRef, {
    score: 200
});

// Read data once
const snapshot = await get(userRef);
if (snapshot.exists()) {
    console.log(snapshot.val()); // { name: "Alice", score: 200 }
}`} 
                />
            </section>

            <section id="listen" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">sensors</span>
                    Real-Time Listeners & Context Binding
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Attach an event listener to sync data locally over WebSockets. The SDK features smart delta-detection and triggers callbacks precisely when data changes. You can also explicitly bind the callback context via the <code>context</code> argument, or read data exactly once using <code>once()</code>.
                </p>
                <CodeWindow 
                    title="Live Updates & Index Shifts" 
                    language="javascript"
                    code={`const { onValue, onChildAdded, onChildRemoved, onChildMoved } = require("tilbase-sdk");

const chatRef = ref(db, 'chats/room_1');

// Listen to entire object changes
onValue(chatRef, function(snapshot) {
    console.log("Room data changed:", snapshot.val());
    console.log("Bound context:", this.name); // Using context binding
}, { name: 'ContextObject' });

// Listen to list events (highly optimized for long lists)
onChildAdded(chatRef, (snapshot) => {
    console.log("New message added:", snapshot.val());
});

onChildRemoved(chatRef, (snapshot) => {
    console.log("Message deleted:", snapshot.key);
});

// Reacts strictly when a child's relative index changes
onChildMoved(chatRef, (snapshot) => {
    console.log("Message moved order:", snapshot.key);
});

// Fetch data once without maintaining a WebSocket listener
const snap = await chatRef.once('value');`} 
                />
            </section>

            <section id="query" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">filter_list</span>
                    Queries & Sorting
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Filter and limit results directly on the backend using the <code>query()</code> function alongside modifier constraints like <code>startAfter()</code>, <code>endBefore()</code>, or <code>orderByPriority()</code>. Socket listeners gracefully respect queries.
                </p>
                <CodeWindow 
                    title="Querying Data" 
                    language="javascript"
                    code={`const { query, orderByChild, equalTo, limitToFirst, startAfter, endBefore } = require("tilbase-sdk");

const usersRef = ref(db, 'users');

// Build a query: Get up to 10 users older than 25 but under 50
const topUsersQuery = query(
    usersRef, 
    orderByChild('age'), 
    startAfter(25, 'age'),
    endBefore(50, 'age'),
    limitToFirst(10)
);

// Fetch the query results
const snapshot = await get(topUsersQuery);
console.log(snapshot.val());`} 
                />
            </section>

            <section id="presence" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">public</span>
                    Offline & Presence Engine
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    The <code>onDisconnect</code> class lets you write or clear data when your client disconnects from the database server. These updates occur whether the client disconnects cleanly or unexpectedly (e.g., loss of power).
                </p>
                <CodeWindow 
                    title="Building a Presence System" 
                    language="javascript"
                    code={`const { onDisconnect, serverTimestamp } = require("tilbase-sdk");

const presenceRef = ref(db, 'status/user_123');

// 1. Tell the SQL WebSocket Daemon what to do if we drop connection
onDisconnect(presenceRef).update({
    state: 'offline',
    lastSeen: serverTimestamp()
});

// 2. Safely mark ourselves as online
await set(presenceRef, {
    state: 'online',
    lastSeen: serverTimestamp()
});`} 
                />
            </section>

        </DocsLayout>
    );
};

export default DocsRealTimeDB;
