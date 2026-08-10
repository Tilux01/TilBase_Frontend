import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { objContext } from '../App';
import PaginationControls from '../DataBaseComponent/PaginationControls';

const AdminPortal = () => {
    const { serverRoute } = useContext(objContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    
    const [tickets, setTickets] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(1);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        try {
            const res = await axios.post(`${serverRoute}/adminSignIn`, { email, password });
            if (res.status === 200) {
                setIsAuthenticated(true);
                fetchTickets();
            }
        } catch (error) {
            console.error("Login failed", error);
            alert("Invalid admin credentials.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    const fetchTickets = async () => {
        setIsFetching(true);
        try {
            const res = await axios.post(`${serverRoute}/fetchAllSupportTickets`, { page });
            setTickets(res.data.message || []);
        } catch (error) {
            console.error("Error fetching tickets", error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchTickets();
        }
    }, [page, isAuthenticated]);

    const updateStatus = async (ticketId, newStatus) => {
        try {
            await axios.post(`${serverRoute}/updateTicketStatus`, { ticketId, status: newStatus });
            fetchTickets();
        } catch (error) {
            console.error("Error updating status", error);
            alert("Failed to update status.");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-surface-container-highestest p-8 rounded-2xl shadow-xl border border-black/5 dark:border-white/5">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-on-surface">Admin Portal</h1>
                        <p className="text-on-surface-variant text-sm mt-2">Sign in to manage support tickets</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface-variant">Email</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-surface-container p-3 rounded-lg border border-black/5 dark:border-white/5 text-on-surface focus:outline-none focus:border-primary transition-colors" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface-variant">Password</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-surface-container p-3 rounded-lg border border-black/5 dark:border-white/5 text-on-surface focus:outline-none focus:border-primary transition-colors" 
                            />
                        </div>
                        <button type="submit" disabled={isLoggingIn} className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50">
                            {isLoggingIn ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-on-surface">Support Admin Dashboard</h1>
                        <p className="text-on-surface-variant text-sm mt-2">Manage all incoming support requests.</p>
                    </div>
                    <button onClick={fetchTickets} className="px-4 py-2 bg-surface-container border border-black/5 dark:border-white/5 rounded-lg text-sm font-bold hover:bg-surface-container-high transition-colors">
                        {isFetching ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>

                <div className="bg-surface-container-highestest rounded-2xl shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-black/5 dark:border-white/5 bg-surface-container">
                                    <th className="p-4 text-sm font-bold text-on-surface-variant">Ticket ID</th>
                                    <th className="p-4 text-sm font-bold text-on-surface-variant">User ID</th>
                                    <th className="p-4 text-sm font-bold text-on-surface-variant">Category</th>
                                    <th className="p-4 text-sm font-bold text-on-surface-variant">Subject</th>
                                    <th className="p-4 text-sm font-bold text-on-surface-variant">Details</th>
                                    <th className="p-4 text-sm font-bold text-on-surface-variant">Status</th>
                                    <th className="p-4 text-sm font-bold text-on-surface-variant text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {tickets.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-on-surface-variant">No support tickets found.</td>
                                    </tr>
                                ) : tickets.slice(0, 15).map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-surface-container transition-colors">
                                        <td className="p-4 font-mono text-sm">#{ticket.id}</td>
                                        <td className="p-4 text-sm">{ticket.user_id}</td>
                                        <td className="p-4 text-sm"><span className="bg-surface-container px-2 py-1 rounded text-xs">{ticket.category}</span></td>
                                        <td className="p-4 text-sm font-medium">{ticket.subject}</td>
                                        <td className="p-4 text-xs max-w-xs truncate text-on-surface-variant" title={ticket.details}>{ticket.details}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' : ticket.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {ticket.status === 'open' ? (
                                                <button onClick={() => updateStatus(ticket.id, 'resolved')} className="text-xs bg-primary text-on-primary px-3 py-1.5 rounded font-bold hover:brightness-110">
                                                    Mark Resolved
                                                </button>
                                            ) : (
                                                <button onClick={() => updateStatus(ticket.id, 'open')} className="text-xs bg-surface-container text-on-surface px-3 py-1.5 rounded font-bold hover:bg-surface-container-high">
                                                    Reopen
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {tickets?.length > 0 && (
                        <div className="p-4 border-t border-black/5 dark:border-white/5">
                            <PaginationControls 
                                currentPage={page} 
                                hasMore={tickets?.length === 16} 
                                onNext={() => setPage(p => p + 1)} 
                                onPrev={() => setPage(p => Math.max(1, p - 1))} 
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPortal;
