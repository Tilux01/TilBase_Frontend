import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout'
import { objContext } from '../App'
import axios from 'axios'
import PaginationControls from './PaginationControls'

const DataAccess = () => {
    const navigate = useNavigate();
    const { serverRoute, userCred, currentProjectCred } = useContext(objContext);

    useEffect(() => {
        if (!userCred) {
            navigate('/signin');
        } else if (!currentProjectCred) {
            navigate('/dashboard');
        }
    }, [userCred, currentProjectCred, navigate]);
    const [dbUsers, setDbUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('Read/Write');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (userCred?.id && currentProjectCred?.id) {
            fetchDbUsers();
        }
    }, [userCred, currentProjectCred, page]);

    const fetchDbUsers = async () => {
        try {
            const response = await axios.post(`${serverRoute}/fetchDbUsers`, {
                userId: userCred?.id,
                Profile_Key: userCred?.Profile_Key,
                projectId: currentProjectCred?.id,
                projectKey: currentProjectCred?.Project_Key,
                page: page
            });
            setDbUsers(response.data.message);
        } catch (err) {
            console.error("Error fetching db users:", err);
        }
    }

    const addDbUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${serverRoute}/addDbUser`, {
                userId: userCred?.id,
                Profile_Key: userCred?.Profile_Key,
                projectId: currentProjectCred?.id,
                projectKey: currentProjectCred?.Project_Key,
                DB_Username: newUsername,
                DB_Password: newPassword,
                Role: newRole
            });
            setIsModalOpen(false);
            setNewUsername('');
            setNewPassword('');
            setNewRole('Read/Write');
            fetchDbUsers();
        } catch (err) {
            console.error("Error adding db user:", err);
        }
    }

    const deleteDbUser = async (dbUserId) => {
        try {
            await axios.post(`${serverRoute}/deleteDbUser`, {
                userId: userCred?.id,
                Profile_Key: userCred?.Profile_Key,
                projectId: currentProjectCred?.id,
                projectKey: currentProjectCred?.Project_Key,
                dbUserId: dbUserId
            });
            fetchDbUsers();
        } catch (err) {
            console.error("Error deleting db user:", err);
        }
    }

    const filteredDbUsers = dbUsers?.filter(user => user.DB_Username.toLowerCase().includes(searchQuery.toLowerCase())) || [];

    return (
        <DashboardLayout>
            <div className="flex justify-between items-end mb-10">
                <div className="space-y-1">
                    <h1 className="text-display-sm text-4xl font-extrabold tracking-tight text-on-surface">Database Access</h1>
                    <p className="text-on-surface-variant text-sm font-medium">Create and manage database credentials for your applications.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-lg shadow-primary/10 hover:opacity-90 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-base">person_add</span>
                    Add New User
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-surface-container-lowest p-6 rounded-xl w-[450px] shadow-2xl border border-outline-variant/20">
                        <h3 className="text-xl font-bold mb-4 text-on-surface">Create Database User</h3>
                        <form onSubmit={addDbUser}>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">Username</label>
                                <input className="w-full px-4 py-2.5 bg-surface-container rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm text-on-surface technical-mono" placeholder="e.g. app-user" value={newUsername} onChange={e=>setNewUsername(e.target.value)} required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">Password</label>
                                <input className="w-full px-4 py-2.5 bg-surface-container rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm text-on-surface technical-mono" placeholder="Secure Password" type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required />
                            </div>
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">Role / Privilege</label>
                                <select className="w-full bg-surface-container rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary outline-none appearance-none font-medium" value={newRole} onChange={e=>setNewRole(e.target.value)}>
                                    <option value="Read/Write">Read and write to any database</option>
                                    <option value="Read Only">Read only access to any database</option>
                                    <option value="Admin">Atlas admin (Full administrative access)</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={()=>setIsModalOpen(false)} className="px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container transition-all font-semibold">Cancel</button>
                                <button type="submit" className="px-4 py-2.5 rounded-lg text-sm bg-primary text-white font-bold hover:opacity-90 transition-all shadow-md shadow-primary/20">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
                <div className="px-6 py-5 border-b border-surface-container-high flex justify-between items-center">
                    <h2 className="text-lg font-bold text-on-surface">Database Users</h2>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-sm">search</span>
                        <input 
                            className="pl-9 pr-4 py-2 bg-surface-container rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none border-none" 
                            placeholder="Filter by username..." 
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
                                <th className="px-6 py-4">Username</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Authentication</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-low">
                            {filteredDbUsers?.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-sm text-on-surface-variant font-medium">
                                        No database users found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredDbUsers?.slice(0, 15).map((user) => (
                                    <tr key={user.id} className="hover:bg-surface-container/30 transition-colors group">
                                        <td className="px-6 py-5 font-mono text-sm font-medium text-primary flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined text-sm">person</span>
                                            </div>
                                            {user.DB_Username}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-on-surface font-medium">
                                            {user.Role}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant text-xs font-bold">
                                                <span className="material-symbols-outlined text-[10px]">password</span>
                                                SCRAM-SHA-1
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => deleteDbUser(user.id)} className="text-slate-400 hover:text-error transition-colors px-2">
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {filteredDbUsers?.length > 0 && (
                    <PaginationControls 
                        currentPage={page} 
                        hasMore={dbUsers?.length === 16} 
                        onNext={() => setPage(p => p + 1)} 
                        onPrev={() => setPage(p => Math.max(1, p - 1))} 
                    />
                )}
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-high/40 p-6 rounded-xl border border-outline-variant/10">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined">security</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-on-surface mb-2">Secure Connection Strings</h4>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                Never hardcode your database credentials in your application. Use environment variables and connect via standard driver URIs. You can find your connection string on the clusters page.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-high/40 p-6 rounded-xl border border-outline-variant/10">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined">vpn_key</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-on-surface mb-2">IAM Authentication</h4>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                TIlBase supports IAM roles for more fine-grained, passwordless authentication. Enable this in the Security settings to delegate authentication to your cloud provider.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default DataAccess
