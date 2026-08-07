import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { objContext } from '../../App';

const DocsHeader = () => {
    const { theme, setTheme } = useContext(objContext);
    const navigate = useNavigate();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="fixed top-0 w-full h-16 z-50 bg-surface-container-lowest border-b border-outline-variant/30 flex justify-between items-center px-6 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <Link to="/docs" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span className="text-xl font-bold tracking-tighter text-primary">TIlBase</span>
                    <span className="text-xl font-medium text-on-surface-variant">Docs</span>
                </Link>
                
                {}
                <div className="hidden lg:flex items-center bg-surface-container px-3 py-1.5 rounded-lg border border-transparent focus-within:border-primary transition-all ml-8 w-64 lg:w-96">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
                    <input 
                        className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full text-on-surface ml-2" 
                        placeholder="Search documentation..." 
                        type="text" 
                    />
                    <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-1.5 py-0.5 rounded ml-2">⌘K</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleTheme} 
                    className="p-2 text-on-surface-variant hover:bg-surface-container transition-colors rounded-lg flex items-center justify-center"
                    aria-label="Toggle Theme"
                >
                    <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                </button>

                <div className="h-6 w-px bg-outline-variant/30 mx-2 hidden md:block"></div>

                <Link to="/dashboard">
                    <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-bold rounded-lg border border-outline-variant/30 transition-all hover:border-primary/50">
                        Go to Dashboard
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                </Link>
            </div>
        </header>
    );
};

export default DocsHeader;
