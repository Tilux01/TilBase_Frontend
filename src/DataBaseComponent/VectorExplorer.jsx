import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { objContext } from '../App';

const VectorExplorer = ({ cluster }) => {
    const { serverRoute } = useContext(objContext);

    
    const [namespaces, setNamespaces] = useState([]);
    const [activeNamespace, setActiveNamespace] = useState('');
    const [vectors, setVectors] = useState([]);
    const [activeVector, setActiveVector] = useState(null);
    
    // UI States
    const [viewMode, setViewMode] = useState('sandbox'); 
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    
    const [editVectorDense, setEditVectorDense] = useState('');
    const [editVectorSparse, setEditVectorSparse] = useState('');
    const [editVectorMeta, setEditVectorMeta] = useState('');
    const [editVectorId, setEditVectorId] = useState('');
    
    // Sandbox States
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('hybrid');
    const [searchMetric, setSearchMetric] = useState('cosine');
    const [searchFilter, setSearchFilter] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    // API Calls
    const fetchNamespaces = async () => {
        try {
            const res = await axios.post(`${serverRoute}/api/vectorExplorer/getNamespaces`, { clusterId: cluster.id });
            if (res.data.success) {
                setNamespaces(res.data.namespaces.map(n => n.namespace));
                if (res.data.namespaces.length > 0 && !activeNamespace) {
                    setActiveNamespace(res.data.namespaces[0].namespace);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchVectors = async (namespace) => {
        if (!namespace) return;
        try {
            const res = await axios.post(`${serverRoute}/api/vectorExplorer/getVectors`, { clusterId: cluster.id, namespace });
            if (res.data.success) {
                setVectors(res.data.vectors);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Effects
    useEffect(() => {
        fetchNamespaces();
    }, [cluster.id]);

    useEffect(() => {
        if (activeNamespace) fetchVectors(activeNamespace);
    }, [activeNamespace]);

    // Handlers
    const loadEditor = (vec) => {
        setActiveVector(vec);
        setEditVectorId(vec.id);
        setEditVectorDense(JSON.stringify(vec.vector));
        setEditVectorSparse(vec.sparse || '');
        setEditVectorMeta(JSON.stringify(vec.metadata || {}, null, 2));
        setViewMode('editor');
    };

    const handleSaveVector = async (isNew = false) => {
        let denseArray = [];
        let metaObj = {};
        try {
            denseArray = editVectorDense ? JSON.parse(editVectorDense) : [];
            if (!Array.isArray(denseArray)) throw new Error("Dense vector must be an array");
            metaObj = editVectorMeta ? JSON.parse(editVectorMeta) : {};
        } catch (e) {
            alert("Invalid JSON in array or metadata");
            return;
        }

        if (!activeNamespace && isNew) {
            alert("Please provide or select a namespace");
            return;
        }

        setIsSaving(true);
        try {
            const res = await axios.post(`${serverRoute}/api/vectorExplorer/upsertVector`, {
                clusterId: cluster.id,
                namespace: activeNamespace,
                vectorId: editVectorId,
                vector: denseArray,
                sparse: editVectorSparse,
                metadata: metaObj
            });
            if (res.data.success) {
                setIsAddModalOpen(false);
                fetchNamespaces();
                fetchVectors(activeNamespace);
                if (!isNew && activeVector) {
                    setActiveVector({ ...activeVector, vector: denseArray, sparse: editVectorSparse, metadata: metaObj });
                }
            }
        } catch (error) {
            console.error(error);
            alert("Failed to save vector");
        }
        setIsSaving(false);
    };

    const handleDeleteVector = async (vectorId) => {
        if (!window.confirm(`Delete vector ${vectorId}?`)) return;
        try {
            await axios.post(`${serverRoute}/api/vectorExplorer/deleteVector`, {
                clusterId: cluster.id,
                namespace: activeNamespace,
                vectorId
            });
            if (activeVector?.id === vectorId) {
                setActiveVector(null);
                setViewMode('sandbox');
            }
            fetchVectors(activeNamespace);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        
        let queryVector = [];
        let queryText = searchQuery;
        
        
        if (searchType !== 'sparse' && searchQuery.trim().startsWith('[')) {
            try {
                queryVector = JSON.parse(searchQuery);
            } catch (e) {
                alert("Invalid vector array syntax for query");
                return;
            }
        }

        let parsedFilter = null;
        if (searchFilter) {
            try {
                parsedFilter = JSON.parse(searchFilter);
            } catch (e) {
                alert("Invalid JSON in Pre-Filter");
                return;
            }
        }

        setIsSearching(true);
        setSearchResults([]);
        try {
            const res = await axios.post(`${serverRoute}/api/vectorExplorer/semanticSearch`, {
                clusterId: cluster.id,
                namespace: activeNamespace,
                queryVector,
                queryText,
                searchType,
                metric: searchMetric,
                filter: parsedFilter
            });
            if (res.data.success) {
                setSearchResults(res.data.results);
            }
        } catch (error) {
            console.error(error);
            alert("Search failed");
        }
        setIsSearching(false);
    };

    return (
        <div className="w-full flex flex-col h-[calc(100vh-64px)] bg-background font-sans overflow-hidden">
            {}
            <header className="px-6 py-3 border-b border-black/5 dark:border-white/5 bg-surface flex justify-between items-center shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <Link to="/clusters" className="text-on-surface-variant hover:text-on-surface transition-colors p-1.5 rounded-md hover:bg-surface-container border border-black/5 dark:border-white/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </Link>
                    <div className="flex items-center text-sm">
                        <span className="material-symbols-outlined text-primary text-[20px] mr-2">dns</span>
                        <span className="text-on-surface font-bold">{cluster?.Cluster_Name}</span>
                        <span className="material-symbols-outlined text-outline-variant text-sm mx-2">chevron_right</span>
                        <span className="text-on-surface-variant font-medium px-2 py-1">{activeNamespace || 'Select Namespace'}</span>
                        {activeVector && (
                            <>
                                <span className="material-symbols-outlined text-outline-variant text-sm mx-2">chevron_right</span>
                                <span className="text-on-surface font-bold bg-surface-container border border-black/5 dark:border-white/5 px-2 py-1 rounded border border-black/5 dark:border-white/5">{activeVector.id}</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <span className="bg-surface-container-highest text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary flex items-center gap-1.5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Vector Engine Live
                    </span>
                </div>
            </header>

            {}
            <div className="flex-1 flex overflow-hidden">
                
                {}
                <div className="w-72 flex-none bg-surface-container border-r border-black/5 dark:border-white/5 flex flex-col z-0">
                    <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">folder_data</span>
                            Namespaces
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {namespaces.map(ns => (
                            <button
                                key={ns}
                                onClick={() => { setActiveNamespace(ns); setActiveVector(null); setViewMode('sandbox'); }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                    activeNamespace === ns
                                        ? 'bg-surface-container-highest text-primary border border-primary shadow-inner'
                                        : 'text-on-surface-variant hover:bg-surface-container border border-black/5 dark:border-white/5 hover:text-on-surface border border-transparent'
                                }`}
                            >
                                {ns}
                                <span className="material-symbols-outlined text-[14px] opacity-50">chevron_right</span>
                            </button>
                        ))}
                        {namespaces.length === 0 && (
                            <div className="p-4 text-center text-xs text-on-surface-variant/60 font-medium italic">
                                No namespaces found. Add a vector to create one.
                            </div>
                        )}
                    </div>
                </div>

                {}
                <div className="w-80 flex-none bg-surface-container border-r border-black/5 dark:border-white/5 flex flex-col z-0 shadow-[inset_4px_0_12px_rgba(0,0,0,0.01)]">
                    <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-surface-container">
                        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">data_array</span>
                            Vectors
                        </h2>
                        <div className="flex gap-1">
                            <button 
                                onClick={() => {
                                    setEditVectorId(`vec_${Math.random().toString(36).substring(2, 7)}`);
                                    setEditVectorDense('[]');
                                    setEditVectorSparse('');
                                    setEditVectorMeta('{\n\n}');
                                    setIsAddModalOpen(true);
                                }}
                                className="text-primary hover:bg-surface-container-highest p-1.5 rounded-md transition-colors" title="Add Vector"
                            >
                                <span className="material-symbols-outlined text-[16px]">add</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {vectors.map(vec => (
                            <div key={vec.id} className="relative group">
                                <button
                                    onClick={() => loadEditor(vec)}
                                    className={`w-full flex flex-col items-start px-4 py-3 rounded-xl transition-all border ${
                                        activeVector?.id === vec.id
                                            ? 'bg-surface-container-highest border-black/5 dark:border-white/5 shadow-md shadow-black/5 scale-[1.02] my-1 z-10 relative'
                                            : 'bg-transparent border-transparent text-on-surface-variant hover:bg-surface-container hover:border-black/5 dark:border-white/5'
                                    }`}
                                >
                                    <span className={`text-[13px] font-mono font-bold truncate w-[85%] text-left ${activeVector?.id === vec.id ? 'text-secondary' : 'text-on-surface'}`}>
                                        {vec.id}
                                    </span>
                                    <span className="text-[10px] text-on-surface-variant/70 font-sans mt-1.5 line-clamp-1 w-full text-left">
                                        {vec.sparse || <span className="italic opacity-50">No sparse text</span>}
                                    </span>
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteVector(vec.id); }}
                                    className="absolute top-3 right-3 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-surface/80 p-1 rounded backdrop-blur"
                                >
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PANE 3: Sandbox / Editor */}
                <div className="flex-1 flex flex-col bg-surface-container relative z-0">
                    
                    {/* Pane 3 Header */}
                    <div className="p-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-surface">
                        <div className="flex items-center bg-surface-container border border-black/5 dark:border-white/5 rounded p-0.5 border border-black/5 dark:border-white/5">
                            <button 
                                onClick={() => setViewMode('sandbox')}
                                className={`px-4 py-1.5 rounded text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${viewMode === 'sandbox' ? 'bg-primary shadow-sm text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
                            >
                                <span className="material-symbols-outlined text-[14px]">science</span>
                                Semantic Sandbox
                            </button>
                            <button 
                                onClick={() => { if(activeVector) setViewMode('editor') }}
                                disabled={!activeVector}
                                className={`px-4 py-1.5 rounded text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${viewMode === 'editor' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface disabled:opacity-30'}`}
                            >
                                <span className="material-symbols-outlined text-[14px]">edit_document</span>
                                Vector Editor
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        {viewMode === 'sandbox' ? (
                            <div className="absolute inset-0 flex flex-col bg-[#0A0F0D]">
                                {/* Sandbox Decorative UI */}
                                <div className="absolute top-0 right-0 w-96 h-96 bg-surface-container-highest rounded-full blur-[100px] pointer-events-none opacity-50"></div>
                                <div className="absolute bottom-0 left-0 w-96 h-96 bg-surface-container-highest rounded-full blur-[100px] pointer-events-none opacity-50"></div>

                                {/* Sandbox Search Input */}
                                <div className="p-8 border-b border-black/5 dark:border-white/5 relative z-10 shrink-0">
                                    <div className="max-w-3xl mx-auto">
                                        <div className="flex justify-between mb-4">
                                            <div className="flex gap-2">
                                                {['hybrid', 'dense', 'sparse'].map(type => (
                                                    <button key={type} onClick={() => setSearchType(type)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${searchType === type ? 'bg-surface-container-highest border-primary text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'border-white/10 text-white/50 hover:bg-surface-container-highest/5'}`}>
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                            {(searchType === 'dense' || searchType === 'hybrid') && (
                                                <select value={searchMetric} onChange={e => setSearchMetric(e.target.value)} className="bg-surface-container-highest/5 border border-white/10 text-white text-xs font-bold rounded-lg px-3 py-1 outline-none">
                                                    <option value="cosine">Cosine</option>
                                                    <option value="euclidean">Euclidean</option>
                                                    <option value="dotProduct">Dot Product</option>
                                                </select>
                                            )}
                                        </div>
                                        <div className="relative group mb-3">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                                            <div className="relative flex items-center bg-surface rounded-lg border border-white/10 shadow-2xl p-1.5 pl-5">
                                                <span className="material-symbols-outlined text-primary mr-3">search_spark</span>
                                                <input 
                                                    type="text" 
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                                    placeholder={searchType === 'sparse' ? "Type full-text semantic query..." : "Paste dense array [0.12, 0.44...] or type text (hybrid)"}
                                                    className="w-full bg-transparent text-white placeholder:text-white/30 outline-none font-medium h-12 text-base"
                                                />
                                                <button onClick={handleSearch} disabled={isSearching || !activeNamespace} className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-md font-bold shadow-lg transition-all ml-3 disabled:opacity-50 flex items-center gap-2">
                                                    {isSearching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Search'}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Metadata Pre-Filter:</span>
                                            <input 
                                                type="text"
                                                placeholder='{"price": {"$lt": 200}}'
                                                value={searchFilter}
                                                onChange={e => setSearchFilter(e.target.value)}
                                                className="bg-surface-container-highest/5 border border-white/10 text-white text-xs font-mono rounded px-3 py-1.5 outline-none flex-1 focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {}
                                <div className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
                                    <div className="max-w-3xl mx-auto">
                                        {searchResults.length > 0 ? (
                                            <div className="space-y-4">
                                                <h3 className="text-white/60 font-medium text-sm mb-4">Top matches in <span className="text-white font-bold">{activeNamespace}</span></h3>
                                                {searchResults.map((res, i) => (
                                                    <div key={i} onClick={() => loadEditor({id: res.id, ...res})} className="bg-surface-container-highest/5 border border-white/10 rounded-xl p-4 flex gap-5 hover:bg-surface-container-highest/10 hover:border-primary transition-all cursor-pointer group">
                                                        <div className="w-16 h-16 shrink-0 relative flex items-center justify-center">
                                                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                                                <circle cx="32" cy="32" r="28" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                                                                <circle cx="32" cy="32" r="28" fill="transparent" stroke={res.score > 0.9 ? '#10B981' : '#6366F1'} strokeWidth="4" strokeDasharray={175} strokeDashoffset={175 - (175 * res.score)} className="transition-all duration-1000" />
                                                            </svg>
                                                            <div className="text-center">
                                                                <span className="block text-white font-bold text-sm">{(res.score*100).toFixed(0)}%</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between">
                                                                <div className="text-primary font-mono text-xs font-bold mb-1">{res.id}</div>
                                                            </div>
                                                            <p className="text-white/90 text-sm font-medium">{res.sparse}</p>
                                                            <div className="text-white/40 text-[10px] font-mono mt-2 line-clamp-1">{JSON.stringify(res.metadata)}</div>
                                                        </div>
                                                        <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="material-symbols-outlined text-white/40 hover:text-white">edit</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : !isSearching && (
                                            <div className="flex flex-col items-center justify-center h-64 text-center opacity-50">
                                                <span className="material-symbols-outlined text-6xl text-white/20 mb-4">analytics</span>
                                                <p className="text-white font-medium">Execute a query to see semantic matches.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col p-6 overflow-y-auto custom-scrollbar bg-background">
                                {activeVector ? (
                                    <div className="max-w-3xl mx-auto w-full space-y-6 pb-20">
                                        {}
                                        <div className="bg-surface border border-black/5 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
                                            <div className="px-5 py-3 border-b border-black/5 dark:border-white/5 bg-surface-container flex justify-between items-center">
                                                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[16px] text-primary">data_array</span>
                                                    Dense Embeddings
                                                </h3>
                                            </div>
                                            <div className="p-0">
                                                <textarea 
                                                    className="w-full bg-surface-container-highest-highest border-0 font-mono text-xs text-on-surface p-4 outline-none resize-none h-24 custom-scrollbar"
                                                    value={editVectorDense}
                                                    onChange={e => setEditVectorDense(e.target.value)}
                                                    placeholder="[0.1, -0.2, 0.44...]"
                                                ></textarea>
                                            </div>
                                        </div>

                                        {}
                                        <div className="bg-surface border border-black/5 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
                                            <div className="px-5 py-3 border-b border-black/5 dark:border-white/5 bg-surface-container">
                                                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[16px] text-secondary">notes</span>
                                                    Sparse Text (Searchable)
                                                </h3>
                                            </div>
                                            <div className="p-0">
                                                <textarea 
                                                    className="w-full bg-surface-container-highest-highest border-0 text-sm text-on-surface p-4 outline-none resize-none min-h-[80px]"
                                                    value={editVectorSparse}
                                                    onChange={e => setEditVectorSparse(e.target.value)}
                                                    placeholder="Text payload for hybrid search..."
                                                ></textarea>
                                            </div>
                                        </div>

                                        {}
                                        <div className="bg-surface border border-black/5 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
                                            <div className="px-5 py-3 border-b border-black/5 dark:border-white/5 bg-surface-container">
                                                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[16px] text-error">data_object</span>
                                                    Metadata (JSON)
                                                </h3>
                                            </div>
                                            <div className="p-0">
                                                <textarea 
                                                    className="w-full bg-[#1E1E1E] text-[#D4D4D4] font-mono text-sm p-5 outline-none h-48 custom-scrollbar border-0"
                                                    value={editVectorMeta}
                                                    onChange={e => setEditVectorMeta(e.target.value)}
                                                    placeholder="{\n}"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button onClick={() => handleSaveVector(false)} disabled={isSaving} className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50">
                                                <span className="material-symbols-outlined text-[18px]">save</span>
                                                {isSaving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-on-surface-variant opacity-60">
                                        <span className="material-symbols-outlined text-4xl mb-2">touch_app</span>
                                        <p>Select a vector to edit its details</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-surface w-full max-w-xl rounded-2xl shadow-2xl border border-black/5 dark:border-white/5 flex flex-col overflow-hidden animate-fade-in">
                        <div className="p-5 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-surface-container">
                            <h2 className="text-lg font-bold text-on-surface">Inject Vector Data</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-on-surface-variant hover:text-error transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
                            <div>
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Namespace</label>
                                <input type="text" value={activeNamespace} onChange={e => setActiveNamespace(e.target.value)} className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 text-on-surface rounded-lg p-2.5 outline-none focus:border-primary" placeholder="e.g. products" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Vector ID</label>
                                <input type="text" value={editVectorId} onChange={e => setEditVectorId(e.target.value)} className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 text-on-surface rounded-lg p-2.5 outline-none focus:border-primary" placeholder="e.g. vec_123" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Dense Array [JSON]</label>
                                <textarea value={editVectorDense} onChange={e => setEditVectorDense(e.target.value)} className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 text-on-surface font-mono text-sm rounded-lg p-2.5 outline-none focus:border-primary h-20" placeholder="[0.1, 0.4...]"></textarea>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Sparse Text</label>
                                <textarea value={editVectorSparse} onChange={e => setEditVectorSparse(e.target.value)} className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 text-on-surface text-sm rounded-lg p-2.5 outline-none focus:border-primary h-20" placeholder="Text for hybrid search"></textarea>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Metadata [JSON]</label>
                                <textarea value={editVectorMeta} onChange={e => setEditVectorMeta(e.target.value)} className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 text-on-surface font-mono text-sm rounded-lg p-2.5 outline-none focus:border-primary h-24" placeholder='{"key": "value"}'></textarea>
                            </div>
                        </div>
                        <div className="p-5 border-t border-black/5 dark:border-white/5 bg-surface-container flex justify-end gap-3">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container border border-black/5 dark:border-white/5 transition-colors">Cancel</button>
                            <button onClick={() => handleSaveVector(true)} disabled={isSaving} className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
                                {isSaving ? 'Injecting...' : 'Inject Vector'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VectorExplorer;
