import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout'
import { objContext } from '../App'
import axios from 'axios'
import PaginationControls from './PaginationControls'

const NetworkAccess = () => {
    const navigate = useNavigate();
    const { serverRoute, userCred, currentProjectCred } = useContext(objContext);

    useEffect(() => {
        if (!userCred) {
            navigate('/signin');
        } else if (!currentProjectCred) {
            navigate('/dashboard');
        }
    }, [userCred, currentProjectCred, navigate]);
    const [rules, setRules] = useState([]);
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newIp, setNewIp] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [currentIp, setCurrentIp] = useState('Loading...');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Fetch user's actual IP
        axios.get('https://api.ipify.org?format=json')
            .then(res => setCurrentIp(res.data.ip))
            .catch(err => {
                console.error("Error fetching IP:", err);
                setCurrentIp("Unknown");
            });
    }, []);

    useEffect(() => {
        if (userCred?.id && currentProjectCred?.id) {
            fetchRules();
        }
    }, [userCred, currentProjectCred, page]);

    const fetchRules = async () => {
        try {
            const response = await axios.post(`${serverRoute}/fetchNetworkRules`, {
                userId: userCred?.id,
                Profile_Key: userCred?.Profile_Key,
                projectId: currentProjectCred?.id,
                projectKey: currentProjectCred?.Project_Key,
                page: page
            });
            setRules(response.data.message);
        } catch (err) {
            console.error("Error fetching rules:", err);
        }
    }

    const addRule = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${serverRoute}/addNetworkRule`, {
                userId: userCred?.id,
                Profile_Key: userCred?.Profile_Key,
                projectId: currentProjectCred?.id,
                projectKey: currentProjectCred?.Project_Key,
                IP_Address: newIp,
                Description: newDesc
            });
            setIsModalOpen(false);
            setNewIp('');
            setNewDesc('');
            fetchRules();
        } catch (err) {
            console.error("Error adding rule:", err);
        }
    }

    const deleteRule = async (ruleId) => {
        try {
            await axios.post(`${serverRoute}/deleteNetworkRule`, {
                userId: userCred?.id,
                Profile_Key: userCred?.Profile_Key,
                projectId: currentProjectCred?.id,
                projectKey: currentProjectCred?.Project_Key,
                ruleId: ruleId
            });
            fetchRules();
        } catch (err) {
            console.error("Error deleting rule:", err);
        }
    }

    const filteredRules = rules?.filter(rule => 
        rule.IP_Address.toLowerCase().includes(searchQuery.toLowerCase()) || 
        rule.Description.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <>
            <DashboardLayout>
                <div className="flex justify-between items-end mb-10">
                    <div className="space-y-1">
                        <h1 className="text-display-sm text-4xl font-extrabold tracking-tight text-on-surface">Network Access</h1>
                        <p className="text-on-surface-variant text-sm font-medium">Configure network security rules and connectivity for your database fleet.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-lg shadow-primary/10 hover:opacity-90 active:scale-95 transition-all">
                        <span className="material-symbols-outlined text-base">add</span>
                        Add IP Address
                    </button>
                </div>
                
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-surface-container-lowest p-6 rounded-xl w-[400px] shadow-2xl border border-outline-variant/20">
                            <h3 className="text-xl font-bold mb-4 text-on-surface">Add IP Address</h3>
                            <form onSubmit={addRule}>
                                <input className="w-full mb-3 px-4 py-2.5 bg-surface-container rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm text-on-surface technical-mono" placeholder="IP Address (e.g. 192.168.1.0/24)" value={newIp} onChange={e=>setNewIp(e.target.value)} required />
                                {newIp === '0.0.0.0/0' && (
                                    <div className="mb-3 px-3 py-2 bg-tertiary-fixed/30 rounded-lg border border-tertiary/30 flex items-start gap-2">
                                        <span className="material-symbols-outlined text-tertiary text-sm mt-0.5">warning</span>
                                        <p className="text-xs text-tertiary font-medium">
                                            <strong>Warning:</strong> This will allow access from anywhere on the internet. This is highly insecure and only recommended for temporary testing.
                                        </p>
                                    </div>
                                )}
                                <input className="w-full mb-6 px-4 py-2.5 bg-surface-container rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm text-on-surface" placeholder="Description" value={newDesc} onChange={e=>setNewDesc(e.target.value)} required />
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={()=>setIsModalOpen(false)} className="px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container transition-all font-semibold">Cancel</button>
                                    <button type="submit" className="px-4 py-2.5 rounded-lg text-sm bg-primary text-white font-bold hover:opacity-90 transition-all shadow-md shadow-primary/20">Add Rule</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="flex gap-2 mb-8 bg-surface-container-low p-1 rounded-xl inline-flex">
                    <button className="px-6 py-2 bg-surface-container-lowest shadow-sm text-primary font-semibold rounded-lg text-sm transition-all">IP Access List</button>
                    <button className="px-6 py-2 text-on-surface-variant hover:text-on-surface font-medium rounded-lg text-sm transition-all">VPC Peering</button>
                    <button className="px-6 py-2 text-on-surface-variant hover:text-on-surface font-medium rounded-lg text-sm transition-all">Private Endpoints</button>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 md:col-span-4 h-full">
                        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col justify-between h-full relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 text-primary/5 material-symbols-outlined text-9xl pointer-events-none">public</div>
                            <div className="space-y-4 relative z-10">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">location_on</span>
                                </div>
                                <div>
                                    <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Current Detection</p>
                                    <h3 className="text-on-surface text-lg font-bold leading-tight">Your current IP is <span className="technical-mono text-primary">{currentIp}</span></h3>
                                    <p className="text-on-surface-variant text-sm mt-2">Connect from this device by adding your IP to the allow list for secure access.</p>
                                </div>
                            </div>
                            <button onClick={() => { setNewIp(currentIp !== "Unknown" && currentIp !== "Loading..." ? currentIp : ""); setNewDesc("My Current IP"); setIsModalOpen(true); }} className="mt-8 bg-surface-container-high text-on-primary-fixed-variant px-4 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all">
                                <span className="material-symbols-outlined text-sm">security</span>
                                Add to allow list
                            </button>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-8">
                        <div className="bg-surface-container-high/40 p-8 rounded-xl flex flex-col md:flex-row gap-8 items-center border border-white/40 shadow-inner">
                            <div className="flex-1 space-y-4">
                                <h4 className="text-xl font-bold text-on-surface tracking-tight">Initiate VPC Peering</h4>
                                <p className="text-on-surface-variant text-sm max-w-md">Connect your cloud infrastructure directly to TIlBase through private networking. No public internet exposure.</p>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">Cloud Provider</label>
                                        <select className="w-full bg-surface-container-lowest border-outline-variant/30 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary outline-none appearance-none">
                                            <option>Amazon Web Services (AWS)</option>
                                            <option>Google Cloud Platform (GCP)</option>
                                            <option>Microsoft Azure</option>
                                        </select>
                                    </div>
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">VPC ID</label>
                                        <input className="technical-mono w-full bg-surface-container-lowest border-outline-variant/30 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="vpc-0a1b2c3d4e" type="text" />
                                    </div>
                                </div>
                            </div>
                            <button className="bg-primary text-white h-fit self-end mb-1 px-8 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                Initiate Peering
                            </button>
                        </div>
                    </div>
                    <div className="col-span-12 mt-4">
                        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
                            <div className="px-6 py-5 border-b border-surface-container-high flex justify-between items-center">
                                <h2 className="text-lg font-bold text-on-surface">IP Access Rules</h2>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-sm">search</span>
                                    <input 
                                        className="pl-9 pr-4 py-2 bg-surface-container rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none border-none" 
                                        placeholder="Filter by IP or Description..." 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-surface-container-low text-on-surface-variant uppercase text-[10px] font-bold tracking-widest">
                                            <th className="px-6 py-4">IP Address / CIDR</th>
                                            <th className="px-6 py-4">Description</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-container-low">
                                        {filteredRules?.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-sm text-on-surface-variant font-medium">
                                                    No IP rules found matching your criteria.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredRules?.slice(0, 15).map((rule) => (
                                                <tr key={rule.id} className="hover:bg-surface-container/30 transition-colors">
                                                    <td className="px-6 py-5 font-mono text-sm font-medium text-primary">{rule.IP_Address}</td>
                                                    <td className="px-6 py-5 text-sm text-on-surface-variant font-medium">{rule.Description}</td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex justify-center">
                                                            {rule.IP_Address === '0.0.0.0/0' ? (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-tertiary text-xs font-bold">
                                                                    <span className="material-symbols-outlined text-xs">warning</span>
                                                                    Active (Public)
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-primary-fixed-variant text-xs font-bold">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                                                    {rule.Status}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <button onClick={() => deleteRule(rule.id)} className="text-slate-400 hover:text-error transition-colors ml-4">
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {filteredRules?.length > 0 && (
                                <PaginationControls 
                                    currentPage={page} 
                                    hasMore={rules?.length === 16} 
                                    onNext={() => setPage(p => p + 1)} 
                                    onPrev={() => setPage(p => Math.max(1, p - 1))} 
                                />
                            )}
                        </div>
                    </div>
                    <div className="col-span-12 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-surface-container-high/50 p-6 rounded-xl border border-outline-variant/10">
                                <span className="material-symbols-outlined text-primary mb-3">cloud_sync</span>
                                <h5 className="font-bold text-on-surface mb-1">Global Replication</h5>
                                <p className="text-xs text-on-surface-variant leading-relaxed">Network policies are synchronized across all regions within 30 seconds of modification.</p>
                            </div>
                            <div className="bg-surface-container-high/50 p-6 rounded-xl border border-outline-variant/10">
                                <span className="material-symbols-outlined text-primary mb-3">verified_user</span>
                                <h5 className="font-bold text-on-surface mb-1">Zero Trust Logic</h5>
                                <p className="text-xs text-on-surface-variant leading-relaxed">Traffic is denied by default. Explicit allow rules are required for all CIDR blocks.</p>
                            </div>
                            <div className="bg-surface-container-high/50 p-6 rounded-xl border border-outline-variant/10">
                                <span className="material-symbols-outlined text-primary mb-3">analytics</span>
                                <h5 className="font-bold text-on-surface mb-1">Audit Logging</h5>
                                <p className="text-xs text-on-surface-variant leading-relaxed">Every modification and access attempt is logged for compliance and security auditing.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    )
}

export default NetworkAccess
