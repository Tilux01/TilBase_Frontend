import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import CopyButton from './CopyButton'
import { objContext } from '../App'
const DocumentPreview = () => {
    const navigate = useNavigate();
    const { userCred, currentProjectCred } = useContext(objContext);
    
    useEffect(() => {
        if (!userCred) {
            navigate('/signin');
        } else if (!currentProjectCred) {
            navigate('/dashboard');
        }
    }, [userCred, currentProjectCred, navigate]);

    return (
        <div style={{width: "100%"}} className='bg-background text-on-surface flex h-screen overflow-hidden w-full'>
            <aside className="flex flex-col h-full py-6 space-y-2 bg-[#f1f5f0] dark:bg-[#111827] h-screen w-64 docked left-0 border-r-0 shadow-[4px_0_24px_rgba(17,24,39,0.02)] z-30">
                <div className="px-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
                            <span className="material-symbols-outlined">database</span>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-primary tracking-tight">Main_Cluster_v1</h2>
                            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">AWS-East-1</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 px-3 space-y-1">
                    <a className="flex items-center gap-3 px-3 py-2.5 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all rounded-r-lg group" href="#">
                        <span className="material-symbols-outlined text-xl">dashboard</span>
                        <span className="text-sm font-medium">Dashboard</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 bg-white dark:bg-[#1f2937] text-primary dark:text-white rounded-r-lg border-l-4 border-primary ml-[-1px] transition-all" href="#">
                        <span className="material-symbols-outlined text-xl">database</span>
                        <span className="text-sm font-semibold">Collections</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all rounded-r-lg" href="#">
                        <span className="material-symbols-outlined text-xl">terminal</span>
                        <span className="text-sm font-medium">Query Engine</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all rounded-r-lg" href="#">
                        <span className="material-symbols-outlined text-xl">folder_open</span>
                        <span className="text-sm font-medium">Storage</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all rounded-r-lg" href="#">
                        <span className="material-symbols-outlined text-xl">group</span>
                        <span className="text-sm font-medium">Users</span>
                    </a>
                </nav>
                <div className="px-4 py-4">
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl shadow-lg shadow-primary/10 hover:scale-[0.98] transition-transform font-semibold text-sm">
                        <span className="material-symbols-outlined text-sm">add</span>
                        New Collection
                    </button>
                </div>
                <div className="px-3 pt-4 border-t border-outline-variant/20 space-y-1">
                    <a className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-primary transition-all rounded-lg" href="#">
                        <span className="material-symbols-outlined text-xl">help_outline</span>
                        <span className="text-sm font-medium">Support</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-primary transition-all rounded-lg" href="#">
                        <span className="material-symbols-outlined text-xl">tune</span>
                        <span className="text-sm font-medium">Settings</span>
                    </a>
                </div>
            </aside>
            <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative">
                <header className="flex justify-between items-center w-full px-8 py-4 bg-[#f7faf6] dark:bg-[#111827] sticky top-0 z-20">
                    <div className="flex items-center gap-8">
                        <h1 className="text-xl font-black text-primary dark:text-[#f7faf6] tracking-tighter uppercase">TilBase</h1>
                        <div className="hidden lg:flex items-center space-y-0 space-x-6">
                            <a className="font-inter tracking-tight font-semibold text-sm text-primary border-b-2 border-primary pb-1" href="#">Projects</a>
                            <a className="font-inter tracking-tight font-medium text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Logs</a>
                            <a className="font-inter tracking-tight font-medium text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">API</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group hidden sm:block">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">search</span>
                            <input className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-full pl-10 pr-4 py-2 text-sm w-64 transition-all" placeholder="Search clusters..." type="text" />
                        </div>
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="h-8 w-[1px] bg-outline-variant/30"></div>
                        <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-surface-container transition-colors">
                            <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden">
                                <img alt="User profile" className="w-full h-full object-cover" data-alt="A professional headshot of a software engineer in a bright, modern studio setting. The lighting is soft and even, highlighting a friendly and confident expression. The overall aesthetic is clean and high-end, utilizing a palette of soft neutrals and deep forest greens to match the architectural UI design." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC74FH4ZpX8EwZMf-uxU2K41MKhiaMwoN3wjppok1bCUxrLOAcIvXIgP8jCsPf9KejAylY3Osa1a8YRBrtZG9z5gGwQS3UxEdIcpxeRzZSAhFVK04jHT8dceVAq8FhlFiMay_OguG4FteQ28IuZ1H4alED_GJye3P69hes4-xzVNMw42POLkIgojCr7CYdCqskATG_XcdMI_Q0Rl0ehTAj6bhrHPRUUPperfYBQ4lW0WOZj0K0AYagXV-ca_I6V-UJ3P2QFXY5sh72W" />
                            </div>
                        </button>
                    </div>
                </header>
                <div className="px-8 pt-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <nav className="flex items-center text-xs font-medium tracking-wide">
                        <a className="text-on-surface-variant hover:text-primary" href="#">Project Alpha</a>
                        <span className="material-symbols-outlined text-[14px] mx-2 text-outline-variant">chevron_right</span>
                        <a className="text-on-surface-variant hover:text-primary" href="#">Analytics_DB</a>
                        <span className="material-symbols-outlined text-[14px] mx-2 text-outline-variant">chevron_right</span>
                        <span className="text-on-surface font-bold">Users</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 text-xs font-bold text-on-primary-fixed-variant bg-surface-container-high rounded-lg hover:bg-surface-variant transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">download</span>
                            Export JSON
                        </button>
                        <button className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">add_circle</span>
                            Insert Document
                        </button>
                    </div>
                </div>
                <div className="flex-1 px-8 pb-8 flex flex-col gap-6 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3 bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 border border-outline-variant/10 shadow-sm">
                            <span className="material-symbols-outlined text-primary bg-primary-fixed/30 p-2 rounded-lg">filter_alt</span>
                            <input 
                                className="flex-1 border-none focus:ring-0 text-sm placeholder:text-outline p-0 bg-transparent" 
                                placeholder="Filter documents by { key: value } or query string..." 
                                type="text" 
                                onChange={() => {}}
                            />
                            <div className="h-6 w-[1px] bg-outline-variant/30"></div>
                            <button className="text-xs font-bold text-primary px-3 py-1 hover:bg-primary/5 rounded-md">Run Query</button>
                        </div>
                        <div className="bg-primary text-white rounded-xl p-4 flex items-center justify-between shadow-md overflow-hidden relative">
                            <div className="relative z-10">
                                <p className="text-[10px] uppercase tracking-tighter opacity-80 font-bold">Total Documents</p>
                                <p className="text-2xl font-black">124,902</p>
                            </div>
                            <span className="material-symbols-outlined text-4xl opacity-20 absolute -right-2 -bottom-2 scale-150">analytics</span>
                        </div>
                    </div>
                    <div className="flex-1 bg-surface-container-lowest rounded-2xl flex flex-col overflow-hidden border border-outline-variant/10 shadow-sm">
                        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-lowest">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-on-surface-variant">description</span>
                                <span className="text-sm font-bold text-on-surface">Document: <span className="mono font-normal text-secondary ml-1 select-all">507f1f77bcf86cd799439011</span></span>
                            </div>
                            <div className="flex p-1 bg-surface-container-low rounded-xl">
                                <button className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold transition-all rounded-lg bg-white text-primary shadow-sm">
                                    <span className="material-symbols-outlined text-sm">account_tree</span>
                                    Tree View
                                </button>
                                <button className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium transition-all rounded-lg text-on-surface-variant hover:text-on-surface">
                                    <span className="material-symbols-outlined text-sm">code</span>
                                    Code View
                                </button>
                                <button className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium transition-all rounded-lg text-on-surface-variant hover:text-on-surface">
                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                    Document View
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-8">
                            <div className="w-full px-6 md:px-12 mx-auto space-y-4">
                                <div className="flex items-start gap-3 group">
                                    <button className="mt-1 text-outline transition-transform group-hover:text-on-surface">
                                        <span className="material-symbols-outlined text-lg">arrow_drop_down</span>
                                    </button>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="mono text-sm font-medium text-on-surface">metadata</span>
                                            <span className="text-[10px] text-outline px-1.5 py-0.5 bg-surface-container rounded font-bold">OBJECT</span>
                                            <span className="text-xs text-outline italic"></span>
                                        </div>
                                        <div className="mt-3 ml-6 pl-4 border-l-2 border-outline-variant/20 space-y-3">
                                            <div className="flex items-center justify-between group/row">
                                                <div className="flex items-center gap-4">
                                                    <span className="mono text-sm text-on-surface-variant">created_at</span>
                                                    <span className="mono text-sm text-primary font-medium select-all">"2023-11-24T14:22:01.000Z"</span>
                                                    <span className="hidden group-hover/row:inline-block text-[10px] text-primary/60 font-bold px-1.5 bg-primary/5 rounded">STRING</span>
                                                </div>
                                                <CopyButton textToCopy="2023-11-24T14:22:01.000Z" className="opacity-0 group-hover/row:opacity-100 transition-opacity material-symbols-outlined text-outline hover:text-primary" />
                                            </div>
                                            <div className="flex items-center justify-between group/row">
                                                <div className="flex items-center gap-4">
                                                    <span className="mono text-sm text-on-surface-variant">version</span>
                                                    <span className="mono text-sm text-secondary font-medium select-all">2.4</span>
                                                    <span className="hidden group-hover/row:inline-block text-[10px] text-secondary/60 font-bold px-1.5 bg-secondary/5 rounded">NUMBER</span>
                                                </div>
                                                <CopyButton textToCopy="2.4" className="opacity-0 group-hover/row:opacity-100 transition-opacity material-symbols-outlined text-outline hover:text-primary" />
                                            </div>
                                            <div className="flex items-center justify-between group/row">
                                                <div className="flex items-center gap-4">
                                                    <span className="mono text-sm text-on-surface-variant">is_verified</span>
                                                    <span className="mono text-sm text-tertiary font-medium select-all">true</span>
                                                    <span className="hidden group-hover/row:inline-block text-[10px] text-tertiary/60 font-bold px-1.5 bg-tertiary/5 rounded">BOOLEAN</span>
                                                </div>
                                                <CopyButton textToCopy="true" className="opacity-0 group-hover/row:opacity-100 transition-opacity material-symbols-outlined text-outline hover:text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 group">
                                    <button className="mt-1 text-outline transition-transform rotate-[-90deg] group-hover:text-on-surface">
                                        <span className="material-symbols-outlined text-lg">arrow_drop_down</span>
                                    </button>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="mono text-sm font-medium text-on-surface">activity_log</span>
                                            <span className="text-[10px] text-outline px-1.5 py-0.5 bg-surface-container rounded font-bold uppercase">Array</span>
                                            <span className="text-xs text-outline italic">[ 142 items ]</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 group">
                                    <button className="mt-1 text-outline transition-transform group-hover:text-on-surface">
                                        <span className="material-symbols-outlined text-lg">arrow_drop_down</span>
                                    </button>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="mono text-sm font-medium text-on-surface">user_profile</span>
                                            <span className="text-[10px] text-outline px-1.5 py-0.5 bg-surface-container rounded font-bold uppercase">Object</span>
                                        </div>
                                        <div className="mt-3 ml-6 pl-4 border-l-2 border-outline-variant/20 space-y-3">
                                            <div className="flex items-center justify-between group/row">
                                                <div className="flex items-center gap-4">
                                                    <span className="mono text-sm text-on-surface-variant">display_name</span>
                                                    <span className="mono text-sm text-primary font-medium select-all">"Marcus Aurelius"</span>
                                                </div>
                                                <CopyButton textToCopy="Marcus Aurelius" className="opacity-0 group-hover/row:opacity-100 transition-opacity material-symbols-outlined text-outline hover:text-primary" />
                                            </div>
                                            <div className="flex items-center justify-between group/row">
                                                <div className="flex items-center gap-4">
                                                    <span className="mono text-sm text-on-surface-variant">tier</span>
                                                    <span className="mono text-sm text-primary font-medium select-all">"Enterprise Platinum"</span>
                                                </div>
                                                <CopyButton textToCopy="Enterprise Platinum" className="opacity-0 group-hover/row:opacity-100 transition-opacity material-symbols-outlined text-outline hover:text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between group/row pl-[30px]">
                                    <div className="flex items-center gap-4">
                                        <span className="mono text-sm text-on-surface-variant">tags</span>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-0.5 bg-surface-container text-primary text-[10px] font-bold rounded">priority</span>
                                            <span className="px-2 py-0.5 bg-surface-container text-primary text-[10px] font-bold rounded">api_access</span>
                                            <span className="px-2 py-0.5 bg-surface-container text-primary text-[10px] font-bold rounded">node_v14</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-3 border-t border-outline-variant/10 bg-surface-container-low flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Storage Engine: WiredTiger</span>
                                </div>
                                <div className="h-4 w-[1px] bg-outline-variant/30"></div>
                                <span className="text-[10px] font-medium text-on-surface-variant">Query Execution Time: <span className="text-primary font-bold">14ms</span></span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="p-1 hover:bg-surface-container rounded transition-colors text-outline">
                                    <span className="material-symbols-outlined text-sm">first_page</span>
                                </button>
                                <button className="p-1 hover:bg-surface-container rounded transition-colors text-outline">
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>
                                <span className="text-[10px] font-bold px-3 text-on-surface-variant">Page 1 of 429</span>
                                <button className="p-1 hover:bg-surface-container rounded transition-colors text-on-surface">
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                                <button className="p-1 hover:bg-surface-container rounded transition-colors text-on-surface">
                                    <span className="material-symbols-outlined text-sm">last_page</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <button className="fixed right-8 bottom-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group z-50">
                <span className="material-symbols-outlined text-2xl" >bolt</span>
                <div className="absolute right-full mr-4 px-3 py-1.5 bg-inverse-surface text-inverse-on-surface text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Run Aggregation
                </div>
            </button>
        </div>
    )
}

export default DocumentPreview
