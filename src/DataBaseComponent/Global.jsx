import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { objContext } from '../App';

const Global = () => {
    const navigate = useNavigate();
    const { userCred } = useContext(objContext);

    useEffect(() => {
        if (!userCred) {
            navigate('/signin');
        }
    }, [userCred, navigate]);

    const [activeRegions, setActiveRegions] = useState(['tilux-ng-1']);

    const toggleRegion = (region) => {
        
        if (region === 'tilux-ng-1') return;
        
        if (activeRegions.includes(region)) {
            setActiveRegions(activeRegions.filter(r => r !== region));
        } else if (!activeRegions.includes(region)) {
            setActiveRegions([...activeRegions, region]);
        }
    };

    const regions = [
        { id: 'tilux-ng-1', name: 'TiluxM001 (Nigeria)', top: '55%', left: '51%', available: true },
        { id: 'tilux-eu-1', name: 'TiluxM002 (Frankfurt)', top: '30%', left: '50%', available: false },
        { id: 'tilux-us-1', name: 'TiluxM003 (N. Virginia)', top: '35%', left: '25%', available: false },
        { id: 'tilux-ap-1', name: 'TiluxM004 (Tokyo)', top: '40%', left: '85%', available: false }
    ];

    return (
        <DashboardLayout>
            <div className="flex justify-between items-end mb-10">
                <div className="space-y-1">
                    <h1 className="text-display-sm text-4xl font-extrabold tracking-tight text-on-surface">Global Distribution</h1>
                    <p className="text-on-surface-variant text-sm font-medium">Manage multi-region replication and edge caching.</p>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-on-primary px-5 py-2.5 rounded-lg font-bold transition-all shadow-md">
                    Save Configuration
                </button>
            </div>

            <div className="flex flex-col xl:flex-row gap-6 w-full">
                {}
                <div className="flex-1 bg-surface-container p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none"></div>
                    <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary animate-pulse">language</span>
                        Replication Map
                    </h2>
                    
                    <div className="w-full aspect-[2/1] bg-surface-container border border-black/5 dark:border-white/5 rounded-lg border border-black/5 dark:border-white/5 relative overflow-hidden bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-cover opacity-80">
                        {regions.map((region) => {
                            const isActive = activeRegions.includes(region.id);
                            const isPrimary = region.id === 'tilux-ng-1';
                            return (
                                <div 
                                    key={region.id}
                                    onClick={() => region.available ? toggleRegion(region.id) : null}
                                    className={`absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 ${region.available ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-60'}`}
                                    style={{ top: region.top, left: region.left }}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 shadow-[0_0_15px_rgba(0,0,0,0.5)] ${isActive ? 'bg-primary border-white animate-hologram' : 'bg-surface border-black/5 dark:border-white/5'}`}></div>
                                    <span className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded border backdrop-blur-sm ${isActive ? 'bg-surface-container-highest text-primary border-primary' : 'bg-surface-container border border-black/5 dark:border-white/5 text-on-surface-variant border-black/5 dark:border-white/5'}`}>
                                        {region.name} {isPrimary && '(Primary)'} {!region.available && '(Soon)'}
                                    </span>
                                </div>
                            )
                        })}
                        {}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            {activeRegions.filter(r => r !== 'tilux-ng-1').map((region) => {
                                const target = regions.find(r => r.id === region);
                                const source = regions.find(r => r.id === 'tilux-ng-1');
                                return (
                                    <line 
                                        key={region}
                                        x1={source.left} y1={source.top} 
                                        x2={target.left} y2={target.top} 
                                        stroke="currentColor" 
                                        className="text-primary/40"
                                        strokeWidth="2" 
                                        strokeDasharray="4"
                                    >
                                        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
                                    </line>
                                )
                            })}
                        </svg>
                    </div>
                </div>

                {}
                <div className="w-full xl:w-[400px] flex flex-col gap-6">
                    <div className="bg-surface-container p-6 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                        <h3 className="font-bold text-on-surface mb-4">Active Regions</h3>
                        <div className="space-y-3">
                            {regions.map(region => (
                                <div key={region.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${activeRegions.includes(region.id) ? 'border-primary bg-surface-container-highest' : 'border-black/5 dark:border-white/5 bg-surface'} ${!region.available ? 'opacity-60' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`material-symbols-outlined ${activeRegions.includes(region.id) ? 'text-primary' : 'text-on-surface-variant/50'}`}>
                                            dns
                                        </span>
                                        <div>
                                            <p className="text-sm font-bold text-on-surface">{region.name}</p>
                                            <p className="text-xs text-on-surface-variant opacity-70">{region.available ? region.id : 'Coming Soon'}</p>
                                        </div>
                                    </div>
                                    <div 
                                        onClick={() => region.available ? toggleRegion(region.id) : null}
                                        className={`w-10 h-5 rounded-full relative transition-colors ${region.available ? 'cursor-pointer' : 'cursor-not-allowed'} ${activeRegions.includes(region.id) ? 'bg-primary' : 'bg-surface-container-high'}`}
                                    >
                                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${activeRegions.includes(region.id) ? 'translate-x-5' : ''}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Global;
