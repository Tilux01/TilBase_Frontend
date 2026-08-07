import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, CheckCircle2 } from 'lucide-react';

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState('data-collection');

    const sections = [
        { id: 'data-collection', title: '1. Information We Collect' },
        { id: 'data-security', title: '2. Data Storage & Security' },
        { id: 'third-party', title: '3. Third-Party Integrations' },
        { id: 'user-rights', title: '4. User Rights & GDPR' }
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150;
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
                    setActiveSection(section.id);
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-surface-container-lowest text-on-surface font-sans">
            {}
            <header className="sticky top-0 z-50 w-full bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30 px-6 sm:px-12 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-primary text-2xl" data-icon="database">database</span>
                    </div>
                    <span className="text-xl font-extrabold tracking-tighter text-primary">TIlBase</span>
                </Link>
                <Link to="/signup">
                    <button className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary bg-surface-container hover:bg-primary-container/20 px-5 py-2 rounded-lg transition-colors border border-outline-variant/20">
                        <ArrowLeft size={16} /> Back to Sign Up
                    </button>
                </Link>
            </header>

            {}
            <div className="w-full bg-surface-container border-b border-outline-variant/20 px-6 sm:px-12 py-16">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-primary text-xs font-bold mb-6 uppercase tracking-widest">
                        <Shield size={14} /> Legal Documentation
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-on-surface mb-4">Privacy Policy</h1>
                    <p className="text-on-surface-variant font-medium">Last updated: July 30, 2026</p>
                </div>
            </div>

            {}
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-12 flex flex-col md:flex-row gap-12">
                
                {}
                <aside className="w-full md:w-64 shrink-0">
                    <div className="sticky top-32 bg-surface-container border border-outline-variant/20 rounded-2xl p-6">
                        <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Contents</h3>
                        <nav className="flex flex-col gap-2">
                            {sections.map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`text-left text-sm font-semibold px-3 py-2 rounded-lg transition-colors ${
                                        activeSection === section.id 
                                            ? 'bg-primary text-white shadow-sm' 
                                            : 'text-on-surface-variant hover:bg-surface-container-highest'
                                    }`}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {}
                <main className="flex-1 space-y-16 pb-24">
                    
                    <section id="data-collection" className="scroll-mt-32">
                        <h2 className="text-2xl font-extrabold text-on-surface mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center text-sm">1</span>
                            Information We Collect
                        </h2>
                        <div className="text-on-surface-variant leading-relaxed space-y-4">
                            <p>We collect information to provide better services to our users. This includes:</p>
                            <ul className="space-y-4 mt-6">
                                <li className="flex items-start gap-4 p-4 bg-surface-container rounded-xl border border-outline-variant/10">
                                    <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-on-surface block mb-1">Account Data</strong>
                                        Email address, username, and authentication tokens (including those provided securely via Google or GitHub OAuth).
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 p-4 bg-surface-container rounded-xl border border-outline-variant/10">
                                    <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-on-surface block mb-1">Platform Usage</strong>
                                        IP addresses, browser types, and interactions with the TilBase dashboard for security monitoring.
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <div className="h-px w-full bg-outline-variant/20"></div>

                    <section id="data-security" className="scroll-mt-32">
                        <h2 className="text-2xl font-extrabold text-on-surface mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center text-sm">2</span>
                            Data Storage & Security
                        </h2>
                        <div className="text-on-surface-variant leading-relaxed space-y-6">
                            <p>
                                We utilize enterprise-grade security architecture to protect your data. All database clusters are encrypted at rest using AES-256 and in transit via TLS 1.3. 
                                We enforce strict Role-Based Access Control (RBAC) and network IP whitelisting to ensure your data is completely inaccessible to unauthorized parties.
                            </p>
                            <div className="bg-primary-container/30 border border-primary/20 rounded-xl p-6 flex items-start gap-4">
                                <Lock className="text-primary shrink-0 mt-1" />
                                <div>
                                    <strong className="text-primary block mb-2">Zero Knowledge Architecture</strong>
                                    <p className="text-on-surface-variant text-sm">We do not have access to your database passwords, nor do we inspect the contents of your database rows. We only store cryptographic hashes.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="h-px w-full bg-outline-variant/20"></div>

                    <section id="third-party" className="scroll-mt-32">
                        <h2 className="text-2xl font-extrabold text-on-surface mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center text-sm">3</span>
                            Third-Party Integrations
                        </h2>
                        <div className="text-on-surface-variant leading-relaxed">
                            <p>
                                When you authenticate via third-party providers (Google or GitHub), we strictly request only your verified email address and public profile image. 
                                <strong className="text-on-surface block mt-4 p-4 bg-surface-container rounded-xl border-l-4 border-primary">
                                    We will never sell, rent, or trade your personal data to third parties.
                                </strong>
                            </p>
                        </div>
                    </section>

                    <div className="h-px w-full bg-outline-variant/20"></div>

                    <section id="user-rights" className="scroll-mt-32">
                        <h2 className="text-2xl font-extrabold text-on-surface mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center text-sm">4</span>
                            User Rights & GDPR Compliance
                        </h2>
                        <div className="text-on-surface-variant leading-relaxed space-y-6">
                            <p>
                                If you are a resident of the European Economic Area (EEA), you have certain data protection rights under the GDPR. 
                                TilBase aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <li className="flex items-center gap-3 p-4 bg-surface-container rounded-xl">
                                    <Eye size={18} className="text-primary shrink-0" />
                                    <span className="text-sm font-medium">Access, update or delete info</span>
                                </li>
                                <li className="flex items-center gap-3 p-4 bg-surface-container rounded-xl">
                                    <Eye size={18} className="text-primary shrink-0" />
                                    <span className="text-sm font-medium">Right of rectification</span>
                                </li>
                                <li className="flex items-center gap-3 p-4 bg-surface-container rounded-xl">
                                    <Eye size={18} className="text-primary shrink-0" />
                                    <span className="text-sm font-medium">Data portability</span>
                                </li>
                            </ul>
                        </div>
                    </section>
                    
                    {}
                    <div className="mt-12 p-8 bg-surface-container border border-outline-variant/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="text-center sm:text-left">
                            <h4 className="font-bold text-on-surface mb-1">Questions about our Privacy Policy?</h4>
                            <p className="text-sm text-on-surface-variant">Reach out to our legal team directly.</p>
                        </div>
                        <a href="mailto:privacy@tilbase.com" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all w-full sm:w-auto text-center">
                            Contact Legal
                        </a>
                    </div>

                </main>
            </div>
            
            <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/20 py-8 text-center text-sm font-semibold text-on-surface-variant/60">
                &copy; {new Date().getFullYear()} TIlBase Inc. All rights reserved.
            </footer>
        </div>
    );
};

export default PrivacyPolicy;
