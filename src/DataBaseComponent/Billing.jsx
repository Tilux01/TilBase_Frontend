import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { objContext } from '../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PaginationControls from './PaginationControls';

const Billing = () => {
    const { userCred, userPlan, serverRoute, AllProject } = useContext(objContext);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userCred) {
            navigate("/signin");
            return;
        }
        
        
        axios.post(`${serverRoute}/fetchInvoices`, { user_id: userCred.id, page: page })
            .then(res => {
                setInvoices(res.data.invoices || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [userCred, serverRoute, navigate, page]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const projectCount = AllProject ? AllProject.length : 0;
    const projectLimit = userPlan?.Highest_Project || 1;
    const usagePercent = Math.min(100, Math.round((projectCount / projectLimit) * 100));

    return (
        <DashboardLayout>
            <div className="flex justify-between items-end mb-10">
                <div className="space-y-1">
                    <h1 className="text-display-sm text-4xl font-extrabold tracking-tight text-on-surface">Billing & Usage</h1>
                    <p className="text-on-surface-variant text-sm font-medium">Manage your subscription, payment methods, and view invoice history.</p>
                </div>
                {userPlan?.Plan_Name !== 'premium' && (
                    <button onClick={() => navigate('/payment')} className="bg-primary hover:bg-primary/90 text-on-primary px-5 py-2.5 rounded-lg font-bold transition-all shadow-md">
                        Upgrade Plan
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-xl shadow-sm text-on-primary relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    <h3 className="text-on-primary/80 font-medium mb-1">Current Plan</h3>
                    <p className="text-3xl font-bold mb-4 capitalize">{userPlan?.Plan_Name || 'Free'} Tier</p>
                    <p className="text-sm text-on-primary/70 mb-6">Billed ${userPlan?.plan_price || 0}/month</p>
                    <div className="w-full bg-black/20 rounded-full h-2 mb-2">
                        <div className={`bg-white rounded-full h-2`} style={{ width: `${usagePercent}%` }}></div>
                    </div>
                    <p className="text-xs text-on-primary/80">{usagePercent}% of project limit used ({projectCount}/{projectLimit})</p>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-center">
                    <h3 className="text-on-surface-variant font-medium mb-1">Next Invoice</h3>
                    <p className="text-3xl font-bold text-on-surface mb-2">${userPlan?.plan_price || 0}.00</p>
                    <p className="text-sm text-on-surface-variant mb-4">Due on 1st of next month</p>
                    <button className="text-primary font-bold text-sm text-left hover:underline w-max">Manage Payment Method →</button>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-8 bg-surface-container rounded border border-outline-variant flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">account_balance</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-on-surface">Manual Invoicing</p>
                            <p className="text-xs text-on-surface-variant">Default Payment Method</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/payment')} className="text-primary font-bold text-sm text-left hover:underline w-max">Change Method →</button>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
                <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
                    <h3 className="font-bold text-on-surface">Invoice History</h3>
                    <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">Live Data</span>
                </div>
                <div className="divide-y divide-outline-variant/10">
                    {loading ? (
                        <div className="p-8 text-center text-on-surface-variant">Loading invoices...</div>
                    ) : invoices.length === 0 ? (
                        <div className="p-8 text-center text-on-surface-variant">No invoices found.</div>
                    ) : (
                        invoices.slice(0, 15).map((invoice) => (
                            <div key={invoice.id} className="p-4 px-6 flex justify-between items-center hover:bg-surface-container/50 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-on-surface-variant/50 group-hover:text-primary transition-colors">receipt_long</span>
                                    <div>
                                        <p className="font-medium text-sm text-on-surface uppercase">Invoice #INV-{invoice.id.toString().padStart(6, '0')}</p>
                                        <p className="text-xs text-on-surface-variant">{formatDate(invoice.created_at)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="font-bold text-sm text-on-surface">${Number(invoice.amount).toFixed(2)}</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">{invoice.status}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {invoices?.length > 0 && (
                    <PaginationControls 
                        currentPage={page} 
                        hasMore={invoices?.length === 16} 
                        onNext={() => setPage(p => p + 1)} 
                        onPrev={() => setPage(p => Math.max(1, p - 1))} 
                    />
                )}
            </div>
        </DashboardLayout>
    );
};

export default Billing;
