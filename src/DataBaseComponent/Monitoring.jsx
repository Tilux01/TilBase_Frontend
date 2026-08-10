import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { objContext } from '../App';
import axios from 'axios';
import PaginationControls from './PaginationControls';

const Monitoring = () => {
    const navigate = useNavigate();
    const { serverRoute, userCred, currentProjectCred } = useContext(objContext);

    useEffect(() => {
        if (!userCred) {
            navigate('/signin');
        } else if (!currentProjectCred) {
            navigate('/dashboard');
        }
    }, [userCred, currentProjectCred, navigate]);
    const [monitoringData, setMonitoringData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!userCred?.id || !currentProjectCred?.id) return;

        const fetchMonitoringData = async () => {
            try {
                const response = await axios.post(`${serverRoute}/getMonitoringData`, {
                    userId: userCred?.id,
                    Profile_Key: userCred?.Profile_Key,
                    projectId: currentProjectCred?.id,
                    projectKey: currentProjectCred?.Project_Key,
                    page: page
                });
                setMonitoringData(response.data.message);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching monitoring data:", error);
                setLoading(false);
            }
        };

        fetchMonitoringData();
        
        const interval = setInterval(fetchMonitoringData, 30000);
        return () => clearInterval(interval);
    }, [userCred, currentProjectCred, serverRoute, page]);

    
    const maxConnections = monitoringData?.metrics ? Math.max(...monitoringData.metrics.map(m => Number(m.successful_connections) + Number(m.failed_connections))) : 0;

    return (
        <div style={{ width: "100%" }}>
            <DashboardLayout>
                <div className="flex justify-between items-end mb-10">
                    <div className="space-y-1">
                        <h1 className="text-display-sm text-4xl font-extrabold tracking-tight text-on-surface">Monitoring</h1>
                        <p className="text-on-surface-variant text-sm font-medium">View real-time database metrics, alerts, and system health.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6 w-full">
                    {}
                    <div className="bg-surface-container p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                        <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">health_and_safety</span>
                            Live System Health
                        </h2>
                        
                        {loading ? (
                            <div className="animate-pulse h-20 bg-surface-container border border-black/5 dark:border-white/5 rounded-lg"></div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                                {monitoringData?.clusters?.length > 0 ? (
                                    monitoringData.clusters.map((cluster) => (
                                        <div key={cluster.id} className="flex items-center justify-between p-4 bg-surface-container border border-black/5 dark:border-white/5 rounded-lg border border-black/5 dark:border-white/5">
                                            <div>
                                                <h3 className="font-bold text-sm text-on-surface">{cluster.Cluster_Name}</h3>
                                                <p className="text-xs text-on-surface-variant mt-0.5">{cluster.Cluster_Type}</p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                                                cluster.Current_State?.toLowerCase() === 'active' ? 'bg-surface-container-highest text-primary' : 'bg-secondary/10 text-secondary'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    cluster.Current_State?.toLowerCase() === 'active' ? 'bg-primary' : 'bg-secondary'
                                                }`}></span>
                                                {cluster.Current_State || "Unknown"}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full p-6 text-center bg-surface-container border border-black/5 dark:border-white/5 rounded-lg text-sm text-on-surface-variant">
                                        No clusters deployed yet.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {}
                    <div className="bg-surface-container p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">bar_chart</span>
                                Connection Traffic (Last 7 Days)
                            </h2>
                            <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span> Success</span>
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-error"></span> Failed</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="animate-pulse h-48 bg-surface-container border border-black/5 dark:border-white/5 rounded-lg"></div>
                        ) : (
                            <div className="w-full h-64 flex items-end justify-between gap-2 md:gap-6 px-4 pb-8 pt-4 relative bg-surface-container border border-black/5 dark:border-white/5 rounded-lg border border-black/5 dark:border-white/5">
                                {}
                                <div className="absolute inset-0 flex flex-col justify-between px-4 pb-8 pt-4 pointer-events-none">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-full h-[1px] bg-outline-variant/10"></div>
                                    ))}
                                </div>

                                {monitoringData?.metrics?.length > 0 ? (
                                    monitoringData.metrics.map((day, idx) => {
                                        const successCount = Number(day.successful_connections);
                                        const failCount = Number(day.failed_connections);
                                        const total = successCount + failCount;
                                        
                                        
                                        const successHeight = maxConnections > 0 ? `${Math.max((successCount / maxConnections) * 100, successCount > 0 ? 2 : 0)}%` : '0%';
                                        const failHeight = maxConnections > 0 ? `${Math.max((failCount / maxConnections) * 100, failCount > 0 ? 2 : 0)}%` : '0%';
                                        
                                        
                                        const dateObj = new Date(day.date);
                                        const dateStr = dateObj.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });

                                        return (
                                            <div key={idx} className="relative flex flex-col justify-end items-center h-full w-full max-w-[40px] group z-10">
                                                {}
                                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-xs font-bold px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                                                    {total} Total<br/>
                                                    <span className="text-primary">{successCount} OK</span> / <span className="text-error">{failCount} ERR</span>
                                                </div>
                                                
                                                {}
                                                <div className="w-full flex flex-col justify-end rounded-t-sm overflow-hidden" style={{ height: '100%' }}>
                                                    {}
                                                    <div className="w-full bg-error transition-all duration-500 ease-out" style={{ height: failHeight }}></div>
                                                    <div className="w-full bg-primary transition-all duration-500 ease-out" style={{ height: successHeight }}></div>
                                                </div>
                                                
                                                {}
                                                <span className="absolute -bottom-6 text-[10px] font-bold text-on-surface-variant whitespace-nowrap">{dateStr}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-sm text-on-surface-variant font-medium">
                                        No connection traffic recorded in the last 7 days.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {}
                    <div className="bg-surface-container p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5 w-full overflow-hidden">
                        <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-error">notification_important</span>
                            Active Alerts
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
                                            <th className="pb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Alert</th>
                                            <th className="pb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Description</th>
                                            <th className="pb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/10">
                                        {monitoringData?.alerts?.length > 0 ? (
                                            monitoringData.alerts.slice(0, 15).map((alert) => (
                                                <tr key={alert.id} className="hover:bg-error/5 transition-colors group">
                                                    <td className="py-4 pr-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-error text-[18px]">error</span>
                                                            <span className="text-sm font-bold text-on-surface">{alert.History_Title}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 pr-4">
                                                        <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{alert.History_Description}</span>
                                                    </td>
                                                    <td className="py-4 pr-4">
                                                        <span className="text-xs font-medium text-on-surface-variant bg-surface-container border border-black/5 dark:border-white/5 px-2 py-1 rounded">
                                                            {new Date(alert.Time_Stamp).toLocaleString()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="py-8 text-center text-sm text-on-surface-variant">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <span className="material-symbols-outlined text-3xl opacity-50">check_circle</span>
                                                        All systems operating normally. No alerts.
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {monitoringData?.alerts?.length > 0 && (
                            <PaginationControls 
                                currentPage={page} 
                                hasMore={monitoringData?.alerts?.length === 16} 
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

export default Monitoring;
