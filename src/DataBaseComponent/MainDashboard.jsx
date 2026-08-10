import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from './DashboardLayout'
import { Link, useNavigate } from 'react-router-dom'
import { objContext } from '../App'

const MainDashboard = () => {
  const { userCred, projectHistory, userPlan } = useContext(objContext)
  const navigate = useNavigate()
  useEffect(() => { if (!userCred) navigate("/signin") }, [])

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 mt-6">
        <div className="bg-surface-container border border-black/5 dark:border-white/5 p-5 rounded-xl shadow-sm transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-primary bg-primary-container p-2 rounded-lg ">storage</span>
          </div>
          <p className="text-xs font-semibold text-on-surface-variant mb-1">Total Clusters</p>
          <p className="text-2xl font-bold text-on-surface tracking-tight">{userPlan?.Total_Clusters || 0}</p>
        </div>
        <div className="bg-surface-container border border-black/5 dark:border-white/5 p-5 rounded-xl shadow-sm transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-secondary bg-secondary-container p-2 rounded-lg ">database</span>
          </div>
          <p className="text-xs font-semibold text-on-surface-variant mb-1">Total Projects</p>
          <p className="text-2xl font-bold text-on-surface tracking-tight">{userPlan?.Total_Project || 0}</p>
        </div>
        <div className="bg-surface-container border border-black/5 dark:border-white/5 p-5 rounded-xl shadow-sm transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-tertiary bg-tertiary-container p-2 rounded-lg ">description</span>
          </div>
          <p className="text-xs font-semibold text-on-surface-variant mb-1">Max Allowed Projects</p>
          <p className="text-2xl font-bold text-on-surface tracking-tight">{userPlan?.Highest_Project || 1}</p>
        </div>
        <div className="bg-surface-container border border-black/5 dark:border-white/5 p-5 rounded-xl shadow-sm transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-error bg-error-container p-2 rounded-lg ">hard_drive</span>
            <span className="text-[10px] font-bold text-on-surface-variant bg-surface-containerest px-2 py-0.5 rounded ">{Math.round((userPlan?.Storage_Used / userPlan?.Cloud_Storage) * 100) || 0}%</span>
          </div>
          <p className="text-xs font-semibold text-on-surface-variant mb-2">Storage Used</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden /30">
              <div className="h-full bg-primary" style={{ width: `${(userPlan?.Storage_Used / userPlan?.Cloud_Storage) * 100}%` }}></div>
            </div>
            <span className="text-[9px] font-bold text-on-surface-variant">{userPlan?.Storage_Used >= 1000 ? userPlan?.Storage_Used / 1000 : userPlan?.Storage_Used || 0}{userPlan?.Storage_Used >= 1000 ? "gb" : "mb"} / {userPlan?.Cloud_Storage >= 1000 ? userPlan?.Cloud_Storage / 1000 : userPlan?.Cloud_Storage || 0}{userPlan?.Cloud_Storage >= 1000 ? "gb" : "mb"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-surface-container border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden flex flex-col h-full">
          <div className="px-6 py-4 flex justify-between items-center">
            <h3 className="text-sm font-bold text-on-surface">Recent Activity</h3>
            <span className="text-[11px] font-bold text-primary cursor-pointer hover:underline uppercase tracking-wider bg-primary-container/30 px-2 py-1 rounded">VIEW ALL</span>
          </div>
          <div className="flex-1 overflow-y-auto ">
            {projectHistory?.slice(0, 5).map((output, index) => (
              output?.History_Type == "clusterAdd" && (
                <div key={index} className="p-5 flex gap-4 hover:bg-surface-container-highest transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                    <span className="material-symbols-outlined text-primary text-[20px]">add_box</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-bold text-on-surface">{output?.History_Title}</p>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary-container px-2 py-1 rounded border border-primary/20">SUCCESS</span>
                    </div>
                    <p className="text-[13px] text-on-surface-variant mb-2">{output?.History_Description}</p>
                    <p className="text-[11px] text-on-surface-variant/70">{output?.Date_Created} • {output?.Other_Stamp}</p>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
        
        <div className="bg-surface-container border border-black/5 dark:border-white/5 rounded-2xl p-6 h-fit">
          <h3 className="text-sm font-bold text-on-surface mb-6">Quick Actions</h3>
          <div className="flex flex-col gap-3 mb-8">
            <Link to="/clusters" className="w-full bg-primary text-background font-bold text-[13px] py-3.5 px-4 rounded-xl flex justify-between items-center hover:bg-primary-fixed transition-colors border border-primary-fixed">
              <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">add_circle</span> Create New Cluster</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </Link>
            <Link to="/data-access" className="w-full bg-surface-container-highest text-on-surface font-bold text-[13px] py-3.5 px-4 rounded-xl flex justify-between items-center hover:brightness-110 transition-colors">
              <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">person_add</span> Add Database User</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </Link>
          </div>
          
          <div className="bg-surface-container-highest rounded-xl p-5 relative overflow-hidden ">
            <span className="material-symbols-outlined text-primary mb-3 text-2xl relative z-10">menu_book</span>
            <h4 className="text-sm font-bold text-on-surface mb-2 relative z-10">Need help with Fleet Management?</h4>
            <p className="text-[13px] text-on-surface-variant leading-relaxed mb-4 relative z-10">Learn how to optimize your document schemas for high-concurrency workloads and ensure zero downtime.</p>
            <Link to="/support" className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all relative z-10">
              READ DOCUMENTATION <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
            <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[120px] text-on-surface-variant/5">menu_book</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
export default MainDashboard;
