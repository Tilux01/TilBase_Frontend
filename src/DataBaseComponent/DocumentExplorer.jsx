import { useGlobalModal } from "../Context/GlobalModalContext";
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { objContext } from '../App';
import FieldEditor from './FieldEditor';
import { io } from 'socket.io-client';

const DocumentExplorer = ({ cluster }) => {
  const { showModal } = useGlobalModal();

    const { serverRoute } = useContext(objContext);
    
    const [breadcrumbs, setBreadcrumbs] = useState([]); 
    const [collections, setCollections] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [subCollections, setSubCollections] = useState([]);
    
    const [selectedCollection, setSelectedCollection] = useState(''); // Just the name, e.g. 'users'
    const [selectedDocument, setSelectedDocument] = useState(null); 
    const [documentData, setDocumentData] = useState({});
    const [viewMode, setViewMode] = useState('visual'); 
    const [jsonContent, setJsonContent] = useState('{\n  \n}');
    
    const [isSaving, setIsSaving] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [isAddingCollection, setIsAddingCollection] = useState(false);

    // Compute absolute paths
    const currentRootPath = breadcrumbs.join('/'); 
    const activeCollectionPath = selectedCollection ? (currentRootPath ? `${currentRootPath}/${selectedCollection}` : selectedCollection) : '';

    // 1. Fetch Collections at currentRootPath
    const fetchCollections = async (rootPath = '') => {
        try {
            const res = await axios.post(`${serverRoute}/api/documentExplorer/getCollections`, {
                clusterId: cluster.id,
                rootPath
            });
            if (res.data.success) {
                // If we are at root, set collections. If we are at a document, set subCollections.
                if (rootPath.split('/').length % 2 === 0 && rootPath !== '') {
                    setSubCollections(res.data.collections);
                } else {
                    setCollections(res.data.collections);
                    setSubCollections([]);
                }
            }
        } catch (error) {
            console.error("Error fetching collections", error);
        }
    };

    // 2. Fetch Documents for activeCollectionPath
    const fetchDocuments = async (parentPath) => {
        if (!parentPath) return;
        try {
            const res = await axios.post(`${serverRoute}/api/documentExplorer/getDocuments`, {
                clusterId: cluster.id,
                parentPath
            });
            if (res.data.success) {
                setDocuments(res.data.documents);
            }
        } catch (error) {
            console.error("Error fetching documents", error);
        }
    };

    // 3. Fetch specific Document Data
    const fetchDocumentData = async (path) => {
        try {
            const res = await axios.post(`${serverRoute}/api/documentExplorer/getDocumentData`, {
                clusterId: cluster.id,
                path
            });
            if (res.data.success) {
                setDocumentData(res.data.data || {});
                setJsonContent(JSON.stringify(res.data.data || {}, null, 2));
            } else {
                setDocumentData({});
                setJsonContent('{\n  \n}');
            }
        } catch (error) {
            console.error("Error fetching document data", error);
            setDocumentData({});
            setJsonContent('{\n  \n}');
        }
    };

    // Initial load: fetch root collections
    useEffect(() => {
        fetchCollections(currentRootPath);
    }, [currentRootPath]);

    // When a collection is selected, fetch its documents
    useEffect(() => {
        if (activeCollectionPath) {
            fetchDocuments(activeCollectionPath);
            setSelectedDocument(null);
            setDocumentData({});
            setJsonContent('{\n  \n}');
            setSubCollections([]);
        }
    }, [activeCollectionPath]);

    // When a document is selected, fetch its data and its subcollections
    useEffect(() => {
        if (selectedDocument) {
            fetchDocumentData(selectedDocument.fullPath);
            fetchCollections(selectedDocument.fullPath);
        }
    }, [selectedDocument]);

    // Real-Time UI Updates
    useEffect(() => {
        if (!cluster?.id) return;
        const urlObj = new URL(serverRoute);
        const socketUrl = `${urlObj.protocol}//${urlObj.host}`;
        const socket = io(socketUrl);
        
        socket.on("connect", () => {
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

        socket.on("document_update", refreshData);
        socket.on("collection_update", refreshData);

        return () => socket.disconnect();
    }, [cluster, serverRoute, currentRootPath, activeCollectionPath, selectedDocument]);

    // Handlers
    const handleCollectionClick = (colName) => {
        setSelectedCollection(colName);
    };

    const handleDocumentClick = (doc) => {
        setSelectedDocument(doc);
    };

    const handleSubCollectionClick = (subName) => {
        // Dive deeper: add current collection and document to breadcrumbs
        setBreadcrumbs([...breadcrumbs, selectedCollection, selectedDocument.docId]);
        setSelectedCollection(subName);
        setSelectedDocument(null);
    };

    const handleBreadcrumbClick = (index) => {
        if (index === -1) {
            // Go to root
            setBreadcrumbs([]);
            setSelectedCollection('');
            setSelectedDocument(null);
        } else {
            // The breadcrumbs array is [col1, doc1, col2, doc2]
            // We can only click on documents in the breadcrumb to go back to them
            // Actually, if we click index, we slice breadcrumbs
            // Let's just slice to that index
            const newBreadcrumbs = breadcrumbs.slice(0, index);
            setBreadcrumbs(newBreadcrumbs);
            
            setSelectedCollection(breadcrumbs[index]);
            setSelectedDocument(null);
        }
    };

    const handleSaveDocument = async () => {
        if (!selectedDocument && !activeCollectionPath) return await showModal({ type: "alert", message: "Select a collection to add a document" });
        
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
            const res = await axios.post(`${serverRoute}/api/documentExplorer/setDocumentData`, {
                clusterId: cluster.id,
                path: docPath,
                documentData: payload
            });
            if (res.data.success) {
                await showModal({ type: "alert", message: "Document saved!" });
                fetchDocuments(activeCollectionPath);
                if (!selectedDocument) {
                    // Set the newly created document as active
                    setSelectedDocument({ fullPath: docPath, docId: docPath.split('/').pop() });
                }
            }
        } catch (error) {
            console.error(error);
            await showModal({ type: "alert", message: "Error saving document" });
        }
        setIsSaving(false);
    };

    const handleDeleteDocument = async () => {
        if (!selectedDocument) return;
        const confirmDel = await showModal({ type: "confirm", message: `Delete document ${selectedDocument.docId} and ALL its subcollections?`, isDestructive: true });
        if (!confirmDel) return;

        try {
            const res = await axios.post(`${serverRoute}/api/documentExplorer/deleteDocument`, {
                clusterId: cluster.id,
                path: selectedDocument.fullPath
            });
            if (res.data.success) {
                await showModal({ type: "alert", message: "Deleted!" });
                setSelectedDocument(null);
                setDocumentData({});
                setJsonContent('{\n  \n}');
                fetchDocuments(activeCollectionPath);
            }
        } catch (error) {
            console.error(error);
            await showModal({ type: "alert", message: "Error deleting document" });
        }
    };

    const handleAddCollection = async () => {
        const name = await showModal({ type: "prompt", message: "Enter new collection name:" });
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
                        <span className="material-symbols-outlined text-primary text-lg">database</span>
                        <span className="font-bold text-on-surface cursor-pointer hover:text-primary transition-colors" onClick={() => handleBreadcrumbClick(-1)}>
                            {cluster?.Cluster_Name || 'Root'}
                        </span>
                        
                        {}
                        {breadcrumbs.map((crumb, idx) => (
                            <React.Fragment key={idx}>
                                <span className="material-symbols-outlined text-outline-variant text-sm mx-1">chevron_right</span>
                                <span 
                                    className={`cursor-pointer hover:text-primary transition-colors px-2 py-1 rounded hover:bg-surface-container-highest ${idx % 2 === 0 ? 'text-on-surface-variant font-medium' : 'text-on-surface font-bold bg-surface-container border border-black/5 dark:border-white/5'}`}
                                    onClick={() => handleBreadcrumbClick(idx)}
                                >
                                    {crumb}
                                </span>
                            </React.Fragment>
                        ))}
                        
                        {}
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
                    <button onClick={handleSaveDocument} disabled={isSaving || !activeCollectionPath} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold shadow-sm shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none">
                        <span className="material-symbols-outlined text-sm">save</span>
                        {isSaving ? 'Saving...' : 'Save Document'}
                    </button>
                </div>
            </header>

            {}
            <div className="flex-1 flex overflow-hidden">
                
                {}
                <div className="w-72 flex-none bg-surface-container border-r border-black/5 dark:border-white/5 flex flex-col z-0">
                    <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">folder_open</span>
                            Collections
                        </h2>
                        <button onClick={handleAddCollection} className="text-primary hover:bg-surface-container-highest p-1.5 rounded-md transition-colors" title="Add Collection">
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
                                        ? 'bg-surface-container-highest text-primary border border-primary'
                                        : 'text-on-surface-variant hover:bg-surface-container border border-black/5 dark:border-white/5 hover:text-on-surface border border-transparent'
                                }`}
                            >
                                {col}
                                <span className="material-symbols-outlined text-[14px] opacity-50">chevron_right</span>
                            </button>
                        ))}
                        {collections.length === 0 && (
                            <div className="p-4 text-center text-xs text-on-surface-variant/60 font-medium italic">
                                No collections found.<br/>Click + to start one.
                            </div>
                        )}
                    </div>
                </div>

                {}
                <div className="w-80 flex-none bg-surface-container border-r border-black/5 dark:border-white/5 flex flex-col z-0 shadow-[inset_4px_0_12px_rgba(0,0,0,0.01)]">
                    <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-surface-container">
                        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">description</span>
                            Documents
                        </h2>
                        <div className="flex gap-1">
                            <button onClick={() => { setSelectedDocument(null); setDocumentData({}); setJsonContent('{\n  \n}'); }} className="text-primary hover:bg-surface-container-highest p-1.5 rounded-md transition-colors" title="Add Document" disabled={!selectedCollection}>
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
                                <span className={`text-[13px] font-mono font-medium truncate w-full text-left ${selectedDocument?.id === doc.id ? 'text-secondary' : ''}`}>
                                    {doc.docId}
                                </span>
                                {selectedDocument?.id === doc.id && (
                                    <span className="text-[10px] text-on-surface-variant/60 font-sans mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px]">schedule</span>
                                        {new Date(doc.created_at).toLocaleDateString()}
                                    </span>
                                )}
                            </button>
                        ))}
                        {documents.length === 0 && selectedCollection && (
                            <div className="p-4 text-center text-xs text-on-surface-variant/60 font-medium italic">
                                No documents in this collection.<br/>Click + to add a new document or type JSON and hit Save.
                            </div>
                        )}
                        {!selectedCollection && (
                            <div className="p-4 text-center text-xs text-on-surface-variant/60 font-medium italic">
                                Select a collection to view documents.
                            </div>
                        )}
                    </div>
                </div>

                {}
                <div className="flex-1 flex flex-col bg-surface-container relative z-0">
                    
                    {}
                    <div className="p-4 flex items-center justify-between border-b border-black/5 dark:border-white/5">
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
                                    className={`px-3 py-1 rounded text-[11px] font-black uppercase tracking-widest transition-colors ${viewMode === 'visual' ? 'bg-secondary/10 text-secondary' : 'text-on-surface-variant hover:text-on-surface'}`}
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
                                    className={`px-3 py-1 rounded text-[11px] font-black uppercase tracking-widest transition-colors ${viewMode === 'json' ? 'bg-secondary/10 text-secondary' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    JSON
                                </button>
                            </div>
                            <span className="text-xs font-mono text-on-surface-variant">{selectedDocument ? selectedDocument.docId : 'New Document'}</span>
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

                    {}
                    {viewMode === 'visual' ? (
                        <div className="flex-1 relative bg-surface-container">
                            {activeCollectionPath ? (
                                <FieldEditor 
                                    key={selectedDocument ? selectedDocument.fullPath : activeCollectionPath}
                                    data={documentData} 
                                    onChange={(newData) => setDocumentData(newData)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-on-surface-variant/60 font-medium italic">
                                    Select a collection to start editing documents.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 relative font-mono text-sm group">
                            <div className="absolute left-0 top-0 bottom-0 w-12 bg-surface-container border border-black/5 dark:border-white/5 border-r border-black/5 dark:border-white/5 text-on-surface-variant/40 text-right pr-3 pt-4 select-none flex flex-col text-[13px] leading-relaxed z-0 overflow-hidden">
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

                    {}
                    <div className="h-1/3 min-h-[250px] border-t-2 border-black/5 dark:border-white/5 bg-surface-container flex flex-col shadow-[0_-4px_12px_rgba(0,0,0,0.02)] z-10 relative">
                        <div className="p-3 border-b border-black/5 dark:border-white/5 bg-surface-container-highest flex items-center justify-between">
                            <h2 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px]">account_tree</span>
                                Sub-Collections {selectedDocument ? `for ${selectedDocument.docId}` : ''}
                            </h2>
                            <button onClick={handleAddCollection} disabled={!selectedDocument} className="text-primary hover:bg-surface-container-highest px-2 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1 disabled:opacity-50">
                                <span className="material-symbols-outlined text-[14px]">add</span>
                                Start Sub-collection
                            </button>
                        </div>
                        <div className="flex-1 overflow-x-auto p-4 flex gap-4">
                            {subCollections.map(sub => (
                                <div key={sub} onClick={() => handleSubCollectionClick(sub)} className="w-48 h-24 shrink-0 bg-surface-container border border-black/5 dark:border-white/5 rounded-xl p-4 flex flex-col justify-between hover:border-primary hover:shadow-md cursor-pointer transition-all group">
                                    <div className="flex items-center gap-2 text-on-surface">
                                        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">folder</span>
                                        <span className="font-bold text-sm truncate">{sub}</span>
                                    </div>
                                    <span className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-wider flex items-center gap-1">
                                        Open Collection
                                        <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                                    </span>
                                </div>
                            ))}
                            
                            {!selectedDocument && (
                                <div className="w-full h-full flex items-center justify-center text-xs text-on-surface-variant/60 font-medium italic">
                                    Select and save a document to create sub-collections.
                                </div>
                            )}
                            
                            {selectedDocument && subCollections.length === 0 && (
                                <div onClick={handleAddCollection} className="w-48 h-24 shrink-0 bg-surface-container border-2 border-dashed border-black/5 dark:border-white/5 rounded-xl p-4 flex flex-col items-center justify-center hover:border-primary cursor-pointer transition-all text-on-surface-variant hover:text-primary">
                                    <span className="material-symbols-outlined text-2xl mb-1">add_circle</span>
                                    <span className="text-xs font-bold">New Sub-collection</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DocumentExplorer;
