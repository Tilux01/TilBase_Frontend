import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { objContext } from '../App';
import { io } from 'socket.io-client';

const FlatExplorer = ({ cluster }) => {
    const { serverRoute } = useContext(objContext);
    
    const [buckets, setBuckets] = useState([]);
    const [selectedBucket, setSelectedBucket] = useState('');
    const [keysList, setKeysList] = useState([]);
    const [selectedKey, setSelectedKey] = useState(null);
    const [keyValue, setKeyValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    // Realtime UI Feedback State
    const [lastUpdated, setLastUpdated] = useState(null);
    
    // UI State
    const [isAddingBucket, setIsAddingBucket] = useState(false);
    const [newBucketName, setNewBucketName] = useState('');
    const [isAddingKey, setIsAddingKey] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');

    const fetchBuckets = async () => {
        try {
            const res = await axios.post(`${serverRoute}/api/flatExplorer/getBuckets`, { clusterId: cluster.id });
            if (res.data.success) setBuckets(res.data.buckets);
        } catch (error) {
            console.error("Error fetching buckets", error);
        }
    };

    const fetchKeys = async (bucketName) => {
        if (!bucketName) return;
        try {
            const res = await axios.post(`${serverRoute}/api/flatExplorer/getKeys`, { clusterId: cluster.id, bucketName });
            if (res.data.success) setKeysList(res.data.keys);
        } catch (error) {
            console.error("Error fetching keys", error);
        }
    };

    const fetchKeyValue = async (keyName) => {
        try {
            const res = await axios.post(`${serverRoute}/api/flatExplorer/getValue`, { clusterId: cluster.id, bucketName: selectedBucket, keyName });
            if (res.data.success) {
                const val = res.data.value;
                setKeyValue(typeof val === 'object' ? JSON.stringify(val, null, 2) : val);
            }
        } catch (error) {
            console.error("Error fetching value", error);
            setKeyValue('');
        }
    };

    useEffect(() => {
        if (cluster?.id) fetchBuckets();
    }, [cluster]);

    useEffect(() => {
        if (selectedBucket) {
            fetchKeys(selectedBucket);
            setSelectedKey(null);
            setKeyValue('');
        }
    }, [selectedBucket]);

    useEffect(() => {
        if (selectedKey) fetchKeyValue(selectedKey);
    }, [selectedKey]);

    useEffect(() => {
        if (!cluster?.id) return;
        const urlObj = new URL(serverRoute);
        const socket = io(`${urlObj.protocol}//${urlObj.host}`);
        
        socket.on("connect", () => socket.emit("join_cluster", cluster.id));
        
        socket.on("flat_update", (data) => {
            fetchBuckets();
            if (selectedBucket) fetchKeys(selectedBucket);
            if (selectedKey && selectedKey === data.keyName) {
                fetchKeyValue(selectedKey);
                // Trigger glow effect
                setLastUpdated(Date.now());
                setTimeout(() => setLastUpdated(null), 1500);
            }
        });

        socket.on("flat_bucket_deleted", (data) => {
            fetchBuckets();
            if (selectedBucket === data.bucketName) {
                setSelectedBucket('');
                setKeysList([]);
                setSelectedKey(null);
                setKeyValue('');
            }
        });

        return () => socket.disconnect();
    }, [cluster, serverRoute, selectedBucket, selectedKey]);

    const handleSaveValue = async () => {
        if (!selectedKey) return;
        setIsSaving(true);
        try {
            let parsedValue = keyValue;
            try { parsedValue = JSON.parse(keyValue); } catch (e) { /* leave as string */ }

            await axios.post(`${serverRoute}/api/flatExplorer/setValue`, {
                clusterId: cluster.id,
                bucketName: selectedBucket,
                keyName: selectedKey,
                value: parsedValue
            });
            setIsSaving(false);
            alert("Payload saved!");
        } catch (error) {
            console.error(error);
            setIsSaving(false);
            alert("Error saving data or storage limit exceeded.");
        }
    };

    const handleAddKey = async () => {
        if (!newKeyName.trim() || !selectedBucket) return;
        setIsSaving(true);
        try {
            await axios.post(`${serverRoute}/api/flatExplorer/setValue`, {
                clusterId: cluster.id,
                bucketName: selectedBucket,
                keyName: newKeyName,
                value: "New Value"
            });
            setIsAddingKey(false);
            setNewKeyName('');
            fetchKeys(selectedBucket);
            setSelectedKey(newKeyName);
            setIsSaving(false);
        } catch (error) {
            setIsSaving(false);
            alert("Failed to add key.");
        }
    };

    const handleDeleteKey = async (keyToDelete, e) => {
        e.stopPropagation(); // prevent triggering setSelectedKey
        const confirmDel = window.confirm(`Delete key '${keyToDelete}'?`);
        if (!confirmDel) return;
        
        try {
            await axios.post(`${serverRoute}/api/flatExplorer/deleteKey`, {
                clusterId: cluster.id,
                bucketName: selectedBucket,
                keyName: keyToDelete
            });
            if (selectedKey === keyToDelete) {
                setSelectedKey(null);
                setKeyValue('');
            }
            fetchKeys(selectedBucket);
        } catch (error) {
            console.error(error);
            alert("Error deleting key");
        }
    };

    const handleDeleteBucket = async (bucketToDelete, e) => {
        e.stopPropagation();
        const confirmName = window.prompt(`WARNING: This will permanently wipe all data in '${bucketToDelete}'.\nType '${bucketToDelete}' to confirm:`);
        if (confirmName !== bucketToDelete) {
            if (confirmName !== null) alert("Bucket name did not match. Aborting deletion.");
            return;
        }
        
        setIsSaving(true);
        try {
            const res = await axios.post(`${serverRoute}/api/flatExplorer/deleteBucket`, {
                clusterId: cluster.id,
                bucketName: bucketToDelete
            });
            if (res.data.success) {
                if (selectedBucket === bucketToDelete) {
                    setSelectedBucket('');
                    setKeysList([]);
                    setSelectedKey(null);
                    setKeyValue('');
                }
                fetchBuckets();
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting bucket");
        }
        setIsSaving(false);
    };

    const handleIncrement = async () => {
        if (!selectedKey || !selectedBucket) return;
        const incAmount = window.prompt("Enter amount to increment by (e.g. 1 or -5):", "1");
        if (!incAmount || isNaN(Number(incAmount))) return;
        
        setIsSaving(true);
        try {
            const res = await axios.post(`${serverRoute}/api/flatExplorer/increment`, {
                clusterId: cluster.id,
                bucketName: selectedBucket,
                keyName: selectedKey,
                amount: Number(incAmount)
            });
            if (res.data.success) {
                setKeyValue(res.data.value.toString());
                // Trigger glow effect
                setLastUpdated(Date.now());
                setTimeout(() => setLastUpdated(null), 1500);
            }
        } catch (error) {
            console.error(error);
            alert("Error incrementing value");
        }
        setIsSaving(false);
    };

    return (
        <div className="flex flex-col h-screen w-full bg-background text-on-surface font-sans overflow-hidden">
            {/* Top Navigation & Breadcrumbs (Standard TilBase Style) */}
            <header className="flex-none bg-surface-container-lowest border-b border-outline-variant/30 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link to="/clusters" className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors border border-outline-variant/20">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                    </Link>
                    <div className="h-5 w-px bg-outline-variant/30"></div>
                    <div className="flex items-center gap-2 text-sm overflow-x-auto whitespace-nowrap hide-scrollbar max-w-2xl">
                        <span className="material-symbols-outlined text-primary text-lg">database</span>
                        <span className="font-bold text-on-surface">
                            {cluster?.Cluster_Name || 'Flat DB'}
                        </span>
                        
                        {selectedBucket && (
                            <>
                                <span className="material-symbols-outlined text-outline-variant text-sm mx-1">chevron_right</span>
                                <span className="text-on-surface-variant font-medium px-2 py-1">{selectedBucket}</span>
                            </>
                        )}
                        {selectedKey && (
                            <>
                                <span className="material-symbols-outlined text-outline-variant text-sm mx-1">chevron_right</span>
                                <span className="text-on-surface font-bold bg-surface-container px-2 py-1 rounded border border-outline-variant/20">{selectedKey}</span>
                            </>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                    <div className="bg-surface-container border border-outline-variant/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <span className="text-xs font-bold text-on-surface-variant tracking-widest uppercase">Flat Connected</span>
                    </div>
                </div>
            </header>

            {}
            <main className="flex-1 flex overflow-hidden">
                
                {}
                <div className="w-64 flex-none border-r border-outline-variant/20 bg-surface-container-lowest flex flex-col z-10 shadow-lg">
                    <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container/30">
                        <h2 className="text-xs font-black tracking-widest text-on-surface-variant uppercase flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-primary">folder_data</span>
                            Buckets
                        </h2>
                        <button onClick={() => setIsAddingBucket(true)} className="text-primary hover:bg-primary/10 w-7 h-7 rounded flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                        {isAddingBucket && (
                            <div className="mb-2 bg-surface-container p-2 rounded-lg border border-primary/50 shadow-[0_0_10px_rgba(var(--color-primary),0.1)]">
                                <input 
                                    autoFocus
                                    value={newBucketName}
                                    onChange={(e) => setNewBucketName(e.target.value)}
                                    onKeyDown={(e) => { if(e.key === 'Enter') { setSelectedBucket(newBucketName); setIsAddingBucket(false); } }}
                                    className="w-full bg-transparent text-sm text-on-surface outline-none"
                                    placeholder="Bucket Name"
                                />
                            </div>
                        )}
                        {buckets.map((b, idx) => (
                            <div 
                                key={idx}
                                onClick={() => setSelectedBucket(b.bucketName)}
                                className={`group w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-between text-sm font-medium border ${
                                    selectedBucket === b.bucketName 
                                        ? 'bg-primary text-on-primary border-primary/50 shadow-md translate-x-1' 
                                        : 'text-on-surface hover:bg-surface-container border-transparent'
                                }`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className={`material-symbols-outlined text-[18px] ${selectedBucket === b.bucketName ? 'text-on-primary' : 'text-primary/70'}`}>
                                        {selectedBucket === b.bucketName ? 'folder_open' : 'folder'}
                                    </span>
                                    <span className="truncate">{b.bucketName}</span>
                                </div>
                                <button 
                                    onClick={(e) => handleDeleteBucket(b.bucketName, e)}
                                    className={`opacity-0 group-hover:opacity-100 w-7 h-7 rounded flex items-center justify-center transition-all ${selectedBucket === b.bucketName ? 'text-on-primary hover:bg-black/20' : 'text-error hover:bg-error/10'}`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {}
                <div className="w-80 flex-none border-r border-outline-variant/20 bg-surface-container-lowest flex flex-col z-10 shadow-md">
                    <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container/20">
                        <h2 className="text-xs font-black tracking-widest text-on-surface-variant uppercase flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-secondary">key</span>
                            Keys
                        </h2>
                        {selectedBucket && (
                            <button onClick={() => setIsAddingKey(true)} className="text-secondary hover:bg-secondary/10 w-7 h-7 rounded flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined text-[16px]">add</span>
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                        {!selectedBucket ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6">
                                <span className="material-symbols-outlined text-4xl mb-3">touch_app</span>
                                <p className="text-sm font-medium">Select a bucket to view its keys</p>
                            </div>
                        ) : (
                            <>
                                {isAddingKey && (
                                    <div className="mb-2 bg-surface-container p-2 rounded-lg border border-secondary/50 shadow-[0_0_10px_rgba(var(--color-secondary),0.1)]">
                                        <input 
                                            autoFocus
                                            value={newKeyName}
                                            onChange={(e) => setNewKeyName(e.target.value)}
                                            onKeyDown={(e) => { if(e.key === 'Enter') handleAddKey(); }}
                                            className="w-full bg-transparent text-sm text-on-surface outline-none"
                                            placeholder="Key Name"
                                        />
                                    </div>
                                )}
                                {keysList.map((k, idx) => (
                                    <div 
                                        key={idx}
                                        onClick={() => setSelectedKey(k.keyName)}
                                        className={`group w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-between text-sm font-medium border ${
                                            selectedKey === k.keyName 
                                                ? 'bg-secondary/10 text-secondary border-secondary/30 shadow-sm' 
                                                : 'text-on-surface hover:bg-surface-container border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <span className="material-symbols-outlined text-[18px] opacity-70">data_object</span>
                                            <span className="truncate">{k.keyName}</span>
                                        </div>
                                        <button 
                                            onClick={(e) => handleDeleteKey(k.keyName, e)}
                                            className="opacity-0 group-hover:opacity-100 text-error hover:bg-error/10 w-7 h-7 rounded flex items-center justify-center transition-all"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                        </button>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {}
                <div className="flex-1 flex flex-col bg-surface-container-lowest relative">
                    {}
                    <div className="p-4 border-b border-outline-variant/20 bg-surface-container/40 flex justify-between items-center h-[60px]">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-outline-variant text-[20px]">edit_document</span>
                            <span className="font-mono text-sm text-on-surface font-bold">
                                {selectedKey ? `${selectedKey} Payload` : 'No Selection'}
                            </span>
                        </div>
                        
                        {selectedKey && (
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={handleIncrement}
                                    disabled={isSaving}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${
                                        isSaving ? 'bg-secondary/50 text-on-secondary cursor-not-allowed' : 'bg-secondary text-on-secondary hover:bg-secondary/90 hover:shadow-md hover:-translate-y-[1px]'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                                    Atomic Increment
                                </button>
                                <button 
                                    onClick={handleSaveValue}
                                    disabled={isSaving}
                                    className={`px-5 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${
                                        isSaving ? 'bg-primary/50 text-on-primary cursor-not-allowed' : 'bg-primary text-on-primary hover:bg-primary/90 hover:shadow-md hover:-translate-y-[1px]'
                                    }`}
                                >
                                    {isSaving ? (
                                        <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-[16px]">save</span>
                                    )}
                                    Save Payload
                                </button>
                            </div>
                        )}
                    </div>

                    {}
                    <div className="flex-1 relative bg-surface-container-lowest">
                        {!selectedKey ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                                <span className="material-symbols-outlined text-6xl mb-4">memory</span>
                                <h3 className="text-xl font-bold text-on-surface mb-2">Editor Standby</h3>
                                <p className="text-on-surface-variant text-sm max-w-sm">Select a Key to view or edit its value. Flat DB supports both raw strings and valid JSON structures.</p>
                            </div>
                        ) : (
                            <div className={`w-full h-full p-2 transition-all duration-500 ease-in-out ${lastUpdated ? 'bg-primary/10 rounded-lg shadow-[inset_0_0_20px_rgba(var(--color-primary),0.5)]' : ''}`}>
                                <textarea 
                                    value={keyValue}
                                    onChange={(e) => setKeyValue(e.target.value)}
                                    className={`w-full h-full bg-transparent text-on-surface p-4 font-mono text-sm leading-loose resize-none outline-none custom-scrollbar transition-all duration-500 rounded-md ${lastUpdated ? 'border border-primary' : 'border border-transparent'}`}
                                    spellCheck="false"
                                    placeholder="Enter data..."
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FlatExplorer;
