import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from './DashboardLayout'
import userIcon from "../Images/user.png"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { objContext } from '../App'
import PaginationControls from './PaginationControls'
import CopyButton from './CopyButton'


const Clusters = () => {
 const navigate = useNavigate()
 const [clusters, setClusters] = useState([])
 const [page, setPage] = useState(1)
 const { userCred, serverRoute, currentProjectCred, userPlan, globalSearch } = useContext(objContext)

 useEffect(() => {
 if (!userCred) {
 navigate('/signin');
 } else if (!currentProjectCred) {
 navigate('/dashboard');
 }
 }, [userCred, currentProjectCred, navigate]);
 
 const filteredClusters = clusters.filter(c => (c.Cluster_Name || '').toLowerCase().includes((globalSearch || '').toLowerCase()))

 useEffect(() => {
 if (userCred?.id && currentProjectCred?.id) {
 axios.post(`${serverRoute}/fetchClusters`, {
 userId: userCred?.id,
 Profile_Key: userCred?.Profile_Key,
 projectId: currentProjectCred?.id,
 projectKey: currentProjectCred?.Project_Key,
 page: page
 })
 .then((output) => {
 console.log(output?.data?.message);
 setClusters(output?.data?.message || [])
 })
 .catch((error) => {
 if (error?.response?.data?.message) {
 alert(error?.response?.data?.message)
 }
 navigate("/signin")
 })
 }
 }, [currentProjectCred, userCred, page])

 const pauseCluster = (obj) => {
 console.log(obj);
 axios.post(`${serverRoute}/pauseCluster`, {
 user_Id: userCred?.id,
 user_key: userCred?.Profile_Key,
 ProjectId: currentProjectCred?.id,
 project_key: currentProjectCred?.Project_Key,
 cluster_Key: obj?.Cluster_Key,
 cluster_Password: obj?.Cluster_Password,
 cluster_id: obj?.id
 })
 .then((output) => {
 const result = output.data?.message
 console.log(result);
 setClusters(prev => prev.map((cluster, index) => {
 if (result?.id == cluster?.id && result?.Cluster_Key == cluster?.Cluster_Key) {
 return result
 }
 return cluster
 }))
 })
 .catch((error) => {
 console.log(error?.response);
 alert("Error updating cluster")
 navigate("/signin")
 })
 }

 const resumeCluster = (obj) => {
 console.log(obj);
 axios.post(`${serverRoute}/resumeCluster`, {
 user_Id: userCred?.id,
 user_key: userCred?.Profile_Key,
 ProjectId: currentProjectCred?.id,
 project_key: currentProjectCred?.Project_Key,
 cluster_Key: obj?.Cluster_Key,
 cluster_Password: obj?.Cluster_Password,
 cluster_id: obj?.id
 })
 .then((output) => {
 const result = output.data?.message
 console.log(result);
 setClusters(prev => prev.map((cluster, index) => {
 if (result?.id == cluster?.id && result?.Cluster_Key == cluster?.Cluster_Key) {
 return result
 }
 return cluster
 }))
 })
 .catch((error) => {
 console.log(error?.response);
 alert("Error updating cluster")
 navigate("/signin")
 })
 }

 const deleteCluster = (obj) => {
 console.log(obj);
 const confirmDelete = confirm(`Do you want to delete cluster ${obj?.Cluster_Name}`)
 if (!confirmDelete) return
 axios.post(`${serverRoute}/deleteCluster`, {
 user_Id: userCred?.id,
 user_key: userCred?.Profile_Key,
 ProjectId: currentProjectCred?.id,
 project_key: currentProjectCred?.Project_Key,
 cluster_Key: obj?.Cluster_Key,
 cluster_Password: obj?.Cluster_Password,
 cluster_id: obj?.id
 })
 .then((output) => {
 const result = output.data?.message
 console.log(result);
 setClusters(prev => prev.filter(cluster => cluster?.id != result))
 })
 .catch((error) => {
 console.log(error?.response);
 alert("Error updating cluster")
 navigate("/signin")
 })
 }


 return (
 <div style={{ width: "100%" }}>
 <DashboardLayout>
 {/* Updated Header aligned with NetworkAccess style */}
 <div className="flex justify-between items-end mb-10">
 <div className="space-y-1">
 <h1 className="text-display-sm text-4xl font-extrabold tracking-tight text-on-surface">Clusters</h1>
 <p className="text-on-surface-variant text-sm font-medium">Manage and monitor your database infrastructure clusters.</p>
 </div>
 <Link to="/new_cluster">
 <button className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-lg shadow-primary/10 hover:opacity-90 active:scale-95 transition-all">
 <span className="material-symbols-outlined text-base">add</span>
 Add New Cluster
 </button>
 </Link>
 </div>



 <div className="flex flex-col gap-4 w-full">
 {/* Global Storage Limit Bar */}
 <div className="w-full bg-surface-container border border-black/5 dark:border-white/5 p-5 rounded-xl flex flex-col gap-3">
 <div className="flex justify-between items-center text-sm font-bold">
 <span className="text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[18px]">cloud</span> Account Storage Quota</span>
 <span className="text-on-surface technical-mono">
 {(() => {
 const totalUsed = clusters.reduce((acc, curr) => acc + (curr.space_used || 0), 0);
 const formatBytes = (bytes) => {
 if (bytes === 0) return '0 B';
 if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
 if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
 if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
 return bytes + ' B';
 };
 const limitBytes = (userPlan?.Cloud_Storage || 1) * 1024 * 1024;
 return `${formatBytes(totalUsed)} / ${formatBytes(limitBytes)}`;
 })()}
 </span>
 </div>
 <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
 {(() => {
 const totalUsed = clusters.reduce((acc, curr) => acc + (curr.space_used || 0), 0);
 const limitBytes = (userPlan?.Cloud_Storage || 1) * 1024 * 1024;
 const percent = Math.min((totalUsed / limitBytes) * 100, 100);
 const barColor = percent > 90 ? 'bg-error' : percent > 75 ? 'bg-warning' : 'bg-primary';
 return <div className={`h-full rounded-full transition-all duration-1000 ${barColor}`} style={{ width: `${percent}%` }}></div>;
 })()}
 </div>
 </div>

 {
 filteredClusters?.slice(0, 15).map((output, index) => {
 return (
 <div key={index} className="w-full bg-surface-container border border-black/5 dark:border-white/5 p-5 rounded-xl hover:bg-surface-container-highest transition-all group flex flex-col lg:flex-row lg:items-center gap-6 relative overflow-hidden">
 <div className="absolute right-0 top-0 text-primary/5 material-symbols-outlined text-9xl pointer-events-none transition-transform group-hover:scale-110 group-hover:text-primary/10 translate-x-1/4 -translate-y-1/4">dns</div>

 {/* Left: Identity */}
 <div className="flex items-center gap-4 min-w-[240px] relative z-10">
 <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
 <span className="material-symbols-outlined text-2xl">dns</span>
 </div>
 <div>
 <h2 className="text-lg font-bold text-on-surface leading-tight">{output?.Cluster_Name}</h2>
 <div className="flex flex-wrap items-center gap-2 mt-1.5">
 <span style={{ textTransform: "capitalize" }} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-surface-container border border-black/5 dark:border-white/5 text-on-primary-fixed-variant">
 <span style={{ textTransform: "capitalize" }} className={`h-1.5 w-1.5 rounded-full ${output?.Current_State === 'active' ? 'bg-primary' : 'bg-error'}`}></span>
 {output?.Current_State}
 </span>
 <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-secondary/10 text-secondary capitalize">
 <span className="material-symbols-outlined text-[12px]">
 {output?.Cluster_Type?.toLowerCase() === 'graph' ? 'bar_chart' : output?.Cluster_Type?.toLowerCase() === 'vector' ? 'scatter_plot' : 'data_object'}
 </span>
 {output?.Cluster_Type} DB
 </span>
 <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{currentProjectCred?.Server_Region} / {currentProjectCred?.Server_Name}</span>
 </div>
 <span className="text-[10px] technical-mono text-on-surface-variant/60 block mt-1">ID: {output?.Cluster_Key}</span>
 </div>
 </div>

 {/* Middle: Stats */}
 <div className="flex-1 grid grid-cols-1 gap-8 relative z-10">
 <div className="flex flex-col justify-center">
 <div className="flex justify-between text-[11px] font-bold mb-2">
 <span className="text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">sd_storage</span> Cluster Size</span>
 <span className="text-on-surface technical-mono">
 {(() => {
 const bytes = output?.space_used || 0;
 if (bytes === 0) return '0 B';
 if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
 if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
 if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
 return bytes + ' B';
 })()}
 </span>
 </div>
 </div>
 </div>

 {/* Right: Actions */}
 <div className="flex flex-col lg:items-end gap-3 min-w-[220px] relative z-10 pt-4 lg:pt-0 lg:pl-6">
 <div className="bg-surface-container border border-black/5 dark:border-white/5 px-3 py-1.5 rounded-lg flex items-center justify-between w-full lg:w-auto">
 <span className="technical-mono text-[11px] text-on-surface-variant truncate mr-3">
 {output?.Cluster_Password?.slice(0, 4)}••••{output?.Cluster_Password?.slice(-4)}
 </span>
 <CopyButton textToCopy={output?.Cluster_Password} className="text-primary hover:bg-surface-container border border-black/5 dark:border-white/5 p-1 rounded transition-colors flex items-center justify-center shrink-0" />
 </div>

 <div className="flex gap-2 w-full lg:w-auto">
 <button 
 onClick={() => navigate(`/cluster/${output?.id}`, { state: { cluster: output } })}
 className="bg-surface-container border border-black/5 dark:border-white/5 text-on-primary-fixed-variant px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-surface-container border border-black/5 dark:border-white/5 transition-all flex-1 text-center"
 >
 View
 </button>
 {output?.Current_State == "active" ?
 <button className="text-secondary bg-secondary/10 hover:bg-secondary/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 text-center" onClick={() => { pauseCluster(output) }}>
 Pause
 </button>
 :
 <button className="text-secondary bg-secondary/10 hover:bg-secondary/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 text-center" onClick={() => { resumeCluster(output) }}>
 Resume
 </button>
 }
 <button className="text-slate-400 hover:text-error hover:bg-error/10 px-2 py-1.5 rounded-lg transition-all shrink-0 flex items-center justify-center" title="Delete Cluster" onClick={() => { deleteCluster(output) }}>
 <span className="material-symbols-outlined text-[16px]">delete</span>
 </button>
 </div>
 </div>
 </div>
 )
 })
 }

 {filteredClusters?.length > 0 && (
 <PaginationControls 
 currentPage={page} 
 hasMore={clusters?.length === 16} 
 onNext={() => setPage(p => p + 1)} 
 onPrev={() => setPage(p => Math.max(1, p - 1))} 
 />
 )}

 {/* New Environment State */}
 <div className="w-full bg-surface-container border border-black/5 dark:border-white/5 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between transition-all group cursor-pointer shadow-inner mt-2">
 <div className="flex items-center gap-5">
 <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
 <span className="material-symbols-outlined text-2xl">rocket_launch</span>
 </div>
 <div>
 <h3 className="text-base font-bold text-on-surface leading-tight">Deploy a new environment</h3>
 <p className="text-sm text-on-surface-variant max-w-[400px] mt-1 font-medium leading-relaxed">Need a dedicated sandbox for testing? Launch a new M0 Free cluster in seconds.</p>
 </div>
 </div>
 <Link to="/new_cluster" className="mt-4 md:mt-0">
 <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap">
 Launch Wizard
 <span className="material-symbols-outlined text-sm">arrow_forward</span>
 </button>
 </Link>
 </div>
 </div>

 <div className="mt-10 flex items-center justify-between px-2 text-[10px] text-on-surface-variant/60 technical-mono font-bold tracking-widest uppercase">
 <div className="flex gap-6">
 <span>TOTAL CLUSTERS: {clusters?.length || 0}</span>
 <span>REGION: {currentProjectCred?.Server_Region || "Unknown"}</span>
 </div>
 <div className="flex items-center gap-2 text-primary">
 <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
 ALL SYSTEMS OPERATIONAL
 </div>
 </div>
 </DashboardLayout>
 </div>
 )
}

export default Clusters
