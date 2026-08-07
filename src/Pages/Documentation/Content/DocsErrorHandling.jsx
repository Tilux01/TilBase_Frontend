import React, { useState, useEffect } from 'react';
import DocsLayout from '../DocsLayout';
import CodeWindow from '../../../Components/CodeWindow';

const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'http-status', title: 'HTTP Status Codes' },
    { id: 'storage-limits', title: 'Storage Limit Exceeded (429)' },
    { id: 'cluster-paused', title: 'Cluster Paused (403)' },
    { id: 'rbac', title: 'RBAC Access Denied (403)' },
];

const DocsErrorHandling = () => {
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
                    <span className="text-primary font-bold tracking-widest uppercase text-sm">Getting Started</span>
                    <span className="material-symbols-outlined text-outline-variant/50 text-[16px]">chevron_right</span>
                    <span className="text-on-surface-variant font-medium text-sm">Error Handling</span>
                </div>
                <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-4">
                    Error Handling & Limits
                </h1>
                <p className="text-on-surface-variant text-base max-w-3xl leading-relaxed">
                    TilBase strictly enforces security, access control, and storage quotas at the API level. Understand how to handle the standard JSON error payloads returned by the backend.
                </p>
            </div>

            <section id="overview" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">warning</span>
                    Overview
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Whenever an operation fails—whether due to incorrect credentials, hitting a billing limit, or attempting an unauthorized action—TilBase always returns a standardized JSON payload. If you are using the Node.js SDK, these errors are thrown as standard exceptions that you should catch using <code>try/catch</code> blocks.
                </p>
            </section>

            <section id="http-status" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">list_alt</span>
                    Common HTTP Status Codes
                </h2>
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container text-on-surface-variant text-sm border-b border-outline-variant/30">
                                <th className="p-4 font-bold">Code</th>
                                <th className="p-4 font-bold">Meaning</th>
                                <th className="p-4 font-bold">Common Cause</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-outline-variant/20">
                                <td className="p-4 font-mono text-primary font-bold">400</td>
                                <td className="p-4 font-medium">Bad Request</td>
                                <td className="p-4 text-on-surface-variant">Missing required fields (e.g., missing <code>clusterKey</code>).</td>
                            </tr>
                            <tr className="border-b border-outline-variant/20">
                                <td className="p-4 font-mono text-primary font-bold">401</td>
                                <td className="p-4 font-medium">Unauthorized</td>
                                <td className="p-4 text-on-surface-variant">Invalid credentials or mismatched API keys.</td>
                            </tr>
                            <tr className="border-b border-outline-variant/20">
                                <td className="p-4 font-mono text-primary font-bold">403</td>
                                <td className="p-4 font-medium">Forbidden</td>
                                <td className="p-4 text-on-surface-variant">Role-Based Access Control (RBAC) rejection or Paused Cluster.</td>
                            </tr>
                            <tr className="border-b border-outline-variant/20">
                                <td className="p-4 font-mono text-primary font-bold">404</td>
                                <td className="p-4 font-medium">Not Found</td>
                                <td className="p-4 text-on-surface-variant">Cluster does not exist or was deleted.</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-mono text-primary font-bold">429</td>
                                <td className="p-4 font-medium">Too Many Requests</td>
                                <td className="p-4 text-on-surface-variant">Storage quota exceeded for the current billing plan.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section id="storage-limits" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">storage</span>
                    Storage Limit Exceeded (429)
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Before any data is written (Document, Vector, Chatbase, etc.), the backend proactively checks the cluster's <code>space_used</code> against the plan's storage limit. If the limit is reached, the transaction is immediately blocked.
                </p>
                <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/20 font-mono text-sm mb-4">
                    <span className="text-error">HTTP 429 Too Many Requests</span>
                    <pre className="text-on-surface mt-2">
{`{
  "message": "Storage limit exceeded. Upgrade your plan."
}`}
                    </pre>
                </div>
                <CodeWindow 
                    title="Handling Storage Limits" 
                    language="javascript"
                    code={`try {
    await documentStore.addDoc("users", { name: "John Doe" });
} catch (error) {
    if (error.status === 429) {
        console.error("Failed to write: Please upgrade your storage plan in the Dashboard.");
        // Prompt the user or notify the admin
    }
}`} 
                />
            </section>

            <section id="cluster-paused" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">pause_circle</span>
                    Cluster Paused (403)
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    If a cluster's <code>Current_State</code> is set to <code>paused</code> (e.g., due to an admin action or billing lapse), the backend authentication completely rejects all connections until the state returns to <code>active</code>.
                </p>
                <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/20 font-mono text-sm mb-4">
                    <span className="text-error">HTTP 403 Forbidden</span>
                    <pre className="text-on-surface mt-2">
{`{
  "message": "Cluster is currently paused."
}`}
                    </pre>
                </div>
            </section>

            <section id="rbac" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">gpp_bad</span>
                    RBAC Access Denied (403)
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    TilBase enforces Role-Based Access Control on the client side. If your API key is assigned a <strong>Read Only</strong> role, any attempt to execute write operations (like <code>addDoc</code>, <code>setValue</code>, or <code>deleteBucket</code>) will be actively blocked.
                </p>
                <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/20 font-mono text-sm mb-4">
                    <span className="text-error">HTTP 403 Forbidden</span>
                    <pre className="text-on-surface mt-2">
{`{
  "message": "Access Denied: Read-only permissions."
}`}
                    </pre>
                </div>
                <CodeWindow 
                    title="Catching RBAC Errors" 
                    language="javascript"
                    code={`try {
    await flatStore.deleteBucket("production_users");
} catch (error) {
    // If the active key is Read Only, the operation is blocked.
    console.error("Action rejected:", error.message);
}`} 
                />
            </section>
        </DocsLayout>
    );
};

export default DocsErrorHandling;
