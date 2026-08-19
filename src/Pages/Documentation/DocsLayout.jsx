import React from 'react';
import DocsHeader from './DocsHeader';
import DocsSidebar from './DocsSidebar';

const DocsLayout = ({ children, toc }) => {
    return (
        <div className="min-h-screen bg-background text-on-surface w-full font-sans transition-colors duration-300">
            <DocsHeader />
            <DocsSidebar />
            
            <div className="flex pt-16 md:pl-72 w-full max-w-full">
                <main className="flex-1 min-w-0 max-w-5xl mx-auto px-6 py-12 lg:px-12">
                    {children}
                </main>
                
                {}
                {toc && (
                    <aside className="hidden xl:block w-64 flex-shrink-0 pt-12 pr-8">
                        <div className="sticky top-28 bg-surface-container p-5 rounded-xl border border-black/5 dark:border-black/5 dark:border-white/5 shadow-sm backdrop-blur-md">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">On this page</h4>
                            {toc}
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
};

export default DocsLayout;
