import React from 'react';
import DocsLayout from '../DocsLayout';
import { useLocation } from 'react-router-dom';

const DocsPlaceholder = () => {
    const location = useLocation();
    
    
    const getTitle = () => {
        if (location.pathname.includes('vector')) return "Vector DB";
        if (location.pathname.includes('realtime')) return "Realtime DB";
        if (location.pathname.includes('graph')) return "Graph DB";
        if (location.pathname.includes('flat')) return "Flat DB";
        if (location.pathname.includes('chatbase')) return "ChatBase";
        return "Coming Soon";
    };

    return (
        <DocsLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6 border-4 border-surface-container-highest shadow-xl shadow-primary/5">
                    <span className="material-symbols-outlined text-4xl text-primary animate-pulse">
                        construction
                    </span>
                </div>
                
                <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    {getTitle()}
                </h1>
                
                <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed mb-8">
                    We are actively building the SDK documentation and API methods for this module. 
                    Check back soon for incredible features!
                </p>

                <div className="bg-surface-container border border-black/5 dark:border-black/5 dark:border-white/5 px-6 py-4 rounded-xl max-w-md w-full">
                    <h3 className="text-sm font-bold text-on-surface mb-2 uppercase tracking-widest text-left">Stay Updated</h3>
                    <div className="flex gap-2">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="flex-1 bg-surface-container-highest border border-black/5 dark:border-black/5 dark:border-white/5 rounded-lg px-4 py-2 text-sm text-on-surface focus:border-primary outline-none"
                        />
                        <button className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
                            Notify Me
                        </button>
                    </div>
                </div>
            </div>
        </DocsLayout>
    );
};

export default DocsPlaceholder;
