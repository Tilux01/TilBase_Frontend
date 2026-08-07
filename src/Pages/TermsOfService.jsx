import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, Cloud, AlertTriangle, ServerOff, Database } from 'lucide-react';

const TermsOfService = () => {
    const [activeSection, setActiveSection] = useState('acceptance');

    const sections = [
        { id: 'acceptance', title: '1. Acceptance of Terms' },
        { id: 'description', title: '2. Description of Service' },
        { id: 'security', title: '3. Security & Responsibilities' },
        { id: 'fair-use', title: '4. Fair Use & Rate Limiting' },
        { id: 'privacy', title: '5. Data Privacy & Ownership' },
        { id: 'termination', title: '6. Termination & Liability' }
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
                        <Scale size={14} /> Legal Documentation
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-on-surface mb-4">Terms of Service</h1>
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
                    
                    <section id="acceptance" className="scroll-mt-32">
                        <h2 className="text-2xl font-extrabold text-on-surface mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center text-sm">1</span>
                            Acceptance of Terms
                        </h2>
                        <div className="text-on-surface-variant leading-relaxed">
                            <p>
                                By accessing or using the TilBase platform, database clusters, APIs, and associated services (collectively, the "Services"), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, you may not access the website or use any services.
                            </p>
                        </div>
                    </section>

                    <div className="h-px w-full bg-outline-variant/20"></div>

                    <section id="description" className="scroll-mt-32">
                        <h2 className="text-2xl font-extrabold text-on-surface mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center text-sm">2</span>
                            Description of Service
                        </h2>
                        <div className="text-on-surface-variant leading-relaxed space-y-6">
                            <p>
                                TilBase provides managed cloud database infrastructure, including but not limited to Document, Vector DB, RealTime, Flat, and Graph databases. The Services are provided "as is" and "as available". We reserve the right to modify, suspend, or discontinue the Services at any time.
                            </p>
                            <div className="bg-primary-container/30 border border-primary/20 rounded-xl p-6 flex items-start gap-4">
                                <Cloud className="text-primary shrink-0 mt-1" />
                                <div>
                                    <strong className="text-primary block mb-2">Infrastructure Lifecycle</strong>
                                    <p className="text-on-surface-variant text-sm">TilBase automatically manages the scaling, backups, and security routing for your clusters so you can focus on building your application.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="h-px w-full bg-outline-variant/20"></div>

                    <section id="security" className="scroll-mt-32">
                        <h2 className="text-2xl font-extrabold text-on-surface mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center text-sm">3</span>
                            Account Security & Responsibilities
                        </h2>
                        <div className="text-on-surface-variant leading-relaxed">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4 p-4 bg-surface-container rounded-xl border border-outline-variant/10">
                                    <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                                    <div>You are responsible for maintaining the security of your account, database clusters, and API keys.</div>
                                </li>
                                <li className="flex items-start gap-4 p-4 bg-surface-container rounded-xl border border-outline-variant/10">
                                    <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                                    <div>You must immediately notify TilBase of any unauthorized uses of your database or breaches of security.</div>
                                </li>
                                <li className="flex items-start gap-4 p-4 bg-surface-container rounded-xl border-l-4 border-l-amber-500">
                                    <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                                    <div>You are strictly prohibited from using the Services to store illegal, malicious, or highly restricted data.</div>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <div className="h-px w-full bg-outline-variant/20"></div>

                    <section id="fair-use" className="scroll-mt-32">
                        <h2 className="text-2xl font-extrabold text-on-surface mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center text-sm">4</span>
                            Fair Use & Rate Limiting
                        </h2>
                        <div className="text-on-surface-variant leading-relaxed">
                            <p>
                                While TilBase offers free and dedicated tiers, all usage is subject to our Fair Use Policy. We reserve the right to throttle, suspend, or terminate database clusters that consume excessive bandwidth, disk IO, or CPU resources that negatively impact our shared infrastructure.
                            </p>
                        </div>
                    </section>

                    <div className="h-px w-full bg-outline-variant/20"></div>

                    <section id="privacy" className="scroll-mt-32">
                        <h2 className="text-2xl font-extrabold text-on-surface mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center text-sm">5</span>
                            Data Privacy & Ownership
                        </h2>
                        <div className="text-on-surface-variant leading-relaxed">
                            <p>
                                You retain all rights and ownership to the data you store within your TilBase clusters. TilBase claims no ownership over your data. For more details, please review our{' '}
                                <Link to="/privacy" className="text-primary hover:underline decoration-primary/50 underline-offset-4 font-bold">Privacy Policy</Link>.
                            </p>
                        </div>
                    </section>

                    <div className="h-px w-full bg-outline-variant/20"></div>

                    <section id="termination" className="scroll-mt-32">
                        <h2 className="text-2xl font-extrabold text-on-surface mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center text-sm">6</span>
                            Termination & Liability
                        </h2>
                        <div className="text-on-surface-variant leading-relaxed space-y-6">
                            <p>
                                TilBase may terminate your access to all or any part of the Services at any time, with or without cause. In no event will TilBase, or its suppliers or licensors, be liable with respect to any subject matter of this agreement under any contract, negligence, strict liability or other legal or equitable theory.
                            </p>
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-start gap-4">
                                <ServerOff className="text-red-500 shrink-0 mt-1" />
                                <div>
                                    <strong className="text-red-500 block mb-2">Account Termination</strong>
                                    <p className="text-red-500/90 text-sm">If you wish to terminate this agreement, you may simply discontinue using the Services and delete your database clusters from your dashboard.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {}
                    <div className="mt-12 p-8 bg-surface-container border border-outline-variant/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="text-center sm:text-left">
                            <h4 className="font-bold text-on-surface mb-1">Legal Inquiries</h4>
                            <p className="text-sm text-on-surface-variant">Contact our legal department regarding these terms.</p>
                        </div>
                        <a href="mailto:legal@tilbase.com" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all w-full sm:w-auto text-center">
                            legal@tilbase.com
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

export default TermsOfService;
