import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { objContext } from '../App';
import axios from 'axios';
import PaginationControls from './PaginationControls';
import CopyButton from './CopyButton';

const Security = () => {
    const navigate = useNavigate();
    const { serverRoute, userCred, currentProjectCred, setUserCred, setCurrentProjectCred } = useContext(objContext);

    useEffect(() => {
        if (!userCred) {
            navigate('/signin');
        } else if (!currentProjectCred) {
            navigate('/dashboard');
        }
    }, [userCred, currentProjectCred, navigate]);
    const [securityData, setSecurityData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // State for toggling API keys visibility
    const [showProfileKey, setShowProfileKey] = useState(false);
    const [showProjectKey, setShowProjectKey] = useState(false);
    const [page, setPage] = useState(1);
    
    const [generatingProfile, setGeneratingProfile] = useState(false);
    const [generatingProject, setGeneratingProject] = useState(false);

    useEffect(() => {
        if (!userCred?.id || !currentProjectCred?.id) return;

        const fetchSecurityData = async () => {
            try {
                const response = await axios.post(`${serverRoute}/getSecurityOverview`, {
                    userId: userCred?.id,
                    Profile_Key: userCred?.Profile_Key,
                    projectId: currentProjectCred?.id,
                    projectKey: currentProjectCred?.Project_Key,
                    page: page
                });
                setSecurityData(response.data.message);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching security data:", error);
                setLoading(false);
            }
        };

        fetchSecurityData();
    }, [userCred, currentProjectCred, serverRoute, page]);


    const handleRegenerateProfileKey = async () => {
        if (!confirm("Are you sure you want to regenerate your Profile API Key? Any application currently using this key will lose access immediately.")) return;
        setGeneratingProfile(true);
        try {
            const response = await axios.post(`${serverRoute}/regenerateProfileKey`, {
                userId: userCred?.id
            });
            setUserCred({ ...userCred, Profile_Key: response.data.message });
        } catch (error) {
            console.error(error);
            alert("Error regenerating Profile Key");
        } finally {
            setGeneratingProfile(false);
        }
    };

    const handleRegenerateProjectKey = async () => {
        if (!confirm("Are you sure you want to regenerate this Project's API Key? Any application currently using this key will lose access immediately.")) return;
        setGeneratingProject(true);
        try {
            const response = await axios.post(`${serverRoute}/regenerateProjectKey`, {
                userId: userCred?.id,
                projectId: currentProjectCred?.id,
                projectName: currentProjectCred?.Project_Name,
                serverName: currentProjectCred?.Server_Name,
                serverRegion: currentProjectCred?.Server_Region
            });
            
            setCurrentProjectCred({ ...currentProjectCred, Project_Key: response.data.message });
            
            // Re-fetch security data to update Audit Log with the new "Regenerated" event
            const newKey = response.data.message;
            const secResponse = await axios.post(`${serverRoute}/getSecurityOverview`, {
                userId: userCred?.id,
                Profile_Key: userCred?.Profile_Key,
                projectId: currentProjectCred?.id,
                projectKey: newKey
            });
            setSecurityData(secResponse.data.message);
        } catch (error) {
            console.error(error);
            alert("Error regenerating Project Key");
        } finally {
            setGeneratingProject(false);
        }
    };

    return (
        <div style={{ width: "100%" }}>
            <DashboardLayout>
                <div className="flex justify-between items-end mb-10">
                    <div className="space-y-1">
                        <h1 className="text-display-sm text-4xl font-extrabold tracking-tight text-on-surface">Security</h1>
                        <p className="text-on-surface-variant text-sm font-medium">Manage encryption keys, authentication methods, and database auditing.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6 w-full">
                    {/* SECTION 1: API KEYS */}
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                        <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">key</span>
                            API & Access Keys
                        </h2>
                        
                        <div className="space-y-6">
                            {/* Profile Key */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-outline-variant/20 rounded-lg">
                                <div>
                                    <h3 className="font-bold text-on-surface text-sm">Profile API Key</h3>
                                    <p className="text-xs text-on-surface-variant mt-1">Used to authenticate the user programmatically across all projects.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-surface-container px-4 py-2 rounded-md font-mono text-sm min-w-[250px] text-center">
                                        {showProfileKey ? userCred?.Profile_Key : "********************************"}
                                    </div>
                                    <button onClick={() => setShowProfileKey(!showProfileKey)} className="text-on-surface-variant hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">{showProfileKey ? "visibility_off" : "visibility"}</span>
                                    </button>
                                    <CopyButton textToCopy={userCred?.Profile_Key} className="text-on-surface-variant hover:text-primary transition-colors flex items-center" />
                                    <button onClick={handleRegenerateProfileKey} disabled={generatingProfile} className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50">
                                        <span className={`material-symbols-outlined text-[20px] ${generatingProfile ? 'animate-spin' : ''}`}>sync</span>
                                    </button>
                                </div>
                            </div>

                            {/* Project Key */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-outline-variant/20 rounded-lg">
                                <div>
                                    <h3 className="font-bold text-on-surface text-sm">Project API Key</h3>
                                    <p className="text-xs text-on-surface-variant mt-1">Used to authenticate specific interactions within this project workspace.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-surface-container px-4 py-2 rounded-md font-mono text-sm min-w-[250px] text-center">
                                        {showProjectKey ? currentProjectCred?.Project_Key : "********************************"}
                                    </div>
                                    <button onClick={() => setShowProjectKey(!showProjectKey)} className="text-on-surface-variant hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">{showProjectKey ? "visibility_off" : "visibility"}</span>
                                    </button>
                                    <CopyButton textToCopy={currentProjectCred?.Project_Key} className="text-on-surface-variant hover:text-primary transition-colors flex items-center" />
                                    <button onClick={handleRegenerateProjectKey} disabled={generatingProject} className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50">
                                        <span className={`material-symbols-outlined text-[20px] ${generatingProject ? 'animate-spin' : ''}`}>sync</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {/* SECTION 2: NETWORK ACCESS OVERVIEW */}
                        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                            <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">public</span>
                                Network Overview
                            </h2>
                            {loading ? (
                                <div className="animate-pulse h-20 bg-surface-container rounded-lg"></div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg border border-outline-variant/20">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-on-surface-variant">dns</span>
                                            <span className="font-bold text-sm text-on-surface">Whitelisted IP Addresses</span>
                                        </div>
                                        <span className="text-xl font-extrabold text-primary">{securityData?.totalIPs || 0}</span>
                                    </div>

                                    {securityData?.globalAccessEnabled && (
                                        <div className="flex items-start gap-3 p-4 bg-error/10 rounded-lg border border-error/30 text-error">
                                            <span className="material-symbols-outlined mt-0.5">warning</span>
                                            <div>
                                                <h3 className="font-bold text-sm">Global Access Enabled</h3>
                                                <p className="text-xs mt-1 leading-relaxed opacity-90">
                                                    You have whitelisted the global `0.0.0.0/0` IP address. This allows anyone on the internet to attempt a connection to your database. We highly recommend restricting access to specific IPs.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* SECTION 3: ENCRYPTION STANDARDS */}
                        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                            <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">lock</span>
                                Encryption Standards
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-4 bg-surface-container rounded-lg border border-outline-variant/20">
                                    <span className="material-symbols-outlined text-primary mt-0.5">enhanced_encryption</span>
                                    <div>
                                        <h3 className="font-bold text-sm text-on-surface">Data in Transit</h3>
                                        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                                            All connections to TilBase clusters are strictly enforced via standard TLS/SSL encryption. Non-secure HTTP connections are automatically rejected by the network.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-surface-container rounded-lg border border-outline-variant/20">
                                    <span className="material-symbols-outlined text-primary mt-0.5">shield</span>
                                    <div>
                                        <h3 className="font-bold text-sm text-on-surface">Data at Rest</h3>
                                        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                                            All storage volumes underlying your database instances are encrypted at rest using AES-256 encryption.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: SECURITY AUDIT LOG */}
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 w-full overflow-hidden">
                        <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">history</span>
                            Security Audit Log
                        </h2>
                        {loading ? (
                            <div className="space-y-2">
                                {[1, 2, 3].map((n) => (
                                    <div key={n} className="animate-pulse h-12 bg-surface-container rounded-md w-full"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-outline-variant/20">
                                            <th className="pb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Event</th>
                                            <th className="pb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Description</th>
                                            <th className="pb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Type</th>
                                            <th className="pb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/10">
                                        {securityData?.auditLogs?.length > 0 ? (
                                            securityData.auditLogs.slice(0, 15).map((log) => (
                                                <tr key={log.id} className="hover:bg-surface-container-high/30 transition-colors">
                                                    <td className="py-4 pr-4">
                                                        <span className="text-sm font-bold text-on-surface">{log.History_Title}</span>
                                                    </td>
                                                    <td className="py-4 pr-4">
                                                        <span className="text-sm text-on-surface-variant">{log.History_Description}</span>
                                                    </td>
                                                    <td className="py-4 pr-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container-high text-on-surface">
                                                            {log.History_Type}
                                                        </span>
                                                    </td>
                                                    <td className="py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                                                            log.Status?.toLowerCase() === 'active' || log.Status?.toLowerCase() === 'success' ? 'bg-primary/10 text-primary' : 
                                                            log.Status?.toLowerCase() === 'deleted' ? 'bg-error/10 text-error' :
                                                            'bg-secondary/10 text-secondary'
                                                        }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                                log.Status?.toLowerCase() === 'active' || log.Status?.toLowerCase() === 'success' ? 'bg-primary' : 
                                                                log.Status?.toLowerCase() === 'deleted' ? 'bg-error' :
                                                                'bg-secondary'
                                                            }`}></span>
                                                            {log.Status || "Unknown"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-8 text-center text-sm text-on-surface-variant">
                                                    No audit logs found for this project yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {securityData?.auditLogs?.length > 0 && (
                            <PaginationControls 
                                currentPage={page} 
                                hasMore={securityData?.auditLogs?.length === 16} 
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

export default Security;
