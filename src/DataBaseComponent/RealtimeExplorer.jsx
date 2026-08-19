import { useGlobalModal } from "../Context/GlobalModalContext";
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { objContext } from '../App';
import FieldEditor from './FieldEditor';
import { io } from 'socket.io-client';

const RealtimeExplorer = ({ cluster }) => {
    const { showModal } = useGlobalModal();
    const { serverRoute, userCred } = useContext(objContext);
    
    const [breadcrumbs, setBreadcrumbs] = useState([]); 
    const [collections, setCollections] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [subCollections, setSubCollections] = useState([]);
    
    const [selectedCollection, setSelectedCollection] = useState(''); // E.g. 'users'
    const [selectedDocument, setSelectedDocument] = useState(null); 
    const [documentData, setDocumentData] = useState({});
    const [viewMode, setViewMode] = useState('visual'); 
    const [jsonContent, setJsonContent] = useState('{\n  \n}');
    
    const [isSaving, setIsSaving] = useState(false);
    
    // Live Terminal State
    const [logs, setLogs] = useState([]);
    const logsEndRef = useRef(null);

    const addLog = (message, type = 'info') => {
        const time = new Date().toLocaleTimeString();
        setLogs(prev => [{ time, message, type }, ...prev].slice(0, 50));
    };

    // Auto-scroll terminal
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    // Compute absolute paths
    const currentRootPath = breadcrumbs.join('/'); 
    const activeCollectionPath = selectedCollection ? (currentRootPath ? `${currentRootPath}/${selectedCollection}` : selectedCollection) : '';

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${userCred?.token}` }
    });

    const fetchCollections = async (rootPath = '') => {
        try {
            const res = await axios.post(`${serverRoute}/api/realtimeExplorer/getCollections`, {
                clusterId: cluster.id,
                rootPath
            }, getAuthHeaders());
            if (res.data.success) {
                if (rootPath.split('/').length % 2 === 0 && rootPath !== '') {
                    setSubCollections(res.data.collections);
                } else {
                    setCollections(res.data.collections);
                    setSubCollections([]);
                }
            }
        } catch (error) {
            console.error("Error fetching paths", error);
        }
    };

    const fetchDocuments = async (parentPath) => {
        if (!parentPath) return;
        try {
            const res = await axios.post(`${serverRoute}/api/realtimeExplorer/getDocuments`, {
                clusterId: cluster.id,
                parentPath
            }, getAuthHeaders());
            if (res.data.success) {
                setDocuments(res.data.documents);
            }
        } catch (error) {
            console.error("Error fetching nodes", error);
        }
    };

    const fetchDocumentData = async (path) => {
        try {
            const res = await axios.post(`${serverRoute}/api/realtimeExplorer/getDocumentData`, {
                clusterId: cluster.id,
                path
            }, getAuthHeaders());
            if (res.data.success) {
                setDocumentData(res.data.data || {});
                setJsonContent(JSON.stringify(res.data.data || {}, null, 2));
            } else {
                setDocumentData({});
                setJsonContent('{\n  \n}');
            }
        } catch (error) {
            console.error("Error fetching node data", error);
            setDocumentData({});
            setJsonContent('{\n  \n}');
        }
    };

    // Initial load
    useEffect(() => {
        fetchCollections(currentRootPath);
    }, [currentRootPath]);

    useEffect(() => {
        if (activeCollectionPath) {
            fetchDocuments(activeCollectionPath);
            setSelectedDocument(null);
            setDocumentData({});
            setJsonContent('{\n  \n}');
            setSubCollections([]);
        }
    }, [activeCollectionPath]);

    useEffect(() => {
        if (selectedDocument) {
            fetchDocumentData(selectedDocument.fullPath);
            fetchCollections(selectedDocument.fullPath);
        }
    }, [selectedDocument]);

    // Real-Time UI Updates & Terminal Logging
    useEffect(() => {
        if (!cluster?.id) return;
        const urlObj = new URL(serverRoute);
        const socketUrl = `${urlObj.protocol}//${urlObj.host}`;
        const socket = io(socketUrl);
        
        socket.on("connect", () => {
            addLog('WebSocket Connected: Listening for Realtime SDK changes...', 'success');
            socket.emit("join_cluster", cluster.id);
        });

        const refreshData = () => {
            fetchCollections(currentRootPath);
            if (activeCollectionPath) fetchDocuments(activeCollectionPath);
            if (selectedDocument) {
                fetchDocumentData(selectedDocument.fullPath);
                fetchCollections(selectedDocument.fullPath);
            }
        };

        socket.on("document_update", (data) => {
            const action = data.eventType === 'delete' ? 'Deleted' : 'Updated';
            const type = data.eventType === 'delete' ? 'error' : 'warning';
            addLog(`[Node] ${action} at /${data.path}`, type);
            refreshData();
        });

        socket.on("collection_update", (data) => {
            addLog(`[Path] Change detected at /${data.collection}`, 'info');
            refreshData();
        });

        socket.on("disconnect", () => {
            addLog('WebSocket Disconnected', 'error');
        });

        return () => socket.disconnect();
    }, [cluster, serverRoute, currentRootPath, activeCollectionPath, selectedDocument]);

    const handleCollectionClick = (colName) => {
        setSelectedCollection(colName);
    };

    const handleDocumentClick = (doc) => {
        setSelectedDocument(doc);
    };

    const handleSubCollectionClick = (subName) => {
        setBreadcrumbs([...breadcrumbs, selectedCollection, selectedDocument.docId]);
        setSelectedCollection(subName);
        setSelectedDocument(null);
    };

    const handleBreadcrumbClick = (index) => {
        if (index === -1) {
            setBreadcrumbs([]);
            setSelectedCollection('');
            setSelectedDocument(null);
        } else {
            const newBreadcrumbs = breadcrumbs.slice(0, index);
            setBreadcrumbs(newBreadcrumbs);
            setSelectedCollection(breadcrumbs[index]);
            setSelectedDocument(null);
        }
    };

    const handleSaveDocument = async () => {
        if (!selectedDocument && !activeCollectionPath) return await showModal({ type: "alert", message: "Select a path to add a node" });
        
        let payload = documentData;
        if (viewMode === 'json') {
            try {
                const parsed = new Function("return " + jsonContent)();
                if (typeof parsed !== 'object' || parsed === null) throw new Error();
                payload = parsed;
                setDocumentData(payload); 
            } catch (e) {
                return await showModal({ type: "alert", message: "Invalid data format. Ensure it is a valid object." });
            }
        }

        setIsSaving(true);
        let docPath = '';
        if (selectedDocument) {
            docPath = selectedDocument.fullPath;
        } else {
            const randomId = Math.random().toString(36).substring(2, 10);
            docPath = `${activeCollectionPath}/${randomId}`;
        }

        try {
            const res = await axios.post(`${serverRoute}/api/realtimeExplorer/setDocumentData`, {
                clusterId: cluster.id,
                path: docPath,
                documentData: payload
            }, getAuthHeaders());
            
            if (res.data.success) {
                addLog(`You synced node at /${docPath}`, 'success');
                fetchDocuments(activeCollectionPath);
                if (!selectedDocument) {
                    setSelectedDocument({ fullPath: docPath, docId: docPath.split('/').pop() });
                }
            }
        } catch (error) {
            console.error(error);
            await showModal({ type: "alert", message: "Error syncing node" });
            addLog(`Failed to sync node at /${docPath}`, 'error');
        }
        setIsSaving(false);
    };

    const handleDeleteDocument = async () => {
        if (!selectedDocument) return;
        const confirmDel = await showModal({ type: "confirm", message: `Delete node ${selectedDocument.docId} and ALL its nested paths?`, isDestructive: true });
        if (!confirmDel) return;

        try {
            const res = await axios.post(`${serverRoute}/api/realtimeExplorer/deleteDocument`, {
                clusterId: cluster.id,
                path: selectedDocument.fullPath
            }, getAuthHeaders());
            if (res.data.success) {
                addLog(`You deleted node at /${selectedDocument.fullPath}`, 'success');
                setSelectedDocument(null);
                setDocumentData({});
                setJsonContent('{\n  \n}');
                fetchDocuments(activeCollectionPath);
            }
        } catch (error) {
            console.error(error);
            await showModal({ type: "alert", message: "Error deleting node" });
        }
    };

    const handleAddCollection = async () => {
        const name = await showModal({ type: "prompt", message: "Enter new path/container name:" });
        if (name && name.trim() !== '') {
            if (currentRootPath === '') {
                setCollections([...collections, name.trim()]);
            } else {
                setSubCollections([...subCollections, name.trim()]);
            }
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-background text-on-surface font-sans overflow-hidden">
            
            {/* Top Navigation & Breadcrumbs */}
            <header className="flex-none bg-surface-container border-b border-black/5 dark:border-white/5 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link to="/clusters" className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container border border-black/5 dark:border-white/5 hover:bg-surface-container-high text-on-surface-variant transition-colors border border-black/5 dark:border-white/5">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                    </Link>
                    <div className="h-5 w-px bg-outline-variant/30"></div>
                    <div className="flex items-center gap-2 text-sm overflow-x-auto whitespace-nowrap hide-scrollbar max-w-2xl">
                        <span className="material-symbols-outlined text-green-500 text-lg animate-pulse">wifi_tethering</span>
                        <span className="font-bold text-on-surface cursor-pointer hover:text-green-500 transition-colors" onClick={() => handleBreadcrumbClick(-1)}>
                            {cluster?.Cluster_Name || 'Root'} (Realtime DB)
                        </span>
                        
                        {breadcrumbs.map((crumb, idx) => (
                            <React.Fragment key={idx}>
                                <span className="material-symbols-outlined text-outline-variant text-sm mx-1">chevron_right</span>
                                <span 
                                    className={`cursor-pointer hover:text-green-500 transition-colors px-2 py-1 rounded hover:bg-surface-container-highest ${idx % 2 === 0 ? 'text-on-surface-variant font-medium' : 'text-on-surface font-bold bg-surface-container border border-black/5 dark:border-white/5'}`}
                                    onClick={() => handleBreadcrumbClick(idx)}
                                >
                                    {crumb}
                                </span>
                            </React.Fragment>
                        ))}
                        
                        {selectedCollection && (
                            <>
                                <span className="material-symbols-outlined text-outline-variant text-sm mx-1">chevron_right</span>
                                <span className="text-on-surface-variant font-medium px-2 py-1">{selectedCollection}</span>
                            </>
                        )}
                        {selectedDocument && (
                            <>
                                <span className="material-symbols-outlined text-outline-variant text-sm mx-1">chevron_right</span>
                                <span className="text-on-surface font-bold bg-surface-container border border-black/5 dark:border-white/5 px-2 py-1 rounded border border-black/5 dark:border-white/5">{selectedDocument.docId}</span>
                            </>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                    <button onClick={handleSaveDocument} disabled={isSaving || !activeCollectionPath} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-bold shadow-sm shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none">
                        <span className="material-symbols-outlined text-sm">save</span>
                        {isSaving ? 'Syncing...' : 'Sync Data'}
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                
                {/* Column 1: Collections/Paths */}
                <div className="w-72 flex-none bg-surface-container border-r border-black/5 dark:border-white/5 flex flex-col z-0">
                    <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">folder_open</span>
                            Data Paths
                        </h2>
                        <button onClick={handleAddCollection} className="text-green-500 hover:bg-surface-container-highest p-1.5 rounded-md transition-colors" title="Add Path">
                            <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {collections.map(col => (
                            <button
                                key={col}
                                onClick={() => handleCollectionClick(col)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                    selectedCollection === col
                                        ? 'bg-surface-container-highest text-green-500 border border-green-500/30'
                                        : 'text-on-surface-variant hover:bg-surface-container border border-black/5 dark:border-white/5 hover:text-on-surface border border-transparent'
                                }`}
                            >
                                {col}
                                <span className="material-symbols-outlined text-[14px] opacity-50">chevron_right</span>
                            </button>
                        ))}
                        {collections.length === 0 && (
                            <div className="p-4 text-center text-xs text-on-surface-variant/60 font-medium italic">
                                No paths found.<br/>Click + to start one.
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 2: Documents/Keys */}
                <div className="w-80 flex-none bg-surface-container border-r border-black/5 dark:border-white/5 flex flex-col z-0 shadow-[inset_4px_0_12px_rgba(0,0,0,0.01)]">
                    <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-surface-container">
                        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">description</span>
                            Data Nodes
                        </h2>
                        <div className="flex gap-1">
                            <button onClick={() => { setSelectedDocument(null); setDocumentData({}); setJsonContent('{\n  \n}'); }} className="text-green-500 hover:bg-surface-container-highest p-1.5 rounded-md transition-colors" title="Add Node" disabled={!selectedCollection}>
                                <span className="material-symbols-outlined text-[16px]">add</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {documents.map(doc => (
                            <button
                                key={doc.id}
                                onClick={() => handleDocumentClick(doc)}
                                className={`w-full flex flex-col items-start px-4 py-3 rounded-xl transition-all border ${
                                    selectedDocument?.id === doc.id
                                        ? 'bg-surface-container-highest border-black/5 dark:border-white/5 shadow-md shadow-black/5 scale-[1.02] my-1 z-10 relative'
                                        : 'bg-transparent border-transparent text-on-surface-variant hover:bg-surface-container hover:border-black/5 dark:border-white/5'
                                }`}
                            >
                                <span className={`text-[13px] font-mono font-medium truncate w-full text-left ${selectedDocument?.id === doc.id ? 'text-green-500' : ''}`}>
                                    {doc.docId}
                                </span>
                                {selectedDocument?.id === doc.id && (
                                    <span className="text-[10px] text-on-surface-variant/60 font-sans mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px]">schedule</span>
                                        {new Date(doc.created_at).toLocaleTimeString()}
                                    </span>
                                )}
                            </button>
                        ))}
                        {documents.length === 0 && selectedCollection && (
                            <div className="p-4 text-center text-xs text-on-surface-variant/60 font-medium italic">
                                No nodes in this path.<br/>Click + to add data or type JSON and hit Sync.
                            </div>
                        )}
                        {!selectedCollection && (
                            <div className="p-4 text-center text-xs text-on-surface-variant/60 font-medium italic">
                                Select a path to view nodes.
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 3: Editor + Sub-Collections + Live Terminal */}
                <div className="flex-1 flex flex-col bg-surface-container relative z-0">
                    
                    {/* Top half: Editor */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="p-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-surface-container-low">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center bg-surface-container border border-black/5 dark:border-white/5 rounded p-0.5 border border-black/5 dark:border-white/5">
                                    <button 
                                        onClick={() => {
                                            if (viewMode === 'json') {
                                                try { 
                                                    const parsed = new Function("return " + jsonContent)();
                                                    if (typeof parsed === 'object' && parsed !== null) setDocumentData(parsed); 
                                                } catch(e) {}
                                            }
                                            setViewMode('visual');
                                        }}
                                        className={`px-3 py-1 rounded text-[11px] font-black uppercase tracking-widest transition-colors ${viewMode === 'visual' ? 'bg-green-500/10 text-green-500' : 'text-on-surface-variant hover:text-on-surface'}`}
                                    >
                                        Builder
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (viewMode === 'visual') {
                                                setJsonContent(JSON.stringify(documentData, null, 2));
                                            }
                                            setViewMode('json');
                                        }}
                                        className={`px-3 py-1 rounded text-[11px] font-black uppercase tracking-widest transition-colors ${viewMode === 'json' ? 'bg-green-500/10 text-green-500' : 'text-on-surface-variant hover:text-on-surface'}`}
                                    >
                                        JSON
                                    </button>
                                </div>
                                <span className="text-xs font-mono text-on-surface-variant">{selectedDocument ? selectedDocument.docId : 'New Node'}</span>
                            </div>
                            <div className="flex gap-2">
                                {viewMode === 'json' && (
                                    <button onClick={async () => {
                                        try {
                                            const parsed = new Function("return " + jsonContent)();
                                            setJsonContent(JSON.stringify(parsed, null, 2));
                                        } catch(e) { await showModal({ type: "alert", message: "Invalid data format. Fix errors before formatting." })}
                                    }} className="text-xs font-bold px-3 py-1.5 bg-surface-container border border-black/5 dark:border-white/5 hover:bg-surface-container-high rounded text-on-surface-variant transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[14px]">format_align_left</span>
                                        Format
                                    </button>
                                )}
                                <button onClick={handleDeleteDocument} disabled={!selectedDocument} className="text-xs font-bold px-3 py-1.5 bg-surface-container border border-black/5 dark:border-white/5 hover:bg-surface-container-high rounded text-error transition-colors flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none">
                                    <span className="material-symbols-outlined text-[14px]">delete</span>
                                    Delete
                                </button>
                            </div>
                        </div>

                        {viewMode === 'visual' ? (
                            <div className="flex-1 relative bg-surface-container overflow-y-auto">
                                {activeCollectionPath ? (
                                    <FieldEditor 
                                        key={selectedDocument ? selectedDocument.fullPath : activeCollectionPath}
                                        data={documentData} 
                                        onChange={(newData) => setDocumentData(newData)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-on-surface-variant/60 font-medium italic">
                                        Select a path to start editing data nodes.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 relative font-mono text-sm group">
                                <div className="absolute left-0 top-0 bottom-0 w-12 bg-surface-container border-r border-black/5 dark:border-white/5 text-on-surface-variant/40 text-right pr-3 pt-4 select-none flex flex-col text-[13px] leading-relaxed z-0 overflow-hidden">
                                    {jsonContent.split('\n').map((_, i) => (
                                        <span key={i}>{i + 1}</span>
                                    ))}
                                </div>
                                <textarea 
                                    value={jsonContent}
                                    onChange={(e) => setJsonContent(e.target.value)}
                                    spellCheck="false"
                                    className="w-full h-full bg-transparent border-none resize-none focus:ring-0 pl-16 pt-4 text-on-surface leading-relaxed text-[13px] relative z-10"
                                    disabled={!activeCollectionPath}
                                />
                            </div>
                        )}
                    </div>

                    {/* Middle: Sub-Collections */}
                    <div className="h-32 shrink-0 border-t-2 border-black/5 dark:border-white/5 bg-surface-container flex flex-col relative z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
                        <div className="px-3 py-2 border-b border-black/5 dark:border-white/5 bg-surface-container-highest flex items-center justify-between">
                            <h2 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px]">account_tree</span>
                                Nested Paths {selectedDocument ? `in ${selectedDocument.docId}` : ''}
                            </h2>
                            <button onClick={handleAddCollection} disabled={!selectedDocument} className="text-green-500 hover:bg-surface-container-highest px-2 py-1 rounded text-[11px] font-bold transition-colors flex items-center gap-1 disabled:opacity-50">
                                <span className="material-symbols-outlined text-[12px]">add</span>
                                Add Nested Path
                            </button>
                        </div>
                        <div className="flex-1 overflow-x-auto p-3 flex gap-3 items-center">
                            {subCollections.map(sub => (
                                <div key={sub} onClick={() => handleSubCollectionClick(sub)} className="w-32 h-16 shrink-0 bg-surface-container border border-black/5 dark:border-white/5 rounded-lg p-2 flex flex-col justify-center items-center hover:border-green-500 hover:shadow-sm cursor-pointer transition-all group">
                                    <div className="flex items-center gap-1 text-on-surface mb-1">
                                        <span className="material-symbols-outlined text-green-500 group-hover:scale-110 transition-transform text-[14px]">folder</span>
                                        <span className="font-bold text-xs truncate max-w-[80px]">{sub}</span>
                                    </div>
                                </div>
                            ))}
                            {!selectedDocument && (
                                <div className="text-xs text-on-surface-variant/60 font-medium italic w-full text-center">Select a node to view nested paths.</div>
                            )}
                            {selectedDocument && subCollections.length === 0 && (
                                <div onClick={handleAddCollection} className="w-32 h-16 shrink-0 bg-surface-container border-2 border-dashed border-black/5 dark:border-white/5 rounded-lg p-2 flex flex-col items-center justify-center hover:border-green-500 cursor-pointer transition-all text-on-surface-variant hover:text-green-500">
                                    <span className="material-symbols-outlined text-lg mb-0.5">add_circle</span>
                                    <span className="text-[10px] font-bold">New Path</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom: Live Terminal Activity */}
                    <div className="h-48 shrink-0 bg-[#0D1117] border-t-2 border-black/10 dark:border-white/10 flex flex-col shadow-inner">
                        <div className="h-8 border-b border-white/5 flex items-center justify-between px-4 shrink-0 bg-[#090D13]">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px] text-green-400">terminal</span>
                                <h3 className="font-bold text-[10px] text-green-400 uppercase tracking-widest">Live SDK Activity Stream</h3>
                            </div>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 font-mono flex flex-col gap-1 custom-scrollbar">
                            {logs.map((log, idx) => (
                                <div key={idx} className="text-[11px] flex gap-2 font-medium">
                                    <span className="text-gray-500 shrink-0">[{log.time}]</span>
                                    <span className={`${
                                        log.type === 'success' ? 'text-green-400' : 
                                        log.type === 'error' ? 'text-red-400' : 
                                        log.type === 'warning' ? 'text-amber-400' : 'text-blue-400'
                                    } break-all`}>
                                        {log.message}
                                    </span>
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default RealtimeExplorer;
