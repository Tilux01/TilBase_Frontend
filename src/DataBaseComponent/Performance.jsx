import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { objContext } from '../App';
import axios from 'axios';
import { io } from 'socket.io-client';

const Performance = () => {
    const navigate = useNavigate();
    const { serverRoute, userCred, currentProjectCred } = useContext(objContext);

    useEffect(() => {
        if (!userCred) {
            navigate('/signin');
        } else if (!currentProjectCred) {
            navigate('/dashboard');
        }
    }, [userCred, currentProjectCred, navigate]);
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userCred?.id || !currentProjectCred?.id) return;

        const fetchPerformanceData = async () => {
            try {
                const response = await axios.post(`${serverRoute}/getPerformanceData`, {
                    userId: userCred?.id,
                    Profile_Key: userCred?.Profile_Key,
                    projectId: currentProjectCred?.id,
                    projectKey: currentProjectCred?.Project_Key
                });
                setPerformanceData(response.data.message);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching performance data:", error);
                setLoading(false);
            }
        };

        fetchPerformanceData();

        
        
        const urlObj = new URL(serverRoute);
        const socketUrl = `${urlObj.protocol}//${urlObj.host}`;
        
        const socket = io(socketUrl);
        socket.on("connect", () => {
            
            socket.emit("join_cluster", currentProjectCred.id); 
            
            
            
            
        });

        
        socket.on("metricUpdate", () => {
            fetchPerformanceData();
        });

        return () => {
            socket.disconnect();
        };
    }, [userCred, currentProjectCred, serverRoute]);

    const throughput = performanceData?.throughput || { read_count: 0, write_count: 0 };
    const totalOps = Number(throughput.read_count) + Number(throughput.write_count);
    const readPercentage = totalOps === 0 ? 50 : Math.round((Number(throughput.read_count) / totalOps) * 100);
    const writePercentage = 100 - readPercentage;

    
    const maxLatency = performanceData?.trend?.length > 0 
        ? Math.max(...performanceData.trend.map(t => Number(t.avg_latency))) 
        : 100;

    return (
        <div style={{ width: "100%" }}>
            <DashboardLayout>
                <div className="flex justify-between items-end mb-10">
                    <div className="space-y-1">
                        <h1 className="text-display-sm text-4xl font-extrabold tracking-tight text-on-surface">Performance</h1>
                        <p className="text-on-surface-variant text-sm font-medium">Analyze real-time query latency and throughput metrics.</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 w-full mb-6">
                    {}
                    <div className="flex-1 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                        <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary animate-pulse">radar</span>
                            Live Cluster Latency
                        </h2>
                        
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="animate-pulse h-24 bg-surface-container rounded-lg"></div>
                                <div className="animate-pulse h-24 bg-surface-container rounded-lg"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {performanceData?.clusters?.length > 0 ? (
                                    performanceData.clusters.map((cluster) => {
                                        const latency = Number(cluster.avg_latency);
                                        const isHighLatency = latency > 500;
                                        return (
                                            <div 
                                                key={cluster.id} 
                                                className={`relative overflow-hidden flex flex-col justify-center p-6 bg-surface-container rounded-lg border border-outline-variant/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isHighLatency ? 'animate-hologram' : ''}`}
                                            >
                                                {}
                                                {isHighLatency && (
                                                    <div className="absolute inset-0 bg-error/5 pointer-events-none"></div>
                                                )}
                                                <h3 className="font-bold text-sm text-on-surface z-10">{cluster.Cluster_Name}</h3>
                                                <div className="flex items-end gap-2 mt-2 z-10">
                                                    <span className={`text-3xl font-extrabold ${isHighLatency ? 'text-error' : 'text-primary'}`}>
                                                        {Math.round(latency)}<span className="text-lg opacity-70">ms</span>
                                                    </span>
                                                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-1">AVG Ping</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full p-6 text-center bg-surface-container rounded-lg text-sm text-on-surface-variant">
                                        No clusters deployed yet.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {}
                    <div className="w-full lg:w-1/3 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col items-center justify-center relative overflow-hidden">
                        <h2 className="text-xl font-bold text-on-surface mb-8 self-start w-full flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">speed</span>
                            Throughput Load
                        </h2>
                        
                        {loading ? (
                            <div className="animate-pulse w-48 h-24 bg-surface-container rounded-t-full"></div>
                        ) : (
                            <div className="relative flex flex-col items-center w-full max-w-[250px]">
                                {}
                                <div className="w-full aspect-[2/1] relative overflow-hidden flex justify-center items-end">
                                    <div className="absolute top-0 w-full aspect-square rounded-full border-[20px] border-surface-container-high"></div>
                                    
                                    {}
                                    <div 
                                        className="absolute top-0 w-full aspect-square rounded-full border-[20px] border-primary transition-transform duration-1000 ease-out origin-center"
                                        style={{ 
                                            transform: `rotate(${-180 + (readPercentage / 100) * 180}deg)`,
                                            clipPath: 'polygon(50% 50%, 100% 100%, 0 100%, 0 0, 100% 0)' 
                                        }}
                                    ></div>
                                    
                                    {}
                                    <div 
                                        className="absolute bottom-0 w-1 h-3/4 bg-on-surface origin-bottom rounded-full transition-transform duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                        style={{ transform: `rotate(${-90 + (readPercentage / 100) * 180}deg)` }}
                                    ></div>
                                    
                                    <div className="absolute bottom-[-10px] w-6 h-6 bg-surface-container-lowest rounded-full border-4 border-on-surface z-10"></div>
                                </div>
                                
                                <div className="flex justify-between w-full mt-6 text-sm font-bold text-on-surface">
                                    <span className="text-primary">{readPercentage}% Read</span>
                                    <span className="text-on-surface-variant opacity-50">|</span>
                                    <span className="text-surface-container-highest">{writePercentage}% Write</span>
                                </div>
                                <p className="text-xs text-on-surface-variant font-medium mt-2 tracking-wide uppercase">{totalOps} total queries/hr</p>
                            </div>
                        )}
                    </div>
                </div>

                {}
                <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 w-full overflow-hidden">
                    <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">waterfall_chart</span>
                        7-Day Latency Trend
                    </h2>
                    
                    {loading ? (
                        <div className="animate-pulse h-48 bg-surface-container rounded-lg w-full"></div>
                    ) : (
                        <div className="w-full h-64 flex items-end justify-around gap-2 px-4 pb-8 pt-12 relative bg-surface-container/20 rounded-lg border border-outline-variant/10">
                            {}
                            <div className="absolute inset-0 flex flex-col justify-between px-4 pb-8 pt-12 pointer-events-none">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-full h-[1px] bg-outline-variant/10"></div>
                                ))}
                            </div>

                            {performanceData?.trend?.length > 0 ? (
                                performanceData.trend.map((day, idx) => {
                                    const latency = Number(day.avg_latency);
                                    const heightPercent = maxLatency > 0 ? Math.max((latency / maxLatency) * 100, 5) : 0;
                                    const dateObj = new Date(day.date);
                                    const dateStr = dateObj.toLocaleDateString(undefined, { weekday: 'short' });

                                    return (
                                        <div key={idx} className="relative flex flex-col justify-end items-center h-full w-full max-w-[60px] group z-10">
                                            {}
                                            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-2 bg-inverse-surface text-inverse-on-surface text-xs font-bold px-3 py-1.5 rounded shadow-[0_0_15px_rgba(255,255,255,0.2)] whitespace-nowrap pointer-events-none z-20">
                                                {Math.round(latency)} ms
                                            </div>
                                            
                                            {}
                                            <div 
                                                className="w-full bg-primary/80 group-hover:bg-primary transition-all duration-300 rounded-t-md animate-waterfall relative overflow-hidden" 
                                                style={{ 
                                                    height: `${heightPercent}%`,
                                                    animationDelay: `${idx * 0.1}s` 
                                                }}
                                            >
                                                {}
                                                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000"></div>
                                            </div>
                                            
                                            <span className="absolute -bottom-6 text-[11px] font-bold text-on-surface-variant uppercase">{dateStr}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-sm text-on-surface-variant font-medium">
                                    No latency data recorded in the last 7 days.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </div>
    );
};

export default Performance;
