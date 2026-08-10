import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { objContext } from '../App';
import DashboardLayout from './DashboardLayout';
import PaginationControls from './PaginationControls';

const Support = () => {
    const navigate = useNavigate();
    const { userCred, serverRoute } = useContext(objContext);

    useEffect(() => {
        if (!userCred) {
            navigate('/signin');
        }
    }, [userCred, navigate]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tickets, setTickets] = useState([]);
    
    const [category, setCategory] = useState("Database Connection Issue");
    const [subject, setSubject] = useState("");
    const [details, setDetails] = useState("");
    const [page, setPage] = useState(1);

    const fetchTickets = async () => {
        try {
            const res = await axios.post(`${serverRoute}/fetchSupportTickets`, { userId: userCred?.id, page: page });
            setTickets(res.data.message || []);
        } catch (error) {
            console.error("Error fetching tickets", error);
        }
    };

    useEffect(() => {
        if (userCred?.id) fetchTickets();
    }, [userCred, page]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject || !details) return alert("Please fill all fields");
        setIsSubmitting(true);
        try {
            await axios.post(`${serverRoute}/createSupportTicket`, {
                userId: userCred?.id,
                category,
                subject,
                details
            });
            setSubject("");
            setDetails("");
            fetchTickets();
            alert("Ticket submitted successfully!");
        } catch (error) {
            console.error("Error submitting ticket", error);
            alert("Failed to submit ticket.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-end mb-10">
                <div className="space-y-1">
                    <h1 className="text-display-sm text-4xl font-extrabold tracking-tight text-on-surface">Support Center</h1>
                    <p className="text-on-surface-variant text-sm font-medium">Get help from our team and view your active support tickets.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface-container p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                    <h3 className="text-xl font-bold text-on-surface mb-6">Submit a Ticket</h3>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface-variant">Issue Category</label>
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-surface-container border border-black/5 dark:border-white/5 p-3 rounded-lg border border-black/5 dark:border-white/5 text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none"
                            >
                                <option>Database Connection Issue</option>
                                <option>Billing Inquiry</option>
                                <option>Performance Degradation</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface-variant">Subject</label>
                            <input 
                                type="text" 
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Brief description of the issue" 
                                className="w-full bg-surface-container border border-black/5 dark:border-white/5 p-3 rounded-lg border border-black/5 dark:border-white/5 text-on-surface focus:outline-none focus:border-primary transition-colors" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface-variant">Details</label>
                            <textarea 
                                rows="5" 
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Please provide as much detail as possible..." 
                                className="w-full bg-surface-container border border-black/5 dark:border-white/5 p-3 rounded-lg border border-black/5 dark:border-white/5 text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
                            ></textarea>
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-on-primary py-3 rounded-lg font-bold transition-all shadow-md mt-4 disabled:opacity-50">
                            {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
                        </button>
                    </form>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-surface-container rounded-xl shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
                            <h3 className="font-bold text-on-surface">Recent Tickets</h3>
                            <button className="text-sm text-primary font-bold hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-outline-variant/10">
                            {tickets.length === 0 ? (
                                <div className="p-6 text-center text-on-surface-variant text-sm">No tickets found.</div>
                            ) : tickets.slice(0, 15).map((ticket, i) => (
                                <div key={i} className="p-4 px-6 flex justify-between items-center hover:bg-surface-container border border-black/5 dark:border-white/5 transition-colors cursor-pointer">
                                    <div>
                                        <p className="font-medium text-sm text-on-surface">{ticket.subject}</p>
                                        <p className="text-xs text-on-surface-variant mt-1">Ticket #{ticket.id} • {new Date(ticket.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                        {ticket.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {tickets?.length > 0 && (
                            <PaginationControls 
                                currentPage={page} 
                                hasMore={tickets?.length === 16} 
                                onNext={() => setPage(p => p + 1)} 
                                onPrev={() => setPage(p => Math.max(1, p - 1))} 
                            />
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-secondary to-on-secondary-container p-8 rounded-xl shadow-sm text-on-secondary relative overflow-hidden group">
                        <div className="absolute right-0 top-0 opacity-10">
                            <span className="material-symbols-outlined text-9xl">help_center</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Need immediate help?</h3>
                        <p className="text-sm text-on-secondary/80 mb-6 max-w-[80%]">Pro tier users have access to 24/7 dedicated phone support and priority routing.</p>
                        <button className="bg-white text-secondary px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                            Call Support
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Support;
