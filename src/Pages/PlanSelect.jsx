import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { objContext } from '../App'

const PlanSelect = () => {
    const { userCred, userPlan } = useContext(objContext)
    const navigate = useNavigate()
    const [userPlanGet, setUserPlan] = useState(userPlan)
    const location = useLocation()
    const gottenValue = location?.state
    
    useEffect(() => {
        if (!userCred) {
            navigate("/signin")
        }
    }, [])
    const selectPlan = (choosenPlan) => {
        const allCred = {...gottenValue, ProjectPlan: choosenPlan}
        console.log(allCred);
        navigate("/saveProject", {
            state:{
                allCred
        }})
    }
    return (
        <div>
            <main className="min-h-screen flex flex-col items-center justify-center py-10 px-6 lg:px-8">
                <div className="w-full max-w-4xl mb-12 flex flex-col items-center text-center">
                    <span className="text-secondary font-mono text-xs tracking-widest uppercase mb-3">Subscription Management</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-2">Step 3 of 3: Choose your scale.</h1>
                    <p className="text-on-surface-variant max-w-lg">Select a plan that grows with your application, from local development to global production.</p>
                </div>
                <div className="w-full px-6 md:px-12 mx-auto">
                    <div className="flex gap-8 items-stretch justify-center items-center">
                        {
                            userPlanGet?.Plan_Name == "free" ?
                                (<div style={{ maxWidth: "400px" }} className="bg-surface rounded-2xl p-10 border border-outline-variant/30 flex flex-col relative transition-all duration-300 hover:border-primary/30">
                                    {userPlanGet?.Plan_Name == "free" ?
                                        (<div className="absolute top-8 right-8">
                                            <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-primary/20">Current Plan</span>
                                        </div>)
                                        : null
                                    }
                                    <div className="mb-10">
                                        <h3 className="text-2xl font-bold text-on-surface mb-2">Free Tier</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl font-black text-on-surface">$0</span>
                                            <span className="text-on-surface-variant text-lg">/mo</span>
                                        </div>
                                        <p className="text-on-surface-variant mt-4 text-sm leading-relaxed">Perfect for prototyping and personal side projects.</p>
                                    </div>
                                    <div className="space-y-8 flex-1">
                                        <div className="space-y-4">
                                            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Included Resources</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10">
                                                    <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Projects</p>
                                                    <p className="font-mono text-sm font-semibold">1 Project</p>
                                                </div>
                                                <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10">
                                                    <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Clusters</p>
                                                    <p className="font-mono text-sm font-semibold">2 Clusters</p>
                                                </div>
                                                <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10">
                                                    <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Storage</p>
                                                    <p className="font-mono text-sm font-semibold">1GB Storage</p>
                                                </div>
                                                <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10">
                                                    <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Compute</p>
                                                    <p className="font-mono text-sm font-semibold">500MB RAM</p>
                                                </div>
                                            </div>
                                        </div>
                                        <ul className="space-y-4 border-t border-outline-variant/20 pt-8">
                                            <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                                                <span className="material-symbols-outlined text-primary font-bold">check</span>
                                                <span>Shared cloud nodes</span>
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                                                <span className="material-symbols-outlined text-primary font-bold">check</span>
                                                <span>Community forum support</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <button onClick={() => { selectPlan("free") }} className="mt-12 w-full py-4 px-4 bg-white text-primary font-bold rounded-xl border-2 border-primary/20 hover:bg-primary/5 transition-colors">
                                        Select Plan
                                    </button>
                                </div>)
                                : null
                        }
                        {
                            userPlanGet?.Plan_Name != "premium" ?
                                (<div style={{ maxWidth: "400px" }} className="relative bg-surface rounded-2xl p-10 border border-outline-variant/30 flex flex-col transition-all duration-300 hover:border-primary cursor-pointer">
                                    {userPlanGet?.Plan_Name == "standard" ?
                                        (<div className="absolute top-8 right-8">
                                            <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-primary/20">Current Plan</span>
                                        </div>)
                                        : null
                                    }
                                    <div className="mb-10">
                                        <h3 className="text-2xl font-bold text-on-surface mb-2">Premium</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl font-black text-on-surface">$199</span>
                                            <span className="text-on-surface-variant text-lg">/mo</span>
                                        </div>
                                        <p className="text-on-surface-variant mt-4 text-sm leading-relaxed">Enterprise-grade performance with dedicated global resources.</p>
                                    </div>
                                    <div className="space-y-8 flex-1">
                                        <div className="space-y-4">
                                            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Enterprise Resources</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10">
                                                    <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Projects</p>
                                                    <p className="font-mono text-sm font-bold text-primary">Unlimited</p>
                                                </div>
                                                <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10">
                                                    <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Clusters</p>
                                                    <p className="font-mono text-sm font-bold text-primary">Unlimited</p>
                                                </div>
                                                <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10">
                                                    <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Storage</p>
                                                    <p className="font-mono text-sm font-bold text-primary">100GB NVMe</p>
                                                </div>
                                                <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10">
                                                    <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Compute</p>
                                                    <p className="font-mono text-sm font-bold text-primary">32GB RAM</p>
                                                </div>
                                            </div>
                                        </div>
                                        <ul className="space-y-4 border-t border-outline-variant/20 pt-8">
                                            <li className="flex items-center gap-3 text-sm font-bold text-on-surface">
                                                <span className="material-symbols-outlined text-primary">verified</span>
                                                <span>24/7 Phone &amp; Chat Support</span>
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                                                <span className="material-symbols-outlined text-primary/60">verified</span>
                                                <span>Multi-region sharding</span>
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                                                <span className="material-symbols-outlined text-primary/60">verified</span>
                                                <span>Custom SSO &amp; RBAC</span>
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                                                <span className="material-symbols-outlined text-primary/60">verified</span>
                                                <span>Point-in-time recovery</span>
                                            </li>
                                        </ul>
                                    </div>
                                    {userPlanGet?.Plan_Name == "standard" ?
                                        (<button onClick={() => { selectPlan("standard") }} className="mt-12 w-full py-4 px-4 bg-white text-primary font-bold rounded-xl border-2 border-primary/20 hover:bg-primary/5 transition-colors">
                                            Select Plan
                                        </button>)
                                        : <button onClick={()=>{purchasePlan("standard")}} className="mt-12 w-full py-4 px-4 bg-white text-primary font-bold rounded-xl border-2 border-primary/20 hover:bg-primary/5 transition-colors">
                                            Purchase Plan
                                        </button>
                                    }
                                </div>)
                                : null
                        }
                        <div style={{ maxWidth: "400px" }} className="relative bg-surface rounded-2xl p-10 border border-outline-variant/30 flex flex-col transition-all duration-300 hover:border-primary cursor-pointer">
                            {userPlanGet?.Plan_Name == "premium" ?
                                (<div className="absolute top-8 right-8">
                                    <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-primary/20">Current Plan</span>
                                </div>)
                                : null
                            }
                            <div className="mb-10">
                                <h3 className="text-2xl font-bold text-on-surface mb-2">Premium</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-on-surface">$199</span>
                                    <span className="text-on-surface-variant text-lg">/mo</span>
                                </div>
                                <p className="text-on-surface-variant mt-4 text-sm leading-relaxed">Enterprise-grade performance with dedicated global resources.</p>
                            </div>
                            <div className="space-y-8 flex-1">
                                <div className="space-y-4">
                                    <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Enterprise Resources</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10">
                                            <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Projects</p>
                                            <p className="font-mono text-sm font-bold text-primary">Unlimited</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10">
                                            <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Clusters</p>
                                            <p className="font-mono text-sm font-bold text-primary">Unlimited</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10">
                                            <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Storage</p>
                                            <p className="font-mono text-sm font-bold text-primary">100GB NVMe</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10">
                                            <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Compute</p>
                                            <p className="font-mono text-sm font-bold text-primary">32GB RAM</p>
                                        </div>
                                    </div>
                                </div>
                                <ul className="space-y-4 border-t border-outline-variant/20 pt-8">
                                    <li className="flex items-center gap-3 text-sm font-bold text-on-surface">
                                        <span className="material-symbols-outlined text-primary">verified</span>
                                        <span>24/7 Phone &amp; Chat Support</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                                        <span className="material-symbols-outlined text-primary/60">verified</span>
                                        <span>Multi-region sharding</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                                        <span className="material-symbols-outlined text-primary/60">verified</span>
                                        <span>Custom SSO &amp; RBAC</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                                        <span className="material-symbols-outlined text-primary/60">verified</span>
                                        <span>Point-in-time recovery</span>
                                    </li>
                                </ul>
                            </div>
                            {userPlanGet?.Plan_Name == "premium" ?
                                (<button onClick={() => { selectPlan("premium") }} className="mt-12 w-full py-4 px-4 bg-white text-primary font-bold rounded-xl border-2 border-primary/20 hover:bg-primary/5 transition-colors">
                                    Select Plan
                                </button>)
                                : <button onClick={()=>{purchasePlan("premium")}} className="mt-12 w-full py-4 px-4 bg-white text-primary font-bold rounded-xl border-2 border-primary/20 hover:bg-primary/5 transition-colors">
                                    Purchase Plan
                                </button>
                            }
                        </div>
                    </div>
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <a className="group p-6 bg-surface rounded-2xl flex items-center justify-between hover:bg-primary/5 transition-all border border-outline-variant/20 hover:border-primary/20" href="#">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">credit_card</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-on-surface">Payment Methods</h4>
                                    <p className="text-xs text-on-surface-variant">Visa ending in •••• 4242</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">arrow_forward</span>
                        </a>
                        <a className="group p-6 bg-surface rounded-2xl flex items-center justify-between hover:bg-primary/5 transition-all border border-outline-variant/20 hover:border-primary/20" href="#">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">history</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-on-surface">Billing History</h4>
                                    <p className="text-xs text-on-surface-variant">Invoices and transaction history</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">arrow_forward</span>
                        </a>
                    </div>
                    <div className="mt-20 text-center border-t border-outline-variant/10 pt-10">
                        <p className="text-on-surface-variant text-sm font-medium">
                            Need a custom enterprise solution? <a className="text-primary hover:underline font-bold" href="#">Talk to our architecture team</a>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PlanSelect
