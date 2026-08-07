import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from './DashboardLayout'
import { Link, useNavigate } from 'react-router-dom'
import userIcon from "../Images/user.png"
import { objContext } from '../App'

const MainDashboard = () => {
    const { setUserCred, userCred, projectHistory, currentProjectCred, setCurrentProjectCred, AllProject, userPlan } = useContext(objContext)
    const navigate = useNavigate()
    useEffect(() => {
        if (!userCred) {
            navigate("/signin")
        }
        console.log(currentProjectCred);

    }, [])

    const [highestHistory, setHighestHistory] = useState(5)

    return (
        <>
            <DashboardLayout>
                <header className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-1 " style={{ textTransform: "capitalize" }}>Hello, {userCred?.UserName}</h1>
                    <p className="text-on-surface-variant font-medium">Your database fleet is healthy and running optimally.</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-transparent shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined text-primary-container bg-primary-fixed p-2 rounded-lg">storage</span>
                        </div>
                        <p className="text-sm font-semibold text-on-surface-variant mb-1">Total Clusters</p>
                        <p className="text-3xl font-bold text-on-surface technical-mono">{userPlan?.Total_Clusters || 0}</p>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-transparent shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined text-secondary bg-secondary-fixed p-2 rounded-lg">database</span>
                        </div>
                        <p className="text-sm font-semibold text-on-surface-variant mb-1">Total Projects</p>
                        <p className="text-3xl font-bold text-on-surface technical-mono">{userPlan?.Total_Project || 0}</p>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-transparent shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined text-on-tertiary-fixed-variant bg-tertiary-fixed p-2 rounded-lg">description</span>
                            <span className="text-xs font-bold text-emerald-600 technical-mono"></span>
                        </div>
                        <p className="text-sm font-semibold text-on-surface-variant mb-1">Max Allowed Projects</p>
                        <p className="text-3xl font-bold text-on-surface technical-mono">{userPlan?.Highest_Project || 1}</p>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-transparent shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined text-on-primary-container bg-surface-container-highest p-2 rounded-lg">hard_drive</span>
                            <span className="text-xs font-bold text-on-surface-variant technical-mono">{Math.round((userPlan?.Storage_Used / userPlan?.Cloud_Storage) * 100) || 0}%</span>
                        </div>
                        <p className="text-sm font-semibold text-on-surface-variant mb-2">Storage Used</p>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                <div className="h-full primary-gradient bg-primary" style={{ width: `${(userPlan?.Storage_Used / userPlan?.Cloud_Storage) * 100}%` }}></div>
                            </div>
                            <span className="text-xs font-bold technical-mono text-on-surface">{userPlan?.Storage_Used >= 1000 ? userPlan?.Storage_Used / 1000 : userPlan?.Storage_Used || 0}{userPlan?.Storage_Used >= 1000 ? "gb" : "mb"} / {userPlan?.Cloud_Storage >= 1000 ? userPlan?.Cloud_Storage / 1000 : userPlan?.Cloud_Storage || 0}{userPlan?.Cloud_Storage >= 1000 ? "gb" : "mb"}</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-surface-container flex justify-between items-center">
                                <h3 className="font-bold text-on-surface">Recent Activity</h3>
                                <button className="text-sm font-semibold text-secondary hover:underline">View All</button>
                            </div>
                            <div className="divide-y divide-surface-container">
                                {
                                    projectHistory?.map((output, index) => {
                                        if (output?.History_Type == "clusterAdd" && (index + 1 <= highestHistory) && (index +1 >= highestHistory -5)) {
                                            return (
                                                <div key={index} className="px-6 py-4 flex items-start gap-4 hover:bg-surface-container-low transition-colors">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                                        <span className="material-symbols-outlined text-primary text-xl">add_box</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-on-surface">{output?.History_Title}</p>
                                                        <p className="text-xs text-on-surface-variant mb-1">{output?.History_Description}</p>
                                                        <span className="text-[10px] technical-mono text-slate-400">{output?.Date_Created} • {output?.Other_Stamp}</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{output?.Status}</span>
                                                </div>
                                            )
                                        }
                                    })
                                }

                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
                            <h3 className="font-bold text-on-surface mb-6">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link to="/clusters" className="block">
                                    <button className="w-full primary-gradient text-white py-3 px-4 rounded-lg flex items-center justify-between font-bold text-sm transition-all active:scale-95">
                                        <span className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-lg">add_circle</span>
                                            Create New Cluster
                                        </span>
                                        <span className="material-symbols-outlined text-lg opacity-60">chevron_right</span>
                                    </button>
                                </Link>
                                <Link to="/data-access" className="block">
                                    <button className="w-full bg-surface-container-high text-on-primary-fixed-variant py-3 px-4 rounded-lg flex items-center justify-between font-bold text-sm transition-all hover:bg-surface-container-highest active:scale-95">
                                        <span className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-lg">person_add</span>
                                            Add Database User
                                        </span>
                                        <span className="material-symbols-outlined text-lg opacity-30">chevron_right</span>
                                    </button>
                                </Link>
                                <Link to="/backup" className="block">
                                    <button className="w-full bg-surface-container-high text-on-primary-fixed-variant py-3 px-4 rounded-lg flex items-center justify-between font-bold text-sm transition-all hover:bg-surface-container-highest active:scale-95">
                                        <span className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-lg">history</span>
                                            Run Backup Now
                                        </span>
                                        <span className="material-symbols-outlined text-lg opacity-30">chevron_right</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="bg-primary-container text-on-primary-container p-6 rounded-xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <h4 className="font-bold text-lg mb-2">Need help with Fleet Management?</h4>
                                <p className="text-sm opacity-80 mb-4">Learn how to optimize your document schemas for high-concurrency workloads.</p>
                                <Link className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary-fixed hover:gap-3 transition-all" to="/support">
                                    Read Documentation
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[120px]">menu_book</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    )
}

export default MainDashboard
