import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const DocsSidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const navGroups = [
        {
            title: "Getting Started",
            links: [
                { title: "Introduction", path: "/docs" },
                { title: "Database Access", path: "/docs/db-access" },
                { title: "Authentication", path: "/docs/auth" },
                { title: "Error Handling", path: "/docs/error-handling" }
            ]
        },
        {
            title: "Database SDKs",
            links: [
                { title: "Document DB", path: "/docs/document-db", icon: "data_object" },
                { title: "Vector DB", path: "/docs/vector", icon: "data_array" },
                { title: "Realtime DB", path: "/docs/realtime-db", icon: "bolt" },
                { title: "Graph DB", path: "/docs/graph-db", icon: "hub" },
                { title: "Hierarchical DB", path: "/docs/hierarchical-db", icon: "account_tree" },
                { title: "Flat DB", path: "/docs/flat-db", icon: "description" },
            ]
        },
        {
            title: "AI Integrations",
            links: [
                { title: "ChatBase", path: "/docs/chatbase", icon: "forum" }
            ]
        },
        {
            title: "Advanced",
            links: [
                { title: "Raw WebSockets", path: "/docs/webhooks", icon: "webhook" },
                { title: "Backups & Exporting", path: "/docs/backups", icon: "download" }
            ]
        }
    ];

    return (
        <aside className="fixed left-0 top-16 w-72 h-[calc(100vh-64px)] bg-surface-container-lowest border-r border-outline-variant/30 overflow-y-auto hidden md:flex flex-col z-40 transition-colors duration-300">
            <div className="p-6">
                {navGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="mb-8 last:mb-0">
                        <h3 className="text-xs font-extrabold text-on-surface-variant uppercase tracking-widest mb-3 px-3">
                            {group.title}
                        </h3>
                        <div className="flex flex-col space-y-1">
                            {group.links.map((link, linkIdx) => {
                                const isActive = currentPath === link.path;
                                return (
                                    <NavLink 
                                        key={linkIdx} 
                                        to={link.path}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
                                    >
                                        {link.icon && (
                                            <span className="material-symbols-outlined text-[18px]">
                                                {link.icon}
                                            </span>
                                        )}
                                        {link.title}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default DocsSidebar;
