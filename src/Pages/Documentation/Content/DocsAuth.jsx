import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeWindow from '../../../Components/CodeWindow';

const DocsAuth = () => {
    return (
        <DocsLayout>
            <div className="mb-12 border-b border-black/5 dark:border-black/5 dark:border-white/5 pb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm">Getting Started</span>
                    <span className="material-symbols-outlined text-outline-variant/50 text-[16px]">chevron_right</span>
                    <span className="text-on-surface-variant font-medium text-sm">Authentication</span>
                </div>
                <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-4">
                    Authentication & Keys
                </h1>
                <p className="text-on-surface-variant text-lg max-w-3xl leading-relaxed">
                    Learn how to initialize the TilBase SDK using your Project, Cluster, and Database User credentials securely.
                </p>
            </div>

            <section className="mb-16 space-y-6">
                <h2 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                    Role-Based Access Control
                </h2>
                <div className="bg-surface-container-highest border border-primary rounded-xl p-6">
                    <p className="text-on-surface leading-relaxed font-medium">
                        TilBase enforces strict RBAC (Role-Based Access Control) on the server. When you create a Database User in the <b>Database Access</b> tab, you assign them a specific role:
                    </p>
                    <ul className="list-disc pl-5 mt-4 space-y-2 text-on-surface-variant">
                        <li><b>Admin:</b> Has full read, write, update, and delete access.</li>
                        <li><b>Read Only:</b> Can only fetch data and listen to events. Any write attempt will be rejected by the server with a 403 error.</li>
                    </ul>
                </div>
            </section>

            <section className="mb-16 space-y-6">
                <h2 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">key</span>
                    Initializing the SDK
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    To connect to a specific cluster, you must instantiate the <code>TilBase</code> class and call the asynchronous <code>Auth()</code> method with your 6 credentials.
                </p>
                <div className="overflow-x-auto bg-surface-container rounded-xl border border-black/5 dark:border-black/5 dark:border-white/5 mb-6">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-surface-container-high border-b border-black/5 dark:border-black/5 dark:border-white/5 text-on-surface">
                            <tr>
                                <th className="p-4 font-bold">Parameter</th>
                                <th className="p-4 font-bold">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10 text-on-surface-variant">
                            <tr>
                                <td className="p-4 font-mono text-primary font-bold">Profile_Key</td>
                                <td className="p-4">Your global account identifier (found in Settings).</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-mono text-primary font-bold">Project_Key</td>
                                <td className="p-4">The ID of the project containing the cluster.</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-mono text-primary font-bold">Cluster_Key</td>
                                <td className="p-4">The secret key of the specific database cluster.</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-mono text-primary font-bold">dbUser</td>
                                <td className="p-4">The username created in the Database Access tab.</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-mono text-primary font-bold">dbPassword</td>
                                <td className="p-4">The password for the Database User.</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-mono text-primary font-bold">serverName</td>
                                <td className="p-4">The display name of the cluster (e.g., 'TiluxM001').</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <CodeWindow 
                    title="auth.js" 
                    language="javascript"
                    code={`const TilBase = require("tilbase-sdk");

// Create a new instance
const db = new TilBase();

async function connectDB() {
    try {
        await db.Auth(
            "YOUR_PROFILE_KEY",
            "YOUR_PROJECT_KEY",
            "YOUR_CLUSTER_KEY",
            "YOUR_DB_USERNAME",
            "YOUR_DB_PASSWORD",
            "TiluxM001" // Your Server Name
        );
        console.log("Successfully connected and authenticated!");
    } catch (error) {
        console.error("Authentication failed:", error.message);
    }
}

connectDB();`} 
                />
            </section>
        </DocsLayout>
    );
};

export default DocsAuth;
