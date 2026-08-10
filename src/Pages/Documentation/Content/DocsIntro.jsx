import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeWindow from '../../../Components/CodeWindow';

const DocsIntro = () => {
    return (
        <DocsLayout>
            <div className="mb-12 border-b border-black/5 dark:border-black/5 dark:border-white/5 pb-8">
                <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Introduction to TilBase
                </h1>
                <p className="text-on-surface-variant text-lg max-w-3xl leading-relaxed">
                    Welcome to the official TilBase SDK documentation. TilBase is a multi-model database platform combining Document, Real-Time, Vector DB, Graph, and Flat databases into one unified API.
                </p>
            </div>

            <section className="mb-16 space-y-6">
                <h2 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">download</span>
                    Installation
                </h2>
                <p className="text-on-surface-variant leading-relaxed text-base">
                    The TilBase Node SDK is the easiest way to connect your backend applications directly to your real-time Database Clusters.
                </p>
                <CodeWindow 
                    title="Terminal" 
                    language="bash"
                    code={`npm install tilbase-sdk`} 
                />
            </section>

            <section className="mb-16 space-y-6">
                <h2 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">lan</span>
                    Network Setup
                </h2>
                <div className="bg-surface-container p-6 rounded-xl border border-black/5 dark:border-black/5 dark:border-white/5 shadow-sm">
                    <p className="text-on-surface-variant leading-relaxed mb-4">
                        Before you can authenticate and read data from your application, you <b>must</b> whitelist your server's IP address.
                    </p>
                    <ol className="list-decimal pl-5 space-y-3 text-on-surface font-medium">
                        <li>Log in to your TilBase Dashboard.</li>
                        <li>Select your Project.</li>
                        <li>Navigate to the <b>Network Access</b> tab in the sidebar.</li>
                        <li>Click <b>Add IP Address</b> and input your server's IP, or <code>0.0.0.0/0</code> to allow access from anywhere.</li>
                    </ol>
                </div>
            </section>

            <section className="mb-16 space-y-6">
                <h2 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">security</span>
                    Global Storage Limits & Telemetry
                </h2>
                <p className="text-on-surface-variant leading-relaxed text-base">
                    TilBase strictly tracks all your database operations (Document, Vector, and future engines) in real-time. Every byte inserted or deleted mathematically updates your global cluster <code className="text-primary">space_used</code>. If you exceed your Subscription Plan's <b>Cloud Storage Limit</b>, the global API middleware will automatically block any further write requests and throw a <code>403 Forbidden: Storage limit exceeded</code> error before the data is written.
                </p>
            </section>

            <section className="mb-16 space-y-6">
                <h2 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">lightbulb</span>
                    Next Steps
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Now that you have installed the SDK and whitelisted your IP, you need to authenticate your client using your Database User credentials.
                </p>
                <div className="mt-6">
                    <a href="/docs/auth" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        Continue to Authentication
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </a>
                </div>
            </section>
        </DocsLayout>
    );
};

export default DocsIntro;
