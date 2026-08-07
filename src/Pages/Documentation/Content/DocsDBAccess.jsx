import React from 'react';
import DocsLayout from '../DocsLayout';

const DocsDBAccess = () => {
    return (
        <DocsLayout>
            <div className="mb-12 border-b border-outline-variant/20 pb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm">Getting Started</span>
                    <span className="material-symbols-outlined text-outline-variant/50 text-[16px]">chevron_right</span>
                    <span className="text-on-surface-variant font-medium text-sm">Database Access</span>
                </div>
                <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-4">
                    Database Access (Users)
                </h1>
                <p className="text-on-surface-variant text-lg max-w-3xl leading-relaxed">
                    Learn how to create Database Users, assign passwords, and manage their Role-Based Access Control (RBAC) privileges for secure database interaction.
                </p>
            </div>

            <section className="mb-16 space-y-6">
                <h2 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">person_add</span>
                    Creating a Database User
                </h2>
                <p className="text-on-surface-variant leading-relaxed text-base">
                    Before your Node.js application can authenticate and interact with TilBase, you must create a dedicated Database User. This user acts as the service account connecting to your cluster.
                </p>
                <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/20 shadow-sm">
                    <ol className="list-decimal pl-5 space-y-3 text-on-surface font-medium">
                        <li>Log in to your TilBase Dashboard.</li>
                        <li>Select your active Project from the dropdown menu.</li>
                        <li>Navigate to the <b>Database Access</b> tab in the left sidebar.</li>
                        <li>Click the <b>New User</b> button.</li>
                        <li>Provide a unique <b>Username</b> and a strong <b>Password</b>. (You will need these exactly as typed when initializing the SDK).</li>
                    </ol>
                </div>
            </section>

            <section className="mb-16 space-y-6">
                <h2 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                    Understanding Roles (RBAC)
                </h2>
                <p className="text-on-surface-variant leading-relaxed text-base">
                    When creating or editing a Database User, you must assign them a specific role. TilBase rigorously enforces these rules on the server-side, preventing unauthorized queries from ever reaching the database engine.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">security</span>
                            </div>
                            <h3 className="text-lg font-bold text-on-surface">Admin Role</h3>
                        </div>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                            Grants full administrative privileges. Users with this role can read data, insert new documents, update fields, and delete records across the entire cluster. Use this role for your primary backend servers.
                        </p>
                    </div>

                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                                <span className="material-symbols-outlined">visibility</span>
                            </div>
                            <h3 className="text-lg font-bold text-on-surface">Read Only Role</h3>
                        </div>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                            Grants query-only access. These users can fetch documents, query collections, and listen to real-time events. Any attempt to save, update, or delete data will be instantly rejected with a <code>403 Forbidden</code> error.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-16 space-y-6">
                <h2 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">gpp_maybe</span>
                    Security Best Practices
                </h2>
                <ul className="list-disc pl-5 space-y-3 text-on-surface-variant leading-relaxed">
                    <li>Never expose your Database User passwords or Cluster Keys in client-side code (like a React or mobile app). Always keep them in environment variables on your backend.</li>
                    <li>Use the <b>Read Only</b> role for microservices that only need to aggregate or read data.</li>
                    <li>If you suspect a credential leak, instantly delete the compromised Database User from the dashboard and create a new one.</li>
                </ul>
            </section>

            <section className="mb-16 space-y-6">
                <h2 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">storage</span>
                    Global Storage Limits
                </h2>
                <p className="text-on-surface-variant leading-relaxed text-base">
                    Every database operation (across Document DB, Vector DB, and Flat DB) is universally monitored by TilBase's storage gateway. Your account has a global storage limit based on your active billing plan.
                </p>
                <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/20 shadow-sm">
                    <p className="text-on-surface-variant leading-relaxed">
                        If an insert or update causes your account to exceed its global storage quota, the transaction will be pre-emptively blocked at the gateway level. Your SDK will receive a <code>403 Forbidden: Storage limit exceeded</code> error. To prevent disruptions, monitor your storage usage via the Dashboard Analytics or upgrade your plan.
                    </p>
                </div>
                <div className="mt-8">
                    <a href="/docs/auth" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        Next: Initialize SDK
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </a>
                </div>
            </section>

        </DocsLayout>
    );
};

export default DocsDBAccess;
