import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { objContext } from '../App';
import { io } from 'socket.io-client';
import FieldEditor from './FieldEditor';

const HierarchicalExplorer = ({ cluster }) => {
    const { serverRoute } = useContext(objContext);
    
    // Core State
    const [rootNodes, setRootNodes] = useState([]);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [nodeData, setNodeData] = useState(null);
    const [nodePayload, setNodePayload] = useState('{\n  \n}');
    const [children, setChildren] = useState([]);
    const [ancestors, setAncestors] = useState([]);
    
    // UI State
    const [viewMode, setViewMode] = useState('visual'); // 'visual' | 'json'
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingNode, setIsAddingNode] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    
    // Modals
    const [moveModalOpen, setMoveModalOpen] = useState(false);
    const [nodeToMove, setNodeToMove] = useState(null);
    const [newParentId, setNewParentId] = useState('');
    const [moveToRoot, setMoveToRoot] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const fetchRootNodes = async () => {
        try {
            const res = await axios.post(`${serverRoute}/api/hierarchicalExplorer/getChildren`, { clusterId: cluster.id, parentId: null });
            if (res.data.success) setRootNodes(res.data.nodes);
        } catch (error) {
            console.error("Error fetching root nodes", error);
        }
    };

    const fetchChildren = async (parentId) => {
        if (!parentId) return;
        try {
            const res = await axios.post(`${serverRoute}/api/hierarchicalExplorer/getChildren`, { clusterId: cluster.id, parentId });
            if (res.data.success) setChildren(res.data.nodes);
        } catch (error) {
            console.error("Error fetching children", error);
        }
    };

    const fetchAncestors = async (nodeId) => {
        if (!nodeId) return;
        try {
            const res = await axios.post(`${serverRoute}/api/hierarchicalExplorer/getAncestors`, { clusterId: cluster.id, nodeId });
            if (res.data.success) setAncestors(res.data.ancestors.reverse()); 
        } catch (error) {
            console.error("Error fetching ancestors", error);
        }
    };

    useEffect(() => {
        if (cluster?.id) fetchRootNodes();
    }, [cluster]);

    useEffect(() => {
        if (selectedNodeId) {
            // Locate node data from available state
            const node = rootNodes.find(n => n.id === selectedNodeId) || children.find(n => n.id === selectedNodeId) || ancestors.find(n => n.id === selectedNodeId) || searchResults.find(n => n.id === selectedNodeId);
            if (node) {
                setNodeData(node);
                setNodePayload(JSON.stringify(node.data_payload || {}, null, 2));
            }
            fetchChildren(selectedNodeId);
            fetchAncestors(selectedNodeId);
        } else {
            setNodeData(null);
            setNodePayload('{\n  \n}');
            setChildren([]);
            setAncestors([]);
        }
    }, [selectedNodeId]);

    // Real-Time UI Updates
    useEffect(() => {
        if (!cluster?.id) return;
        const urlObj = new URL(serverRoute);
        const socket = io(`${urlObj.protocol}//${urlObj.host}`);
        
        socket.on("connect", () => socket.emit("join_cluster", cluster.id));
        
        socket.on("hierarchical_update", (data) => {
            if (data.type === 'add') {
                if (data.parentId === null) fetchRootNodes();
                else if (selectedNodeId === data.parentId) fetchChildren(selectedNodeId);
            }
            if (data.type === 'update' && selectedNodeId === data.id) {
                setLastUpdated(Date.now());
                setTimeout(() => setLastUpdated(null), 1500);
            }
            if (data.type === 'delete') {
                fetchRootNodes();
                if (selectedNodeId === data.id) {
                    setSelectedNodeId(null);
                } else if (selectedNodeId) {
                    fetchChildren(selectedNodeId);
                    fetchAncestors(selectedNodeId);
                }
            }
            if (data.type === 'move') {
                fetchRootNodes();
                if (selectedNodeId) {
                    fetchChildren(selectedNodeId);
                    fetchAncestors(selectedNodeId);
                }
            }
        });

        return () => socket.disconnect();
    }, [cluster, selectedNodeId]);

    // Actions
    const handleSave = async (payloadOverride = null) => {
        if (!selectedNodeId) return;
        setIsSaving(true);
        try {
            let parsed;
            if (payloadOverride) {
                parsed = payloadOverride;
            } else {
                try { parsed = JSON.parse(nodePayload); }
                catch (e) { alert("Invalid JSON"); setIsSaving(false); return; }
            }

            await axios.post(`${serverRoute}/api/hierarchicalExplorer/updateNode`, {
                clusterId: cluster.id,
                nodeId: selectedNodeId,
                dataPayload: parsed
            });
            setNodeData(prev => ({...prev, data_payload: parsed}));
        } catch (error) {
            console.error("Error saving node", error);
            if (error.response?.status === 429) alert("Storage limit exceeded.");
            if (error.response?.status === 403) alert("Access Denied: Read Only Key or Cluster Paused.");
        }
        setIsSaving(false);
    };

    const handleFieldEditorChange = (newObj) => {
        setNodePayload(JSON.stringify(newObj, null, 2));
        setNodeData(prev => ({...prev, data_payload: newObj}));
    };

    const handleAddNode = async (parentId) => {
        setIsAddingNode(true);
        try {
            await axios.post(`${serverRoute}/api/hierarchicalExplorer/addNode`, {
                clusterId: cluster.id,
                parentId: parentId,
                dataPayload: { name: "New Child Node" }
            });
            setIsAddingNode(false);
        } catch (error) {
            console.error("Error adding node", error);
            setIsAddingNode(false);
        }
    };

    const handleDeleteNode = async (nodeId) => {
        if (!window.confirm("WARNING: This will recursively delete all children of this node. Proceed?")) return;
        try {
            await axios.post(`${serverRoute}/api/hierarchicalExplorer/deleteNode`, {
                clusterId: cluster.id,
                nodeId
            });
            if (selectedNodeId === nodeId) setSelectedNodeId(null);
        } catch (error) {
            console.error("Error deleting node", error);
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        try {
            const res = await axios.post(`${serverRoute}/api/hierarchicalExplorer/searchNodes`, {
                clusterId: cluster.id,
                query: query.trim()
            });
            if (res.data.success) {
                setSearchResults(res.data.nodes);
            }
        } catch (error) {
            console.error("Search failed", error);
        }
    };

    const submitMove = async () => {
        try {
            await axios.post(`${serverRoute}/api/hierarchicalExplorer/moveNode`, {
                clusterId: cluster.id,
                nodeId: nodeToMove,
                newParentId: moveToRoot ? null : newParentId
            });
            setMoveModalOpen(false);
            setNodeToMove(null);
            setNewParentId('');
            setMoveToRoot(false);
        } catch (error) {
            console.error("Error moving node", error);
            alert("Failed to move node");
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-background text-on-surface font-sans overflow-hidden">
            
            {/* Top Navigation Bar */}
            <header className="flex-none bg-surface-container-lowest border-b border-outline-variant/30 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link to="/clusters" className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors border border-outline-variant/20">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                    </Link>
                    <div className="h-5 w-px bg-outline-variant/30"></div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-primary text-lg">account_tree</span>
                        <span className="font-bold text-on-surface">
                            {cluster?.Cluster_Name || 'Hierarchical Cluster'}
                        </span>
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold tracking-wider ml-2">HIERARCHICAL ENGINE</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* PANE 1: Hierarchy Context & Search (1/3 Width) */}
                <div className="w-1/3 border-r border-outline-variant/30 flex flex-col bg-surface-container-lowest relative">
                
                {/* Header & Search */}
                <div className="p-3 border-b border-outline-variant/30 sticky top-0 bg-surface-container-lowest z-10">
                    <h3 className="font-bold flex items-center gap-2 text-xs tracking-widest uppercase mb-3 text-primary">
                        <span className="material-symbols-outlined text-[16px]">account_tree</span>
                        Hierarchy Matrix
                    </h3>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">search</span>
                        <input 
                            type="text"
                            placeholder="Search Node ID or Payload..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full bg-surface-container text-sm rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-outline-variant/30"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2">
                    {isSearching ? (
                        <div className="p-2 space-y-2">
                            <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 px-2">Search Results</div>
                            {searchResults.length === 0 ? (
                                <p className="text-sm italic text-outline-variant px-2">No nodes found.</p>
                            ) : (
                                searchResults.map(res => (
                                    <div 
                                        key={res.id}
                                        onClick={() => { setSelectedNodeId(res.id); setSearchQuery(''); setIsSearching(false); }}
                                        className="px-3 py-2 rounded-xl cursor-pointer hover:bg-surface-container transition-colors flex items-center gap-3 group border border-transparent hover:border-outline-variant/30"
                                    >
                                        <span className="material-symbols-outlined text-primary text-[18px]">manage_search</span>
                                        <div className="overflow-hidden">
                                            <div className="text-xs font-bold truncate">{res.data_payload?.name || "Unnamed Node"}</div>
                                            <div className="text-[10px] font-mono text-outline-variant truncate">{res.id}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Breadcrumb Lineage */}
                            {selectedNodeId && (
                                <div className="mb-4">
                                    <button 
                                        onClick={() => setSelectedNodeId(null)}
                                        className="px-3 py-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 w-full text-left"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                                        BACK TO ROOT LEVEL
                                    </button>
                                    
                                    <div className="mt-2 space-y-1 relative before:absolute before:left-[21px] before:top-4 before:bottom-4 before:w-[2px] before:bg-outline-variant/20">
                                        {ancestors.map((anc, idx) => (
                                            <div 
                                                key={anc.id}
                                                onClick={() => setSelectedNodeId(anc.id)}
                                                className={`relative z-10 px-3 py-2 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${anc.id === selectedNodeId ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 scale-[1.02]' : 'hover:bg-surface-container text-on-surface-variant'}`}
                                            >
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[14px] ${anc.id === selectedNodeId ? 'bg-white/20' : 'bg-surface-container-high'}`}>
                                                    <span className="material-symbols-outlined text-[14px]">{anc.id === selectedNodeId ? 'my_location' : 'trip_origin'}</span>
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="text-sm font-bold truncate">{anc.data_payload?.name || anc.id.substring(0,8)}</div>
                                                    {anc.id !== selectedNodeId && <div className="text-[10px] opacity-60">Level {idx}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Roots / Active Context Display */}
                            {!selectedNodeId && (
                                <div className="p-2 space-y-1">
                                    <div className="px-3 py-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Root Nodes</div>
                                    {rootNodes.map(node => (
                                        <div 
                                            key={node.id}
                                            onClick={() => setSelectedNodeId(node.id)}
                                            className="px-3 py-2 rounded-xl cursor-pointer hover:bg-surface-container transition-colors flex items-center justify-between group border border-transparent hover:border-outline-variant/30"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-outline-variant text-[16px]">folder_special</span>
                                                <span className="font-medium text-xs">{node.data_payload?.name || node.id.substring(0,8)}</span>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined text-[16px] text-outline-variant hover:text-red-400" onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }}>delete</span>
                                            </div>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => handleAddNode(null)}
                                        className="mt-3 w-full py-2 border border-dashed border-outline-variant/50 rounded-xl text-primary font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-1 text-xs"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">add</span>
                                        Add Root Node
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* PANE 2: Children Context (1/3 Width) */}
            <div className="w-1/3 border-r border-outline-variant/30 flex flex-col bg-surface-container">
                {selectedNodeId ? (
                    <>
                        <div className="p-3 border-b border-outline-variant/30 flex items-center justify-between sticky top-0 bg-surface-container z-10">
                            <h3 className="font-bold flex items-center gap-2 text-xs tracking-widest uppercase">
                                <span className="material-symbols-outlined text-primary text-[16px]">schema</span>
                                Child Nodes
                            </h3>
                            <span className="text-[10px] font-bold bg-surface-container-high px-2 py-0.5 rounded-full">{children.length}</span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-3 space-y-1">
                            {children.length === 0 ? (
                                <div className="text-center p-8 border border-dashed border-outline-variant/30 rounded-2xl">
                                    <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">account_tree</span>
                                    <p className="text-sm text-on-surface-variant font-medium">This node is a leaf</p>
                                    <p className="text-xs text-outline-variant mt-1">Add children to expand the tree.</p>
                                </div>
                            ) : (
                                children.map(child => (
                                    <div 
                                        key={child.id}
                                        onClick={() => setSelectedNodeId(child.id)}
                                        className="px-3 py-2 rounded-xl bg-surface-container-lowest cursor-pointer hover:bg-surface-container-high transition-all flex items-center justify-between group shadow-sm border border-outline-variant/10 hover:border-outline-variant/30"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span className="material-symbols-outlined text-outline-variant text-[16px]">segment</span>
                                            <div className="truncate text-xs font-medium">{child.data_payload?.name || child.id.substring(0,8)}</div>
                                        </div>
                                        
                                        {/* Hover Actions */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setNodeToMove(child.id); setMoveModalOpen(true); }}
                                                className="w-6 h-6 rounded-lg hover:bg-primary/10 text-primary flex items-center justify-center"
                                                title="Move Node"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">drive_file_move</span>
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteNode(child.id); }}
                                                className="w-6 h-6 rounded-lg hover:bg-red-500/10 text-red-400 flex items-center justify-center"
                                                title="Delete Branch"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                            
                            <button 
                                onClick={() => handleAddNode(selectedNodeId)}
                                disabled={isAddingNode}
                                className="mt-3 w-full py-2 bg-primary/10 rounded-xl text-primary font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-1 text-xs disabled:opacity-50"
                            >
                                {isAddingNode ? <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> : <span className="material-symbols-outlined text-[16px]">add_circle</span>}
                                Inject Child Node
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-8 text-center text-outline-variant">
                        Select a node from the Matrix to view its children.
                    </div>
                )}
            </div>

            {/* PANE 3: Advanced Node Editor (1/3 Width) */}
            <div className="flex-1 bg-surface-container-lowest flex flex-col relative overflow-hidden">
                {selectedNodeId ? (
                    <>
                        {/* Editor Header */}
                        <div className="p-3 border-b border-outline-variant/30 flex items-center justify-between sticky top-0 bg-surface-container-lowest/80 backdrop-blur-md z-10">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[18px]">data_object</span>
                                <h3 className="font-bold text-xs tracking-widest uppercase">Payload Editor</h3>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="bg-surface-container p-1 rounded-lg flex text-xs font-bold shadow-inner border border-outline-variant/20">
                                    <button 
                                        className={`px-2 py-1 rounded-md transition-all ${viewMode === 'visual' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                                        onClick={() => setViewMode('visual')}
                                    >
                                        Visual
                                    </button>
                                    <button 
                                        className={`px-2 py-1 rounded-md transition-all ${viewMode === 'json' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                                        onClick={() => setViewMode('json')}
                                    >
                                        JSON
                                    </button>
                                </div>
                                <button 
                                    onClick={() => handleSave()}
                                    disabled={isSaving}
                                    className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity text-xs flex items-center gap-1 disabled:opacity-50 shadow-md shadow-primary/20"
                                >
                                    {isSaving ? <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span> : <span className="material-symbols-outlined text-[14px]">save</span>}
                                    Save
                                </button>
                            </div>
                        </div>
                        
                        {/* ID Ribbon */}
                        <div className="px-4 py-1.5 bg-surface-container border-b border-outline-variant/20 flex justify-between items-center text-[10px] font-mono text-outline-variant">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">fingerprint</span>
                                {selectedNodeId}
                            </div>
                            {lastUpdated && <span className="text-primary font-bold animate-pulse">Syncing...</span>}
                        </div>
                        
                        {/* Editor Body */}
                        <div className="flex-1 overflow-y-auto p-6 bg-surface-container-lowest">
                            {viewMode === 'visual' ? (
                                <div className="bg-surface-container rounded-2xl border border-outline-variant/20 p-1">
                                    <FieldEditor 
                                        value={nodeData?.data_payload || {}} 
                                        onChange={handleFieldEditorChange} 
                                    />
                                </div>
                            ) : (
                                <div className={`transition-all duration-500 ${lastUpdated ? 'ring-2 ring-primary/50 shadow-[0_0_30px_rgba(var(--color-primary),0.15)]' : 'ring-1 ring-outline-variant/20'} rounded-2xl bg-[#0d1117] overflow-hidden h-full flex flex-col`}>
                                    <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex justify-between items-center text-xs font-mono text-white/40">
                                        <span>Raw JSON String</span>
                                    </div>
                                    <textarea
                                        value={nodePayload}
                                        onChange={(e) => setNodePayload(e.target.value)}
                                        className="flex-1 w-full bg-transparent text-[#e6edf3] font-mono p-4 text-sm focus:outline-none resize-none"
                                        spellCheck="false"
                                    />
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant p-8">
                        <div className="w-24 h-24 rounded-3xl bg-surface-container flex items-center justify-center mb-6 shadow-inner">
                            <span className="material-symbols-outlined text-[48px] text-outline-variant opacity-50">account_tree</span>
                        </div>
                        <p className="text-lg font-bold mb-2">Editor Standby</p>
                        <p className="text-sm opacity-60 text-center max-w-sm">Select a node to visually edit its JSON payload in real-time.</p>
                    </div>
                )}
            </div>

            {/* Move Node Modal */}
            {moveModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-outline-variant/20 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">drive_file_move</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Re-parent Node</h2>
                                <p className="text-xs text-on-surface-variant">Move sub-tree to a new location</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-outline-variant">Target Node ID</label>
                                <input 
                                    type="text" 
                                    value={newParentId}
                                    onChange={(e) => setNewParentId(e.target.value)}
                                    placeholder="Paste Parent ID here..."
                                    disabled={moveToRoot}
                                    className="w-full bg-surface-container border border-outline-variant/30 p-3 rounded-xl focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                                />
                            </div>
                            <div className="flex items-center gap-3 bg-surface-container p-4 rounded-xl border border-outline-variant/10">
                                <input 
                                    type="checkbox" 
                                    id="root-check"
                                    checked={moveToRoot}
                                    onChange={(e) => setMoveToRoot(e.target.checked)}
                                    className="w-5 h-5 accent-primary rounded-md cursor-pointer"
                                />
                                <label htmlFor="root-check" className="text-sm font-bold cursor-pointer select-none">
                                    Promote to Root Node (parent = null)
                                </label>
                            </div>
                        </div>
                        <div className="p-4 bg-surface-container flex gap-3 justify-end border-t border-outline-variant/20">
                            <button 
                                onClick={() => setMoveModalOpen(false)}
                                className="px-6 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors font-bold"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={submitMove}
                                className="px-6 py-2 rounded-xl bg-primary text-on-primary hover:opacity-90 transition-opacity font-bold shadow-md shadow-primary/20"
                            >
                                Confirm Move
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default HierarchicalExplorer;
