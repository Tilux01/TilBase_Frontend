import React, { useState, useEffect } from 'react';
import DocsLayout from '../DocsLayout';
import CodeWindow from '../../../Components/CodeWindow';

const sections = [
    { id: 'concepts', title: 'Core Concepts' },
    { id: 'save', title: 'Write Data' },
    { id: 'get', title: 'Read Data' },
    { id: 'update', title: 'Update Data' },
    { id: 'drill', title: 'Nested Objects' },
    { id: 'fieldvalues', title: 'Field Values' },
    { id: 'query', title: 'Queries & Sorting' },
    { id: 'batch', title: 'Batches & Transactions' },
    { id: 'watch', title: 'Real-Time Listeners' },
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
                    The TilBase Document SDK is designed with <b>100% mathematical parity to the standard Firestore SDK</b>. This means you can use exactly the same syntax you are used to with Firebase, making migration seamless. Data is structured in <b>Collections</b> containing <b>Documents</b>.
                </p>
                <div className="bg-surface-container rounded-xl p-4 border border-black/5 dark:border-black/5 dark:border-white/5 font-mono text-primary text-base">
                    <code>import &#123; collection, doc &#125; from 'tilbase-node-module';</code><br/><br/>
                    <code>const usersCol = collection(db, "users");</code><br/>
                    <code>const userDoc = doc(db, "users/user_1");</code>
                </div>
            </section>

            {/* Write Data */}
            <section id="save" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">save</span>
                    Write Data
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Write data directly into a specified document path using the <code>setDoc</code> method. Use <code>addDoc</code> to auto-generate a document ID. If the cluster has exceeded its global Storage Limit, this method will throw a <b>403 Forbidden</b> error.
                </p>
                <CodeWindow 
                    title="Write Data" 
                    language="javascript"
                    code={`import { doc, setDoc, collection, addDoc } from 'tilbase-node-module';

// Overwrites or creates 'user_1' in 'users' collection
await setDoc(doc(db, "users", "user_1"), {
    name: "John Doe",
    email: "john@example.com",
    role: "Admin"
});

// Auto-generate an ID
const docRef = await addDoc(collection(db, "users"), {
    name: "Jane Doe"
});`} 
                />
            </section>

            {/* Read Data */}
            <section id="get" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">find_in_page</span>
                    Read Data
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Fetch a single document by its exact path using <code>getDoc</code>. It safely returns a <code>DocumentSnapshot</code> containing <code>exists()</code>, <code>id</code>, and <code>data()</code>.
                </p>
                <CodeWindow 
                    title="Read Data" 
                    language="javascript"
                    code={`import { doc, getDoc } from 'tilbase-node-module';

const docRef = doc(db, "users", "user_1");
const snap = await getDoc(docRef);

if (snap.exists()) {
    console.log(snap.id);          // Outputs: "user_1"
    console.log(snap.data().name);    // Outputs: "John Doe"
} else {
    console.log("Document not found!");
}`} 
                />
            </section>

            {/* Update Data */}
            <section id="update" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">edit_document</span>
                    Update Document
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Use <code>updateDoc</code> to merge new data into an existing document without overwriting other fields. Alternatively, use <code>setDoc(..., &#123; merge: true &#125;)</code>.
                </p>
                <CodeWindow 
                    title="Update Data" 
                    language="javascript"
                    code={`import { doc, updateDoc, setDoc } from 'tilbase-node-module';

// Only updates the email, leaves 'name' and 'role' intact
await updateDoc(doc(db, "users/user_1"), {
    email: "new.john@example.com"
});

// Create or update with merge
await setDoc(doc(db, "users/user_1"), { role: "SuperAdmin" }, { merge: true });`} 
                />
            </section>

            {/* Drilling */}
            <section id="drill" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">account_tree</span>
                    Nested Objects
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    You can seamlessly update deeply nested JSON objects without overwriting their sibling properties by using <b>Dot-Notation Drilling</b>.
                </p>
                <CodeWindow 
                    title="Nested Field Updates" 
                    language="javascript"
                    code={`// Safely update nested JSON objects natively
await updateDoc(doc(db, "users/user_1"), {
    "settings.theme": "dark",
    "settings.notifications.email": true
});`} 
                />
            </section>

            {/* Field Values */}
            <section id="fieldvalues" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">magic_button</span>
                    Field Values
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Use <code>FieldValue</code> functions when updating documents to perform server-side atomic operations on fields without relying on the client's current state.
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
                    code={`import { doc, updateDoc, FieldValue } from 'tilbase-node-module';

await updateDoc(doc(db, "posts/123"), {
    views: FieldValue.increment(1),
    tags: FieldValue.arrayUnion("featured"),
    lastUpdated: FieldValue.serverTimestamp(),
    draftStatus: FieldValue.deleteField()
});`} 
                />
            </section>

            {/* Queries & Sorting */}
            <section id="query" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">search</span>
                    Queries & Sorting
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Query an entire collection for documents matching specific criteria using the <code>docQuery</code>, <code>docWhere</code>, <code>docOrderBy</code>, and <code>docLimit</code> builder methods.
                </p>
                <CodeWindow 
                    title="Advanced Query" 
                    language="javascript"
                    code={`import { collection, docQuery, docWhere, docOrderBy, docLimit, getDocs } from 'tilbase-node-module';

// Find up to 20 users age 18 and older, sorted by newest
const q = docQuery(collection(db, "users"),
    docWhere("age", ">=", 18),
    docOrderBy("createdAt", "desc"),
    docLimit(20)
);

const qSnap = await getDocs(q);

console.log(\`Found \${qSnap.size} users:\`);
qSnap.forEach(docSnap => {
    console.log(docSnap.id, docSnap.data());
});`} 
                />
            </section>

            {/* Batches and Transactions */}
            <section id="batch" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">layers</span>
                    Batches & Transactions
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Perform atomic operations across multiple documents utilizing <code>writeBatch()</code>, or execute robust read-write logic using optimistic concurrency with <code>runDocTransaction()</code>.
                </p>
                <CodeWindow 
                    title="Batches and Transactions" 
                    language="javascript"
                    code={`import { writeBatch, runDocTransaction, doc } from 'tilbase-node-module';

// Example 1: Atomic Batch Writes
const b = writeBatch(db);
b.set(doc(db, "users/1"), { name: "Alice" });
b.update(doc(db, "users/2"), { status: "Active" });
b.delete(doc(db, "users/3"));
await b.commit();

// Example 2: Optimistic Transaction Loop
const cityRef = doc(db, "cities/LA");
await runDocTransaction(db, async (transaction) => {
    const snap = await transaction.get(cityRef);
    if (!snap.exists()) throw "Document does not exist!";
    const newPop = snap.data().population + 1;
    transaction.update(cityRef, { population: newPop });
});`} 
                />
            </section>

            {/* Real-Time Watchers */}
            <section id="watch" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">sensors</span>
                    Real-Time Listeners
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    The TilBase Document engine is inherently real-time. Listen for live changes to any document using <code>onSnapshot</code>. Under the hood, this uses WebSockets, meaning your UI can instantly react to data updates without page refreshes.
                </p>
                <CodeWindow 
                    title="Real-Time Listener" 
                    language="javascript"
                    code={`import { doc, onSnapshot } from 'tilbase-node-module';

// The callback fires immediately, and again whenever the document changes
const unsubscribe = onSnapshot(doc(db, "users/user_1"), (docSnap) => {
    if (docSnap.exists()) {
        console.log("Current data:", docSnap.data());
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
