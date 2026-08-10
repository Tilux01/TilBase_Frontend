import React, { useState, useEffect, useRef } from 'react';

const typeOptions = ['String', 'Number', 'Boolean', 'Map', 'Array', 'Null'];


const objectToNodes = (obj) => {
    if (obj === undefined) return [];
    if (!obj || typeof obj !== 'object') return [];
    return Object.entries(obj).map(([key, val]) => {
        let type = 'String';
        let value = val;
        if (val === null) type = 'Null';
        else if (Array.isArray(val)) {
            type = 'Array';
            value = objectToNodes(val); 
        }
        else if (typeof val === 'object') {
            type = 'Map';
            value = objectToNodes(val); 
        }
        else if (typeof val === 'boolean') type = 'Boolean';
        else if (typeof val === 'number') type = 'Number';

        return { id: Math.random().toString(36).substr(2, 9), key, type, value };
    });
};


const nodesToObject = (nodes, isArray) => {
    if (isArray) {
        return nodes.map(n => {
            if (n.type === 'Map') return nodesToObject(n.value, false);
            if (n.type === 'Array') return nodesToObject(n.value, true);
            return n.value;
        });
    } else {
        const obj = {};
        nodes.forEach(n => {
            if (n.key.trim() !== '') {
                if (n.type === 'Map') obj[n.key] = nodesToObject(n.value, false);
                else if (n.type === 'Array') obj[n.key] = nodesToObject(n.value, true);
                else obj[n.key] = n.value;
            }
        });
        return obj;
    }
};

const FieldEditor = ({ data, onChange }) => {
    
    const [nodes, setNodes] = useState([]);
    const [isArray, setIsArray] = useState(false);
    
    
    const lastDataRef = useRef(data);

    
    useEffect(() => {
        if (data !== lastDataRef.current) {
            setIsArray(Array.isArray(data));
            setNodes(objectToNodes(data));
            lastDataRef.current = data;
        }
    }, [data]);

    const handleNodesChange = (newNodes) => {
        setNodes(newNodes);
        
        
        const cleanObj = nodesToObject(newNodes, isArray);
        lastDataRef.current = cleanObj; 
        onChange(cleanObj);
    };

    return (
        <div className="w-full h-full overflow-y-auto p-4 custom-scrollbar">
            {nodes.length === 0 && !isArray && (
                <div className="mb-4 text-xs text-on-surface-variant bg-surface-container-highest p-3 rounded border border-black/5 dark:border-white/5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">info</span>
                    This document is currently empty. Add fields below to start building its structure.
                </div>
            )}
            <FieldNodeList 
                nodes={nodes}
                isArray={isArray}
                onChangeNodes={handleNodesChange}
            />
        </div>
    );
};


const FieldNodeList = ({ nodes, isArray, onChangeNodes }) => {
    const handleUpdateNode = (index, newNode) => {
        const newNodes = [...nodes];
        newNodes[index] = newNode;
        onChangeNodes(newNodes);
    };

    const handleDeleteNode = (index) => {
        const newNodes = [...nodes];
        newNodes.splice(index, 1);
        onChangeNodes(newNodes);
    };

    const handleAddNode = () => {
        const newNodes = [...nodes, { 
            id: Math.random().toString(36).substr(2, 9), 
            key: isArray ? `${nodes.length}` : '', 
            type: 'String', 
            value: '' 
        }];
        onChangeNodes(newNodes);
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            {nodes.map((node, i) => (
                <FieldNode 
                    key={node.id} 
                    node={node} 
                    isArray={isArray}
                    index={i}
                    onUpdate={(newNode) => handleUpdateNode(i, newNode)}
                    onDelete={() => handleDeleteNode(i)}
                />
            ))}
            <div className="pt-2">
                <button 
                    onClick={handleAddNode}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-primary bg-surface-container-highest hover:bg-surface-container-highest rounded-md transition-colors"
                >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    Add Field
                </button>
            </div>
        </div>
    );
};

