import React, { useState, useEffect } from 'react';
import DocsLayout from '../DocsLayout';
import CodeWindow from '../../../Components/CodeWindow';

const sections = [
    { id: 'concepts', title: 'Why Raw WebSockets?' },
    { id: 'connection', title: 'Establishing Connection' },
    { id: 'authentication', title: 'Authenticating the Socket' },
];

const DocsWebhooks = () => {
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
                    <span className="text-primary font-bold tracking-widest uppercase text-sm">Advanced</span>
                    <span className="material-symbols-outlined text-outline-variant/50 text-[16px]">chevron_right</span>
                    <span className="text-on-surface-variant font-medium text-sm">Raw WebSockets</span>
                </div>
                <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-4">
                    Raw WebSockets Connection
                </h1>
                <p className="text-on-surface-variant text-base max-w-3xl leading-relaxed">
                    Bypass the official Node.js SDK and connect directly to the TilBase engine using raw socket.io connections from any language or framework.
                </p>
            </div>

            <section id="concepts" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">webhook</span>
                    Why Raw WebSockets?
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    While our official Node.js SDK automatically handles WebSocket multiplexing and authentication, you might be building an application in a language where our SDK is not available (like Python, Go, or a raw browser frontend). You can connect to our live event system using standard <code>socket.io-client</code> libraries.
                </p>
            </section>

            <section id="connection" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">cast_connected</span>
                    Establishing Connection
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Connect to the primary TilBase WebSocket Gateway. You must pass your Cluster API Key during the initial handshake.
                </p>
                <CodeWindow 
                    title="Socket.io Connection" 
                    language="javascript"
                    code={`import { io } from "socket.io-client";

// Connect to the gateway
const socket = io("https://tilbase-sql-query-backend-server.onrender.com", {
    auth: {
        clusterKey: "YOUR_CLUSTER_KEY",
        dbUser: "YOUR_DB_USER",
        dbPassword: "YOUR_DB_PASSWORD"
    }
});

socket.on("connect", () => {
    console.log("Connected to TilBase WebSocket Gateway");
});`} 
                />
            </section>

            <section id="authentication" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">key</span>
                    Authenticating the Socket
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    If your credentials are invalid, or if your cluster is currently paused, the connection will be immediately dropped with a connection error.
                </p>
                <CodeWindow 
                    title="Handling Auth Errors" 
                    language="javascript"
                    code={`socket.on("connect_error", (err) => {
    console.error("Connection Failed:", err.message);
    // err.message will state "Unauthorized" or "Cluster Paused"
});`} 
                />
            </section>
        </DocsLayout>
    );
};

export default DocsWebhooks;
