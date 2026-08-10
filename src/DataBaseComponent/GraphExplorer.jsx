import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import axios from 'axios';
import { objContext } from '../App';
import { Link } from 'react-router-dom';
import { Plus, Trash, Search, Zap, X } from 'lucide-react';

const GraphExplorer = ({ cluster }) => {
    const { serverRoute } = useContext(objContext);
    const fgRef = useRef();
    const wrapperRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);
    
    // UI Panels
    const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
    const [isAddEdgeOpen, setIsAddEdgeOpen] = useState(false);
    
    // Form States
    const [newNodeLabel, setNewNodeLabel] = useState('');
    const [newNodeProps, setNewNodeProps] = useState('{}');
    
    const [edgeSource, setEdgeSource] = useState('');
    const [edgeTarget, setEdgeTarget] = useState('');
    const [edgeLabel, setEdgeLabel] = useState('');
    const [edgeWeight, setEdgeWeight] = useState('1.0');
    const [isEditingNode, setIsEditingNode] = useState(false);
    const [editNodeProps, setEditNodeProps] = useState('{}');
    const [isEditingEdge, setIsEditingEdge] = useState(false);
    const [editEdgeProps, setEditEdgeProps] = useState('{}');
    const [editEdgeWeight, setEditEdgeWeight] = useState(1.0);
    const [searchQuery, setSearchQuery] = useState('');
    const { socket } = useContext(objContext); // Make sure socket is available for real-time

    
    useEffect(() => {
        if (wrapperRef.current) {
            setDimensions({
                width: wrapperRef.current.offsetWidth,
                height: wrapperRef.current.offsetHeight
            });
        }
        
        const handleResize = () => {
            if (wrapperRef.current) {
                setDimensions({
                    width: wrapperRef.current.offsetWidth,
                    height: wrapperRef.current.offsetHeight
                });
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchGraph = useCallback(async () => {
        try {
            const res = await axios.post(`${serverRoute}/api/graphExplorer/getGraph`, { clusterId: cluster.id });
            if (res.data.success) {
                const nodes = res.data.nodes.map(n => ({
                    id: n.id,
                    name: n.node_label,
                    val: 10,
                    properties: n.properties,
                    color: getColorForLabel(n.node_label)
                }));
                const links = res.data.edges.map(e => ({
                    id: e.id,
                    source: e.source_id,
                    target: e.target_id,
                    name: e.edge_label,
                    weight: e.weight,
                    directed: e.directed
                }));
                setGraphData({ nodes, links });
            }
        } catch (error) {
            console.error("Error fetching graph data:", error);
        }
    }, [cluster.id, serverRoute]);

    useEffect(() => {
        fetchGraph();
    }, [fetchGraph]);

    const getColorForLabel = (label) => {
        const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];
        let hash = 0;
        for (let i = 0; i < label.length; i++) {
            hash = label.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const handleNodeClick = useCallback((node) => {
        setSelectedEdge(null);
        setSelectedNode(node);
    }, []);

    const handleLinkClick = useCallback((link) => {
        setSelectedNode(null);
        setSelectedEdge(link);
    }, []);

    const handleAddNode = async () => {
        let props = {};
        try {
            props = JSON.parse(newNodeProps);
        } catch(e) {
            alert("Invalid JSON properties");
            return;
        }
        if (!newNodeLabel) return alert("Node Label is required");
        
        try {
            await axios.post(`${serverRoute}/api/graphExplorer/addNode`, {
                clusterId: cluster.id,
                nodeLabel: newNodeLabel,
                properties: props
            });
            setIsAddNodeOpen(false);
            setNewNodeLabel('');
            setNewNodeProps('{}');
            fetchGraph();
        } catch(e) {
            console.error(e);
            alert("Failed to add node");
        }
    };

    const handleAddEdge = async () => {
        if (!edgeSource || !edgeTarget || !edgeLabel) return alert("Source, Target, and Label are required");
        
        try {
            await axios.post(`${serverRoute}/api/graphExplorer/addEdge`, {
                clusterId: cluster.id,
                sourceId: edgeSource,
                targetId: edgeTarget,
                edgeLabel,
                weight: parseFloat(edgeWeight) || 1.0,
                directed: true
            });
            setIsAddEdgeOpen(false);
            setEdgeSource('');
            setEdgeTarget('');
            setEdgeLabel('');
            fetchGraph();
        } catch(e) {
            console.error(e);
            alert("Failed to add edge");
        }
    };

    
    const handleUpdateNode = async () => {
        try {
            const propsObj = JSON.parse(editNodeProps);
            await axios.post(`${serverRoute}/api/graphExplorer/updateNode`, {
                clusterId: cluster.id,
                nodeId: selectedNode.id,
                properties: propsObj,
                merge: false
            });
            setIsEditingNode(false);
            fetchGraph();
            setSelectedNode(prev => ({...prev, properties: JSON.stringify(propsObj)}));
        } catch(e) {
            alert("Invalid JSON or Update Failed");
        }
    };

    const handleUpdateEdge = async () => {
        try {
            const propsObj = JSON.parse(editEdgeProps);
            await axios.post(`${serverRoute}/api/graphExplorer/updateEdge`, {
                clusterId: cluster.id,
                edgeId: selectedEdge.id,
                properties: propsObj,
                weight: parseFloat(editEdgeWeight),
                merge: false
            });
            setIsEditingEdge(false);
            fetchGraph();
            setSelectedEdge(prev => ({...prev, properties: JSON.stringify(propsObj), weight: parseFloat(editEdgeWeight)}));
        } catch(e) {
            alert("Invalid JSON or Update Failed");
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on('graph_update', () => {
                fetchGraph();
            });
            return () => socket.off('graph_update');
        }
    }, [socket, fetchGraph]);

    const handleDeleteNode = async (nodeId) => {
        if (!window.confirm("Delete this node and all connected edges?")) return;
        try {
            await axios.post(`${serverRoute}/api/graphExplorer/deleteNode`, {
                clusterId: cluster.id,
                nodeId
            });
            setSelectedNode(null);
            fetchGraph();
        } catch(e) {
            console.error(e);
        }
    };
    
    const handleDeleteEdge = async (edgeId) => {
        if (!window.confirm("Delete this edge?")) return;
        try {
            await axios.post(`${serverRoute}/api/graphExplorer/deleteEdge`, {
                clusterId: cluster.id,
                edgeId
            });
            setSelectedEdge(null);
            fetchGraph();
        } catch(e) {
            console.error(e);
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-background text-on-surface font-sans overflow-hidden">
            
            {/* Top Navigation Bar */}
            <header className="flex-none bg-surface-container border-b border-black/5 dark:border-white/5 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link to="/clusters" className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container border border-black/5 dark:border-white/5 hover:bg-surface-container-high text-on-surface-variant transition-colors border border-black/5 dark:border-white/5">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                    </Link>
                    <div className="h-5 w-px bg-outline-variant/30"></div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-primary text-lg">bar_chart</span>
                        <span className="font-bold text-on-surface">
                            {cluster?.Cluster_Name || 'Graph Cluster'}
                        </span>
                        <span className="bg-surface-container-highest text-primary px-2 py-0.5 rounded text-xs font-bold tracking-wider ml-2">GRAPH ENGINE</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex h-full w-full bg-surface-container text-on-surface overflow-hidden relative" ref={wrapperRef}>
            
            {/* Main Graph View */}
            <div className="absolute inset-0 z-0">
                <ForceGraph2D
                    ref={fgRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    graphData={graphData}
                    nodeLabel="name"
                                        nodeColor={node => {
                        if (searchQuery && (node.name.toLowerCase().includes(searchQuery.toLowerCase()) || node.id.includes(searchQuery))) {
                            return '#ffea00'; // Highlight color
                        }
                        return node.color;
                    }}
                    nodeRelSize={searchQuery ? 8 : 6}
                    linkColor={() => 'rgba(255,255,255,0.2)'}
                    linkWidth={link => Math.max(1, link.weight || 1)}
                    linkDirectionalArrowLength={3.5}
                    linkDirectionalArrowRelPos={1}
                    onNodeClick={handleNodeClick}
                    onLinkClick={handleLinkClick}
                    enableNodeDrag={true}
                    enableZoomPanInteraction={true}
                    backgroundColor="#0a0a0a"
                />
            </div>

            {/* Overlay UI Controls */}
            <div className="absolute top-4 left-4 z-10 flex space-x-3">
                <button 
                    onClick={() => { setIsAddNodeOpen(true); setIsAddEdgeOpen(false); }}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary/90 text-primary-content hover:bg-primary rounded-xl shadow-lg backdrop-blur-md transition-all font-medium text-sm border border-primary"
                >
                    <Plus size={16} /> <span>Add Node</span>
                </button>
                <button 
                    onClick={() => { setIsAddEdgeOpen(true); setIsAddNodeOpen(false); }}
                    className="flex items-center space-x-2 px-4 py-2 bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-xl shadow-lg backdrop-blur-md transition-all font-medium text-sm border border-black/5 dark:border-white/5"
                >
                    <Zap size={16} /> <span>Add Edge</span>
                </button>
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-surface-container-high text-on-surface rounded-xl shadow-lg backdrop-blur-md transition-all font-medium text-sm border border-black/5 dark:border-white/5 ml-4">
                    <Search size={14} className="text-outline" />
                    <input 
                        type="text" 
                        placeholder="Search nodes..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none w-32 focus:w-48 transition-all text-sm placeholder-outline"
                    />
                </div>

            </div>

            <div className="absolute top-4 right-4 z-10 flex space-x-3">
                <div className="px-4 py-2 bg-surface-container border border-black/5 dark:border-white/5 backdrop-blur-xl rounded-xl border border-black/5 dark:border-white/5 text-xs font-mono text-outline">
                    {graphData.nodes.length} Nodes | {graphData.links.length} Edges
                </div>
            </div>

            {/* Side Panel: Node Inspector */}
            {selectedNode && (
                <div className="absolute top-16 right-4 w-80 bg-surface-container border border-black/5 dark:border-white/5 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-2xl shadow-2xl p-5 z-20 animate-in slide-in-from-right fade-in">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-xs text-primary font-bold tracking-widest uppercase mb-1">Node Inspector</div>
                            <h3 className="text-xl font-bold">{selectedNode.name}</h3>
                            <div className="text-xs text-outline font-mono mt-1 truncate" title={selectedNode.id}>{selectedNode.id}</div>
                        </div>
                        <button onClick={() => setSelectedNode(null)} className="p-1 hover:bg-surface-container-highest rounded-full text-outline hover:text-on-surface transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    
                    {isEditingNode ? (
                        <div className="bg-[#0f0f11] rounded-xl p-3 mb-4 overflow-hidden border border-primary shadow-inner">
                            <textarea 
                                value={editNodeProps} 
                                onChange={e => setEditNodeProps(e.target.value)}
                                className="w-full h-32 bg-transparent text-xs font-mono text-primary-fixed outline-none resize-none"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button onClick={() => setIsEditingNode(false)} className="text-xs text-outline hover:text-on-surface">Cancel</button>
                                <button onClick={handleUpdateNode} className="text-xs bg-primary text-primary-content px-2 py-1 rounded">Save</button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#0f0f11] rounded-xl p-3 mb-4 overflow-hidden border border-black/5 dark:border-white/5 shadow-inner group relative">
                            <pre className="text-xs font-mono text-primary-fixed overflow-x-auto h-32">
                                {(() => {
                                    try {
                                        return JSON.stringify(JSON.parse(selectedNode.properties), null, 2);
                                    } catch(e) { return selectedNode.properties; }
                                })()}
                            </pre>
                            <button 
                                onClick={() => {
                                    let p = selectedNode.properties;
                                    try { p = JSON.stringify(JSON.parse(p), null, 2); } catch(e){}
                                    setEditNodeProps(p || '{}');
                                    setIsEditingNode(true);
                                }}
                                className="absolute top-2 right-2 bg-surface-container border border-black/5 dark:border-white/5 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <span className="material-symbols-outlined text-[14px]">edit</span>
                            </button>
                        </div>
                    )}


                    <button 
                        onClick={() => handleDeleteNode(selectedNode.id)}
                        className="w-full flex items-center justify-center space-x-2 py-2 bg-error/10 text-error hover:bg-error/20 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Trash size={14} /> <span>Delete Node & Edges</span>
                    </button>
                </div>
            )}
            
            {/* Side Panel: Edge Inspector */}
            {selectedEdge && (
                <div className="absolute top-16 right-4 w-80 bg-surface-container border border-black/5 dark:border-white/5 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-2xl shadow-2xl p-5 z-20 animate-in slide-in-from-right fade-in">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-xs text-secondary font-bold tracking-widest uppercase mb-1">Edge Inspector</div>
                            <h3 className="text-xl font-bold">{selectedEdge.name}</h3>
                            <div className="text-xs text-outline font-mono mt-1 truncate" title={selectedEdge.id}>{selectedEdge.id}</div>
                        </div>
                        <button onClick={() => setSelectedEdge(null)} className="p-1 hover:bg-surface-container-highest rounded-full text-outline hover:text-on-surface transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono bg-surface-container p-2 rounded-lg mb-4 border border-black/5 dark:border-white/5">
                        <span className="truncate w-1/3 text-outline" title={selectedEdge.source.id}>{selectedEdge.source.name}</span>
                        <span className="text-primary mx-2">→</span>
                        <span className="truncate w-1/3 text-outline text-right" title={selectedEdge.target.id}>{selectedEdge.target.name}</span>
                    </div>

                    
                    <div className="text-sm mb-4">
                        <span className="text-outline">Weight:</span> 
                        {isEditingEdge ? (
                            <input type="number" step="0.1" value={editEdgeWeight} onChange={e => setEditEdgeWeight(e.target.value)} className="w-16 bg-surface-container-highest-highest px-2 py-0.5 rounded outline-none ml-2 font-mono" />
                        ) : (
                            <span className="font-mono bg-surface-container-highest px-2 py-0.5 rounded ml-2">{selectedEdge.weight}</span>
                        )}
                    </div>

                    {isEditingEdge ? (
                        <div className="bg-[#0f0f11] rounded-xl p-3 mb-4 overflow-hidden border border-secondary/40 shadow-inner">
                            <textarea 
                                value={editEdgeProps} 
                                onChange={e => setEditEdgeProps(e.target.value)}
                                className="w-full h-24 bg-transparent text-xs font-mono text-secondary-fixed outline-none resize-none"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button onClick={() => setIsEditingEdge(false)} className="text-xs text-outline hover:text-on-surface">Cancel</button>
                                <button onClick={handleUpdateEdge} className="text-xs bg-secondary text-secondary-content px-2 py-1 rounded">Save</button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#0f0f11] rounded-xl p-3 mb-4 overflow-hidden border border-black/5 dark:border-white/5 shadow-inner group relative">
                            <pre className="text-xs font-mono text-secondary-fixed overflow-x-auto h-24">
                                {(() => {
                                    try {
                                        return JSON.stringify(JSON.parse(selectedEdge.properties), null, 2);
                                    } catch(e) { return selectedEdge.properties || '{}'; }
                                })()}
                            </pre>
                            <button 
                                onClick={() => {
                                    let p = selectedEdge.properties;
                                    try { p = JSON.stringify(JSON.parse(p), null, 2); } catch(e){}
                                    setEditEdgeProps(p || '{}');
                                    setEditEdgeWeight(selectedEdge.weight);
                                    setIsEditingEdge(true);
                                }}
                                className="absolute top-2 right-2 bg-surface-container border border-black/5 dark:border-white/5 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <span className="material-symbols-outlined text-[14px]">edit</span>
                            </button>
                        </div>
                    )}


                    <button 
                        onClick={() => handleDeleteEdge(selectedEdge.id)}
                        className="w-full flex items-center justify-center space-x-2 py-2 bg-error/10 text-error hover:bg-error/20 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Trash size={14} /> <span>Delete Edge</span>
                    </button>
                </div>
            )}

            {/* Modals for Adding */}
            {isAddNodeOpen && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-surface-container border border-black/5 dark:border-white/5 rounded-2xl p-6 w-[400px] border border-black/5 dark:border-white/5 shadow-2xl animate-in zoom-in-95">
                        <h2 className="text-xl font-bold mb-4">Create Node</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-outline mb-1">Label (e.g. User, Product)</label>
                                <input 
                                    type="text" 
                                    value={newNodeLabel} onChange={e => setNewNodeLabel(e.target.value)}
                                    className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none focus:ring-1 ring-primary/50"
                                    placeholder="Node Label"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-outline mb-1">Properties (JSON)</label>
                                <textarea 
                                    value={newNodeProps} onChange={e => setNewNodeProps(e.target.value)}
                                    className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-lg px-3 py-2 text-sm font-mono h-32 focus:border-primary outline-none focus:ring-1 ring-primary/50"
                                    placeholder="{}"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button onClick={() => setIsAddNodeOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-container-highest">Cancel</button>
                            <button onClick={handleAddNode} className="px-4 py-2 bg-primary text-primary-content rounded-lg text-sm font-bold shadow-md hover:bg-primary/90">Add Node</button>
                        </div>
                    </div>
                </div>
            )}

            {isAddEdgeOpen && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-surface-container border border-black/5 dark:border-white/5 rounded-2xl p-6 w-[400px] border border-black/5 dark:border-white/5 shadow-2xl animate-in zoom-in-95">
                        <h2 className="text-xl font-bold mb-4">Create Edge</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-outline mb-1">Source Node</label>
                                <select 
                                    value={edgeSource} onChange={e => setEdgeSource(e.target.value)}
                                    className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                                >
                                    <option value="">Select Source Node...</option>
                                    {graphData.nodes.map(n => <option key={n.id} value={n.id}>{n.name} ({n.id.substring(0,8)})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-outline mb-1">Target Node</label>
                                <select 
                                    value={edgeTarget} onChange={e => setEdgeTarget(e.target.value)}
                                    className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                                >
                                    <option value="">Select Target Node...</option>
                                    {graphData.nodes.map(n => <option key={n.id} value={n.id}>{n.name} ({n.id.substring(0,8)})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-outline mb-1">Edge Label</label>
                                    <input 
                                        type="text" 
                                        value={edgeLabel} onChange={e => setEdgeLabel(e.target.value)}
                                        className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                                        placeholder="e.g. FOLLOWS"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-outline mb-1">Weight</label>
                                    <input 
                                        type="number" step="0.1"
                                        value={edgeWeight} onChange={e => setEdgeWeight(e.target.value)}
                                        className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button onClick={() => setIsAddEdgeOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-container-highest">Cancel</button>
                            <button onClick={handleAddEdge} className="px-4 py-2 bg-primary text-primary-content rounded-lg text-sm font-bold shadow-md hover:bg-primary/90">Add Edge</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default GraphExplorer;
