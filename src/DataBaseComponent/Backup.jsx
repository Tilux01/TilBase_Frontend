import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { objContext } from '../App';
import axios from 'axios';
import PaginationControls from './PaginationControls';

const Backups = () => {
    const navigate = useNavigate();
    const { serverRoute, userCred, currentProjectCred } = useContext(objContext);

    useEffect(() => {
        if (!userCred) {
            navigate('/signin');
        } else if (!currentProjectCred) {
            navigate('/dashboard');
        }
    }, [userCred, currentProjectCred, navigate]);
    const [backups, setBackups] = useState([]);
    const [clusters, setClusters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCluster, setSelectedCluster] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!userCred?.id || !currentProjectCred?.id) return;
        fetchBackups();
    }, [userCred, currentProjectCred, serverRoute, page]);

    const fetchBackups = async () => {
        try {
            const response = await axios.post(`${serverRoute}/getBackups`, {
                userId: userCred?.id,
                Profile_Key: userCred?.Profile_Key,
                projectId: currentProjectCred?.id,
                projectKey: currentProjectCred?.Project_Key,
                page: page
            });
            setBackups(response.data.message.backups || []);
            setClusters(response.data.message.clusters || []);
            if (response.data.message.clusters?.length > 0 && !selectedCluster) {
                setSelectedCluster(response.data.message.clusters[0].id);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching backups:", error);
            setLoading(false);
        }
    };

    const handleCreateBackup = async () => {
        if (!selectedCluster || isCreating) return;
        setIsCreating(true);
        const cluster = clusters.find(c => c.id === parseInt(selectedCluster));

        try {
            await axios.post(`${serverRoute}/createBackup`, {
                userId: userCred?.id,
                Profile_Key: userCred?.Profile_Key,
                projectId: currentProjectCred?.id,
                projectKey: currentProjectCred?.Project_Key,
                clusterId: cluster.id,
                clusterName: cluster.Cluster_Name
            });
            await fetchBackups();
            alert("Backup created successfully!");
        } catch (error) {
            console.error("Error creating backup:", error);
            alert("Failed to create backup.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteBackup = async (backupId, backupName) => {
        if (!window.confirm(`Are you sure you want to delete ${backupName}?`)) return;

        try {
            await axios.post(`${serverRoute}/deleteBackup`, {
                userId: userCred?.id,
                Profile_Key: userCred?.Profile_Key,
                projectId: currentProjectCred?.id,
                projectKey: currentProjectCred?.Project_Key,
                backupId,
                backupName
            });
            await fetchBackups();
        } catch (error) {
            console.error("Error deleting backup:", error);
            alert("Failed to delete backup.");
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div style={{ width: "100%" }}>
            <DashboardLayout>
                <div className="flex justify-between items-end mb-10">
                    <div className="space-y-1">
                        <h1 className="text-display-sm text-4xl font-extrabold tracking-tight text-on-surface">Backups</h1>
                        <p className="text-on-surface-variant text-sm font-medium">Manage manual snapshots and point-in-time recovery data.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6 w-full">
                    {}
                    <div className="bg-surface-container p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                        <h2 className="text-xl font-bold text-on-surface mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">add_circle</span>
                            Create Manual Backup
                        </h2>
                        <p className="text-sm text-on-surface-variant mb-6">Instantly generate a snapshot of a specific cluster. Data is stored securely on the local backend disk.</p>
                        
                        <div className="flex items-center gap-4">
                            <select 
                                className="bg-surface-container-highest border border-black/5 dark:border-white/5 text-on-surface text-sm rounded-lg focus:ring-primary focus:border-primary block w-64 p-2.5 outline-none font-medium"
                                value={selectedCluster}
                                onChange={(e) => setSelectedCluster(e.target.value)}
                            >
                                {clusters.length === 0 ? (
                                    <option value="">No active clusters</option>
                                ) : (
                                    clusters.map(c => (
                                        <option key={c.id} value={c.id}>{c.Cluster_Name}</option>
                                    ))
                                )}
                            </select>
                            
                            <button 
                                onClick={handleCreateBackup}
                                disabled={!selectedCluster || isCreating || clusters.length === 0}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-on-primary font-bold rounded-lg transition-all text-sm"
                            >
                                {isCreating ? (
                                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined text-sm">save</span>
                                )}
                                {isCreating ? "Generating..." : "Create Backup"}
                            </button>
                        </div>
                    </div>

                    {}
                    <div className="bg-surface-container p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5 w-full overflow-hidden">
                        <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">inventory_2</span>
                            Snapshot Vault
                        </h2>
                        
                        {loading ? (
                            <div className="space-y-2">
                                {[1, 2].map((n) => (
                                    <div key={n} className="animate-pulse h-12 bg-surface-container border border-black/5 dark:border-white/5 rounded-md w-full"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-black/5 dark:border-white/5">
                                            <th className="pb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Backup Name</th>
                                            <th className="pb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Cluster</th>
                                            <th className="pb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Size</th>
                                            <th className="pb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Created At</th>
                                            <th className="pb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/10">
                                        {backups?.length > 0 ? (
                                            backups.slice(0, 15).map((backup) => {
                                                const clusterName = clusters.find(c => c.id === backup.cluster_id)?.Cluster_Name || `Cluster #${backup.cluster_id}`;
                                                
                                                const downloadUrl = `${serverRoute}/downloadBackup/${backup.id}?userId=${userCred?.id}&Profile_Key=${userCred?.Profile_Key}&projectId=${currentProjectCred?.id}&projectKey=${currentProjectCred?.Project_Key}`;
                                                
                                                return (
                                                    <tr key={backup.id} className="hover:bg-surface-container-high transition-colors group">
                                                        <td className="py-4 pr-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-primary text-[18px]">data_object</span>
                                                                <span className="text-sm font-bold text-on-surface">{backup.backup_name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 pr-4">
                                                            <span className="text-sm font-medium text-on-surface-variant">{clusterName}</span>
                                                        </td>
                                                        <td className="py-4 pr-4">
                                                            <span className="text-sm text-on-surface-variant">{formatBytes(backup.size_bytes)}</span>
                                                        </td>
                                                        <td className="py-4 pr-4">
                                                            <span className="text-xs font-medium text-on-surface-variant bg-surface-container border border-black/5 dark:border-white/5 px-2 py-1 rounded">
                                                                {new Date(backup.created_at).toLocaleString()}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <a 
                                                                    href={downloadUrl}
                                                                    download
                                                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-highest hover:bg-surface-container-highest text-primary transition-colors"
                                                                    title="Download Backup"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">download</span>
                                                                </a>
                                                                <button 
                                                                    onClick={() => handleDeleteBackup(backup.id, backup.backup_name)}
                                                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-error/10 hover:bg-error/20 text-error transition-colors"
                                                                    title="Delete Backup"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="py-8 text-center text-sm text-on-surface-variant">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <span className="material-symbols-outlined text-3xl opacity-50">inventory_2</span>
                                                        No backups found. Create one above!
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {backups?.length > 0 && (
                            <PaginationControls 
                                currentPage={page} 
                                hasMore={backups?.length === 16} 
                                onNext={() => setPage(p => p + 1)} 
                                onPrev={() => setPage(p => Math.max(1, p - 1))} 
                            />
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </div>
    );
};

export default Backups;