// Individual Node Component
const FieldNode = ({ node, isArray, index, onUpdate, onDelete }) => {
    const handleTypeChange = (e) => {
        const newType = e.target.value;
        let newVal = '';
        if (newType === 'Number') newVal = 0;
        if (newType === 'Boolean') newVal = false;
        if (newType === 'Map') newVal = [];
        if (newType === 'Array') newVal = [];
        if (newType === 'Null') newVal = null;
        onUpdate({ ...node, type: newType, value: newVal });
    };

    return (
        <div className="flex flex-col gap-2 p-3 bg-surface-container border border-black/5 dark:border-white/5 rounded-lg group hover:border-black/5 dark:border-white/5 transition-colors">
            <div className="flex items-center gap-3">
                {}
                {!isArray && (
                    <input 
                        type="text" 
                        value={node.key}
                        onChange={(e) => onUpdate({ ...node, key: e.target.value })}
                        placeholder="Field Name"
                        className="flex-1 bg-transparent border-b border-black/5 dark:border-white/5 focus:border-primary focus:outline-none text-sm px-1 py-1 text-on-surface placeholder:text-on-surface-variant/40"
                    />
                )}
                {isArray && (
                    <span className="text-xs font-mono text-on-surface-variant bg-surface-container border border-black/5 dark:border-white/5 px-2 py-1 rounded">
                        [{index}]
                    </span>
                )}

                {}
                <select 
                    value={node.type} 
                    onChange={handleTypeChange}
                    className="bg-surface-container-highest-highest border border-black/5 dark:border-white/5 text-on-surface text-xs px-2 py-1.5 rounded-md border border-black/5 dark:border-white/5 focus:outline-none focus:border-primary cursor-pointer"
                >
                    {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>

                {}
                {node.type === 'String' && (
                    <input 
                        type="text" 
                        value={node.value || ''}
                        onChange={(e) => onUpdate({ ...node, value: e.target.value })}
                        placeholder="Value"
                        className="flex-[2] bg-surface-container-highest border border-black/5 dark:border-white/5 rounded focus:border-primary focus:outline-none text-sm px-3 py-1 text-on-surface"
                    />
                )}
                {node.type === 'Number' && (
                    <input 
                        type="number" 
                        value={node.value !== undefined ? node.value : ''}
                        onChange={(e) => onUpdate({ ...node, value: Number(e.target.value) })}
                        placeholder="0"
                        className="flex-[2] bg-surface-container-highest border border-black/5 dark:border-white/5 rounded focus:border-primary focus:outline-none text-sm px-3 py-1 text-on-surface"
                    />
                )}
                {node.type === 'Boolean' && (
                    <div className="flex-[2] flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={!!node.value} onChange={(e) => onUpdate({ ...node, value: e.target.checked })} className="sr-only peer" />
                            <div className="w-9 h-5 bg-surface-container-highest-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            <span className="ml-3 text-xs font-medium text-on-surface-variant">{node.value ? 'true' : 'false'}</span>
                        </label>
                    </div>
                )}
                {node.type === 'Null' && (
                    <span className="flex-[2] text-xs font-mono text-outline-variant px-3 py-1">null</span>
                )}
                {(node.type === 'Map' || node.type === 'Array') && (
                    <span className="flex-[2] text-xs text-on-surface-variant/60 italic px-3 py-1">
                        {node.type === 'Map' ? '{ ... }' : '[ ... ]'}
                    </span>
                )}

                {}
                <button 
                    onClick={onDelete}
                    className="text-outline-variant hover:text-error hover:bg-error/10 p-1.5 rounded transition-colors opacity-50 group-hover:opacity-100"
                >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
            </div>

            {}
            {(node.type === 'Map' || node.type === 'Array') && (
                <div className="pl-6 mt-2 border-l-2 border-black/5 dark:border-white/5 ml-2">
                    <FieldNodeList 
                        nodes={Array.isArray(node.value) ? node.value : []}
                        isArray={node.type === 'Array'}
                        onChangeNodes={(newNestedNodes) => onUpdate({ ...node, value: newNestedNodes })}
                    />
                </div>
            )}
        </div>
    );
};

export default FieldEditor;
