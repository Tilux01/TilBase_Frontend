import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { objContext } from '../App';
import DocumentExplorer from './DocumentExplorer';
import VectorExplorer from './VectorExplorer';
import FlatExplorer from './FlatExplorer';
import HierarchicalExplorer from './HierarchicalExplorer';
import GraphExplorer from './GraphExplorer';
import RealtimeExplorer from './RealtimeExplorer';
import ChatbaseExplorer from './ChatbaseExplorer';
import BroadcastExplorer from './BroadcastExplorer';

const DataExplorer = () => {
    const { clusterId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { userCred, currentProjectCred } = useContext(objContext);
    const [cluster, setCluster] = useState(location.state?.cluster || null);
    console.log("Current Cluster Type:", cluster?.Cluster_Type);

    useEffect(() => {
        if (!userCred) {
            navigate('/signin');
        } else if (!currentProjectCred) {
            navigate('/dashboard');
        } else if (!cluster) {
            
            
            navigate('/clusters');
        }
    }, [userCred, currentProjectCred, cluster, navigate]);

    if (!cluster) return null;

    const renderExplorer = () => {
        
        if (cluster.Cluster_Type?.toLowerCase() === 'document' || !cluster.Cluster_Type) {
            return <DocumentExplorer cluster={cluster} />;
        }
        
        
        if (cluster.Cluster_Type?.toLowerCase() === 'vector') {
            return <VectorExplorer cluster={cluster} />;
        }
        
        
        if (cluster.Cluster_Type?.toLowerCase() === 'flat') {
            return <FlatExplorer cluster={cluster} />;
        }
        
        if (cluster.Cluster_Type?.toLowerCase() === 'hierarchical') {
            return <HierarchicalExplorer cluster={cluster} />;
        }
        
        if (cluster.Cluster_Type?.toLowerCase().trim() === 'graph') {
            return <GraphExplorer cluster={cluster} />;
        }
        
        if (cluster.Cluster_Type?.toLowerCase() === 'realtime') {
            return <RealtimeExplorer cluster={cluster} />;
        }
        
        if (cluster.Cluster_Type?.toLowerCase() === 'chatbase') {
            return <ChatbaseExplorer cluster={cluster} />;
        }
        
        if (cluster.Cluster_Type?.toLowerCase() === 'chatbase_broadcast') {
            return <BroadcastExplorer cluster={cluster} />;
        }
        
        
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-primary-container text-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <span className="material-symbols-outlined text-4xl">construction</span>
                </div>
                <h1 className="text-3xl font-black text-on-surface mb-3 tracking-tight">
                    {cluster.Cluster_Type} Explorer Coming Soon
                </h1>
                <p className="text-on-surface-variant max-w-md font-medium mb-8">
                    We are currently building the specialized Data Explorer interface for {cluster.Cluster_Type} clusters. Check back later!
                </p>
                <Link to="/clusters">
                    <button className="bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-bold hover:bg-surface-container-highest transition-colors shadow-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Clusters
                    </button>
                </Link>
            </div>
        );
    };

    return (
        <div className="w-full min-h-screen bg-background">
            {renderExplorer()}
        </div>
    );
};

export default DataExplorer;
