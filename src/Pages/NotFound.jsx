import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [terminalText, setTerminalText] = useState("");
    
    const fullText = `> Initializing route trace...\n> Pinging destination...\n> Destination unreachable.\n> ERROR 404: Node not found in current cluster topology.\n> Connection terminated.`;

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setTerminalText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 30);
        return () => clearInterval(interval);
    }, [fullText]);

    const handleMouseMove = (e) => {
        const { currentTarget, clientX, clientY } = e;
        const { left, top } = currentTarget.getBoundingClientRect();
        setMousePos({ x: clientX - left, y: clientY - top });
    };

    return (
        <div 
            className="min-h-screen w-full bg-surface-container-lowest flex items-center justify-center p-6 relative overflow-hidden text-on-surface"
            onMouseMove={handleMouseMove}
            style={{
                '--mouse-x': `${mousePos.x}px`,
                '--mouse-y': `${mousePos.y}px`
            }}
        >
            {}
            <div 
                className="absolute inset-0 z-0 opacity-40 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle 600px at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.15), transparent 40%)'
                }}
            >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 relative">
                
                {}
                <div className="flex flex-col gap-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/10 text-error border border-error/20 w-max">
                        <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-widest">Routing Error</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-on-surface to-on-surface-variant drop-shadow-xl">
                        404
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Route Not Found</h2>
                    
                    <p className="text-on-surface-variant max-w-md leading-relaxed">
                        The sector you are looking for has been dropped from the routing table, or the cluster does not exist in this topology.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">route</span>
                            Reroute to Main Cluster
                        </button>
                        <button 
                            onClick={() => navigate('/monitoring')}
                            className="px-6 py-3 bg-surface-container-high border border-outline-variant text-on-surface font-semibold rounded-lg hover:bg-surface-variant transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">query_stats</span>
                            View System Status
                        </button>
                    </div>
                    
                    <Link to="/security" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 w-max mt-2">
                        <span className="material-symbols-outlined text-[16px]">policy</span>
                        Check Audit Logs
                    </Link>
                </div>

                {}
                <div className="relative flex flex-col gap-6 perspective-[1000px]">
                    
                    {}
                    <div className="w-full h-48 bg-surface-container rounded-2xl border border-outline-variant shadow-2xl relative overflow-hidden flex items-center justify-center group transform -rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-700">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                        <div className="grid grid-cols-4 gap-4 p-6 w-full">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((node) => (
                                <div key={node} className={`h-12 rounded-lg border ${node === 6 ? 'bg-error/20 border-error animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-surface-container-high border-outline-variant group-hover:border-primary transition-colors'}`}>
                                    {node === 6 && <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-error text-sm">warning</span></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {}
                    <div className="w-full bg-[#0a0a0a] rounded-xl border border-outline-variant shadow-2xl overflow-hidden font-mono text-sm transform -rotate-y-6 rotate-x-6 hover:rotate-0 transition-transform duration-700">
                        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest border-b border-outline-variant">
                            <div className="w-3 h-3 rounded-full bg-error"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span className="text-[10px] text-on-surface-variant font-bold ml-2">tilbase@routing-daemon:~</span>
                        </div>
                        <div className="p-4 h-48 overflow-y-auto">
                            <pre className="text-primary whitespace-pre-wrap font-mono text-xs leading-relaxed">
                                {terminalText}
                                <span className="animate-pulse">_</span>
                            </pre>
                        </div>
                    </div>
                    
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                .perspective-\\[1000px\\] { perspective: 1000px; }
                .-rotate-y-12 { transform: rotateY(-12deg); }
                .-rotate-y-6 { transform: rotateY(-6deg); }
                .rotate-x-6 { transform: rotateX(6deg); }
            `}} />
        </div>
    );
};

export default NotFound;
