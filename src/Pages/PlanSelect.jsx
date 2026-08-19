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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch justify-center">
                        {[
                            { 
                                id: "free", name: "Free Tier", price: "$0", 
                                desc: "Perfect for prototyping and personal side projects.", 
                                features: { projects: "1 Project", clusters: "2 Clusters", storage: "1GB Storage", compute: "500MB RAM" },
                                bullets: ["Shared cloud nodes", "Community forum support"]
                            },
                            { 
                                id: "standard", name: "Standard Tier", price: "$49", 
                                desc: "Perfect for growing startups and production apps.", 
                                features: { projects: "10 Projects", clusters: "20 Clusters", storage: "10GB Storage", compute: "8GB RAM" },
                                bullets: ["Dedicated resources", "Priority email support", "Advanced Analytics"]
                            },
                            { 
                                id: "premium", name: "Premium Tier", price: "$199", 
                                desc: "Enterprise-grade performance with dedicated global resources.", 
                                features: { projects: "Unlimited", clusters: "Unlimited", storage: "100GB NVMe", compute: "32GB RAM" },
                                bullets: ["24/7 Phone & Chat Support", "Multi-region sharding", "Custom SSO & RBAC", "Point-in-time recovery"]
                            }
                        ].map((tier) => {
                            const isCurrent = (userPlanGet?.Plan_Name || 'free') === tier.id;
                            
                            return (
                                <div key={tier.id} className={`bg-surface rounded-2xl p-8 border ${isCurrent ? 'border-primary shadow-lg shadow-primary/10' : 'border-black/5 dark:border-white/5 opacity-60 grayscale-[0.2]'} flex flex-col relative transition-all duration-300`}>
                                    {isCurrent && (
                                        <div className="absolute top-6 right-6">
                                            <span className="bg-surface-container-highest text-primary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-primary">Current Plan</span>
                                        </div>
                                    )}
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-on-surface mb-2">{tier.name}</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-on-surface">{tier.price}</span>
                                            <span className="text-on-surface-variant text-sm">/mo</span>
                                        </div>
                                        <p className="text-on-surface-variant mt-3 text-xs leading-relaxed min-h-[40px]">{tier.desc}</p>
                                    </div>
                                    <div className="space-y-6 flex-1">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Included Resources</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="bg-surface-container-highest p-3 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                                                    <p className="text-[9px] text-on-surface-variant uppercase font-bold mb-1">Projects</p>
                                                    <p className={`font-mono text-xs font-bold ${tier.id !== 'free' ? 'text-primary' : ''}`}>{tier.features.projects}</p>
                                                </div>
                                                <div className="bg-surface-container-highest p-3 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                                                    <p className="text-[9px] text-on-surface-variant uppercase font-bold mb-1">Clusters</p>
                                                    <p className={`font-mono text-xs font-bold ${tier.id !== 'free' ? 'text-primary' : ''}`}>{tier.features.clusters}</p>
                                                </div>
                                                <div className="bg-surface-container-highest p-3 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                                                    <p className="text-[9px] text-on-surface-variant uppercase font-bold mb-1">Storage</p>
                                                    <p className={`font-mono text-xs font-bold ${tier.id !== 'free' ? 'text-primary' : ''}`}>{tier.features.storage}</p>
                                                </div>
                                                <div className="bg-surface-container-highest p-3 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                                                    <p className="text-[9px] text-on-surface-variant uppercase font-bold mb-1">Compute</p>
                                                    <p className={`font-mono text-xs font-bold ${tier.id !== 'free' ? 'text-primary' : ''}`}>{tier.features.compute}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <ul className="space-y-3 border-t border-black/5 dark:border-white/5 pt-6">
                                            {tier.bullets.map((bullet, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-xs text-on-surface-variant">
                                                    <span className="material-symbols-outlined text-primary text-[14px]">check</span>
                                                    <span>{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button 
                                        onClick={() => isCurrent ? selectPlan(tier.id) : null} 
                                        disabled={!isCurrent}
                                        className={`mt-8 w-full py-3 px-4 font-bold rounded-xl border-2 transition-colors ${isCurrent ? 'bg-primary text-on-primary border-primary shadow-md hover:bg-primary/90' : 'bg-surface-container text-on-surface-variant/50 border-black/5 cursor-not-allowed'}`}
                                    >
                                        {isCurrent ? 'Select Plan' : 'Not Available'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <a className="group p-6 bg-surface rounded-2xl flex items-center justify-between hover:bg-surface-container-highest transition-all border border-black/5 dark:border-white/5 hover:border-primary" href="#">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-surface-container-highest rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">credit_card</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-on-surface">Payment Methods</h4>
                                    <p className="text-xs text-on-surface-variant">Visa ending in •••• 4242</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">arrow_forward</span>
                        </a>
                        <a className="group p-6 bg-surface rounded-2xl flex items-center justify-between hover:bg-surface-container-highest transition-all border border-black/5 dark:border-white/5 hover:border-primary" href="#">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-surface-container-highest rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
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
                    <div className="mt-20 text-center border-t border-black/5 dark:border-white/5 pt-10">
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
