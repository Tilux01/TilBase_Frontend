import React, { useState, useEffect } from 'react';
import DocsLayout from '../DocsLayout';
import CodeWindow from '../../../Components/CodeWindow';

const sections = [
    { id: 'concepts', title: 'Core Concepts' },
    { id: 'save', title: 'Save Document' },
    { id: 'get', title: 'Get Document' },
    { id: 'update', title: 'Update Document' },
    { id: 'drill', title: 'Drilling (Dot-Notation)' },
    { id: 'fieldvalues', title: 'Field Values' },
    { id: 'query', title: 'Query Builders' },
    { id: 'batch', title: 'Batch & Bulk Operations' },
    { id: 'watch', title: 'Real-Time Watchers' },
];

const DocsDocumentDB = () => {
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
                    <span className="text-on-surface-variant font-medium text-sm">Document DB</span>
                </div>
                <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-4">
                    Document DB
                </h1>
                <p className="text-on-surface-variant text-base max-w-3xl leading-relaxed">
                    A flexible, NoSQL, JSON-like database system. Learn how to write, read, and listen to real-time data using the Document DB SDK methods.
                </p>
            </div>

            {}
            <section id="concepts" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">data_object</span>
                    Core Concepts
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Data in TilBase Document DB is stored inside <b>Collections</b>, which act as containers for <b>Documents</b>. We use a standard forward-slash notation to represent the path to a document:
                </p>
                <div className="bg-surface-container rounded-xl p-4 border border-black/5 dark:border-black/5 dark:border-white/5 text-center font-mono text-primary text-base">
                    <code>"collection_name/document_id"</code>
                </div>
            </section>

            {}
            <section id="save" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">save</span>
                    Save Document
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Write data directly into a specified document path using the <code>setDoc</code> method. If the document doesn't exist, it will be created. If the cluster has exceeded its global Storage Limit, this method will throw a <b>403 Forbidden</b> error.
                </p>
                <CodeWindow 
                    title="Write Data" 
                    language="javascript"
                    code={`// Overwrites or creates 'user_1' in 'users' collection
const response = await db.save("users/user_1", {
    name: "John Doe",
    email: "john@example.com",
    role: "Admin"
});

console.log(response.message); // "Document saved successfully"`} 
                />
            </section>

            {}
            <section id="get" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">find_in_page</span>
                    Get Document
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Fetch a single document by its exact path using <code>getDoc(path)</code>. It safely returns an object containing <code>exists</code>, <code>id</code>, and <code>data</code>.
                </p>
                <CodeWindow 
                    title="Read Data" 
                    language="javascript"
                    code={`const user = await db.getDoc("users/user_1");

if (user.exists) {
    console.log(user.id);          // Outputs: "user_1"
    console.log(user.data.name);    // Outputs: "John Doe"
} else {
    console.log("Document not found!");
}`} 
                />
            </section>

            {}
            <section id="update" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">edit_document</span>
                    Update Document
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Use <code>updateDoc(path, data)</code> to merge new data into an existing document without overwriting other fields. Only the provided keys are updated.
                </p>
            </section>

            {}
            <section id="drill" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">account_tree</span>
                    Drilling (Dot-Notation)
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    You can seamlessly update deeply nested JSON objects without overwriting their sibling properties by using <b>Dot-Notation Drilling</b>. You can also query nested properties natively.
                </p>
                <CodeWindow 
                    title="Nested Field Updates" 
                    language="javascript"
                    code={`// Safely update nested JSON objects natively
await db.updateDoc("users/user_1", {
    "settings.theme": "dark",
    "settings.notifications.email": true
});

// Query by nested fields
const results = await db.find('users', [
    { field: "settings.theme", operator: "==", value: "dark" }
]);`} 
                />
                <CodeWindow 
                    title="Update Data" 
                    language="javascript"
                    code={`// Only updates the email, leaves 'name' and 'role' intact
await db.updateDoc("users/user_1", {
    email: "new.john@example.com"
});`} 
                />
            </section>

            {}
            <section id="fieldvalues" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">magic_button</span>
                    Field Values
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Use <code>TilBase.FieldValue</code> properties when updating documents to perform server-side atomic operations on fields.
                </p>
                <ul className="list-disc pl-6 text-on-surface-variant space-y-2">
                    <li><code>increment(n)</code>: Increments a numeric field by n.</li>
                    <li><code>serverTimestamp()</code>: Injects the precise server time.</li>
                    <li><code>arrayUnion(val)</code>: Adds a unique value to an array.</li>
                    <li><code>arrayRemove(val)</code>: Removes a value from an array.</li>
                    <li><code>deleteField()</code>: Removes a field completely from the document.</li>
                </ul>
                <CodeWindow 
                    title="Field Value Update" 
                    language="javascript"
                    code={`await db.updateDoc("posts/123", {
    views: TilBase.FieldValue.increment(1),
    tags: TilBase.FieldValue.arrayUnion("featured"),
    lastUpdated: TilBase.FieldValue.serverTimestamp(),
    draftStatus: TilBase.FieldValue.deleteField()
});`} 
                />
            </section>

            {}
            <section id="query" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">search</span>
                    Query Builders
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Query an entire collection for documents matching specific criteria using the <code>query()</code> builder method coupled with <code>find()</code> or <code>count()</code>.
                </p>
                <ul className="list-disc pl-6 text-on-surface-variant space-y-2">
                    <li><code>where(field, operator, value)</code>: Valid operators are <code>==</code>, <code>!=</code>, <code>&gt;</code>, <code>&gt;=</code>, <code>&lt;</code>, <code>&lt;=</code>, <code>in</code>.</li>
                    <li><code>orderBy(field, direction)</code>: Direction is <code>'asc'</code> or <code>'desc'</code>.</li>
                    <li><code>limit(n)</code>: Limits the results count.</li>
                </ul>
                <CodeWindow 
                    title="Advanced Query" 
                    language="javascript"
                    code={`// Find up to 20 users age 18 and older, sorted by newest
const q = db.query("users",
    db.where("age", ">=", 18),
    db.orderBy("createdAt", "desc"),
    db.limit(20)
);

const results = await db.find(q);

console.log(\`Found \${results.documents.length} users:\`);
results.documents.forEach(doc => {
    console.log(doc.id, doc.data);
});`} 
                />
            </section>

            {}
            <section id="batch" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">layers</span>
                    Batch & Bulk Operations
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Perform atomic operations across multiple documents utilizing <code>batch()</code>, or quickly update/delete matched queries using <code>bulkUpdate</code> and <code>bulkDelete</code>. Batch queries run in a single SQL transaction ensuring data integrity!
                </p>
                <CodeWindow 
                    title="Batching & Bulk Functions" 
                    language="javascript"
                    code={`// Example 1: Atomic Batch Writes
const b = db.batch();
b.save("users/1", { name: "Alice" });
b.update("users/2", { status: "Active" });
b.delete("users/3");
await b.commit();

// Example 2: Bulk Delete matches query
const deleteQuery = db.query("users", db.where("status", "==", "Inactive"));
await db.bulkDelete(deleteQuery);

// Example 3: Bulk Update matches query
const updateQuery = db.query("users", db.where("role", "==", "Moderator"));
await db.bulkUpdate(updateQuery, { verified: true });`} 
                />
            </section>

            {}
            <section id="watch" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">sensors</span>
                    Real-Time Watchers
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    The TilBase Document engine is inherently real-time. You can listen for live changes to any document using <code>watchDoc</code>. Under the hood, this uses WebSockets, meaning your UI can instantly react to data updates without page refreshes.
                </p>
                <div className="bg-surface-container border border-black/5 dark:border-black/5 dark:border-white/5 rounded-xl p-4 mb-4">
                    <p className="text-sm text-on-surface-variant"><b>Note:</b> WebSockets are automatically established under the hood when you call <code>Auth()</code>. No extra setup required!</p>
                </div>
                <CodeWindow 
                    title="Real-Time Listener" 
                    language="javascript"
                    code={`// The callback fires immediately when the document is updated remotely
const unsubscribe = db.watchDoc("users/user_1", (event) => {
    if (event.eventType === "update") {
        console.log("Document updated! New data:", event.data);
    } else if (event.eventType === "delete") {
        console.log("Document was deleted!");
    }
});

// Later in your code when you no longer need updates:
unsubscribe();`} 
                />
            </section>

        </DocsLayout>
    );
};

export default DocsDocumentDB;
