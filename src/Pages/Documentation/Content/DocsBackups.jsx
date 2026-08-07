import React, { useState, useEffect } from 'react';
import DocsLayout from '../DocsLayout';
import CodeWindow from '../../../Components/CodeWindow';

const sections = [
    { id: 'concepts', title: 'Snapshot Backups' },
    { id: 'trigger', title: 'Triggering Backups' },
    { id: 'restore', title: 'Restoring Data' },
];

const DocsBackups = () => {
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
                    <span className="text-primary font-bold tracking-widest uppercase text-sm">Advanced</span>
                    <span className="material-symbols-outlined text-outline-variant/50 text-[16px]">chevron_right</span>
                    <span className="text-on-surface-variant font-medium text-sm">Backups & Exporting</span>
                </div>
                <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-4">
                    Data Backups
                </h1>
                <p className="text-on-surface-variant text-base max-w-3xl leading-relaxed">
                    Protect your application data by utilizing TilBase's native JSON serialization engine. You can instantly export raw rows out of any database engine.
                </p>
            </div>

            <section id="concepts" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">data_object</span>
                    Snapshot Backups
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    The Backup Engine dynamically identifies whether a cluster is a Document, Flat, or Vector database. It rips the raw rows straight out of the underlying SQL storage layer, packages them into a serialized JSON blob, and generates a downloadable file.
                </p>
            </section>

            <section id="trigger" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">downloading</span>
                    Triggering Backups
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    While you can manually trigger a backup from your cluster's dashboard by clicking the "Backup" button, you can also trigger a backup programmatically. Note: Generating a massive backup may temporarily impact your cluster's read/write latency.
                </p>
                <CodeWindow 
                    title="Generate Backup" 
                    language="javascript"
                    code={`// Request a backup serialization (Returns a download link)
const backupUrl = await db.triggerBackup("cluster_id");
console.log("Download your JSON snapshot here:", backupUrl);`} 
                />
            </section>

            <section id="restore" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">restore</span>
                    Restoring Data
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Since TilBase backups are purely standard JSON arrays, you can easily parse the downloaded file in your own application and re-upload the objects using the standard <code>addDoc</code> or <code>setValue</code> SDK methods if you ever need to restore a wiped database.
                </p>
            </section>
        </DocsLayout>
    );
};

export default DocsBackups;
