import React from 'react'
import CopyButton from '../DataBaseComponent/CopyButton'
const ProjectCreation = () => {
    return (
        <>
            <header className="fixed top-0 w-full h-16 z-40 bg-surface-container-highest border-b border-gray-200 flex justify-between items-center px-6">
                <div className="flex items-center gap-8">
                    <span className="text-xl font-bold tracking-tighter text-emerald-900">TIlBase</span>
                    <nav className="hidden md:flex items-center gap-6">
                        <a className="text-slate-500 font-medium text-sm tracking-tight hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors" href="#">Dashboard</a>
                        <a className="text-emerald-800 font-bold text-sm tracking-tight border-b-2 border-emerald-800 px-3 py-2" href="#">Create Project</a>
                        <a className="text-slate-500 font-medium text-sm tracking-tight hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors" href="#">Settings</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-transform active:scale-95">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-transform active:scale-95">
                            <span className="material-symbols-outlined">help</span>
                        </button>
                    </div>
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest">
                        <img alt="JD Avatar" className="w-full h-full object-cover" data-alt="professional portrait of a male developer in a neutral office setting with soft natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrF5IY4O22ZlORp_pipiEBwbIX7GQxy2JStKj0ynPpdXRvIfjoL4pB3llzPn12nbM9X0EHs89EdIhNbgfL8rSGopyRFCi7C_FSBiWW62OKc1fcr0LD38kSVuMl2PI3d5Y2j7V59z22d5RRymImRs1q9WoZrG4BTp_tkj_ro4FECEOc5aFm8-Ga0ZUxzM-w6Sqq9f_e92XZfl0p679bCGJAxYMCbAroBIKtya5Vju3DQPB0nG8zQOOpiCaxU5D2h6jLCRIYrjY46a3P" />
                    </div>
                </div>
            </header>
            <main className="pt-24 pb-12 px-6 w-full mx-auto">
                <div className="mb-12">
                    <div className="flex items-center justify-between w-full mx-auto">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">1</div>
                            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Project</span>
                        </div>
                        <div className="flex-1 h-[2px] bg-outline-variant mx-4 opacity-30"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-bold">2</div>
                            <span className="text-xs font-semibold text-on-surface-variant/50 uppercase tracking-widest">Provider</span>
                        </div>
                        <div className="flex-1 h-[2px] bg-outline-variant mx-4 opacity-30"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-bold">3</div>
                            <span className="text-xs font-semibold text-on-surface-variant/50 uppercase tracking-widest">Cluster</span>
                        </div>
                        <div className="flex-1 h-[2px] bg-outline-variant mx-4 opacity-30"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-bold">4</div>
                            <span className="text-xs font-semibold text-on-surface-variant/50 uppercase tracking-widest">Access</span>
                        </div>
                        <div className="flex-1 h-[2px] bg-outline-variant mx-4 opacity-30"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-bold">5</div>
                            <span className="text-xs font-semibold text-on-surface-variant/50 uppercase tracking-widest">Review</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-8">
                        <section className="bg-surface-container-highestest p-8 rounded-xl shadow-sm border-l-4 border-primary">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary">inventory_2</span>
                                <h2 className="text-2xl font-bold tracking-tight text-on-surface">Step 1: Project Details</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-on-surface-variant">Project Name</label>
                                    <input className="w-full px-4 py-3 bg-surface-container-highest border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all outline-none" placeholder="e.g. Production Analytics" type="text" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-on-surface-variant">Project ID (Auto-generated)</label>
                                    <div className="w-full px-4 py-3 bg-surface-container border border-dashed border-black/5 dark:border-white/5 rounded-lg font-mono text-xs flex items-center justify-between">
                                        <span className="text-on-surface-variant">proj_alpha_9921_x2</span>
                                        <CopyButton textToCopy="proj_alpha_9921_x2" className="text-sm cursor-pointer hover:text-primary" />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-sm font-semibold text-on-surface-variant">Description</label>
                                    <textarea className="w-full px-4 py-3 bg-surface-container-highest border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all outline-none resize-none" placeholder="Describe the purpose of this fleet..." rows="3"></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-on-surface-variant">Environment</label>
                                    <select className="w-full px-4 py-3 bg-surface-container-highest border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all outline-none">
                                        <option>Production</option>
                                        <option>Staging</option>
                                        <option>Development</option>
                                        <option>Testing</option>
                                    </select>
                                </div>
                            </div>
                        </section>
                        <section className="bg-surface-container-highestest p-8 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-secondary">cloud</span>
                                <h2 className="text-2xl font-bold tracking-tight text-on-surface">Step 2: Cloud Provider &amp; Region</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <button className="flex flex-col items-center gap-4 p-6 border-2 border-primary bg-surface-container-highest rounded-xl text-left transition-all">
                                    <span className="material-symbols-outlined text-3xl text-primary">deployed_code</span>
                                    <span className="font-bold text-on-surface">AWS</span>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Recommended</span>
                                </button>
                                <button className="flex flex-col items-center gap-4 p-6 border border-black/5 dark:border-white/5 hover:border-secondary hover:bg-surface-container-highest rounded-xl transition-all grayscale opacity-60 hover:grayscale-0 hover:opacity-100">
                                    <span className="material-symbols-outlined text-3xl text-secondary">database</span>
                                    <span className="font-bold text-on-surface">Google Cloud</span>
                                </button>
                                <button className="flex flex-col items-center gap-4 p-6 border border-black/5 dark:border-white/5 hover:border-secondary hover:bg-surface-container-highest rounded-xl transition-all grayscale opacity-60 hover:grayscale-0 hover:opacity-100">
                                    <span className="material-symbols-outlined text-3xl text-secondary">grid_view</span>
                                    <span className="font-bold text-on-surface">Azure</span>
                                </button>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-on-surface-variant">Region</label>
                                <select className="w-full px-4 py-3 bg-surface-container-highest border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all outline-none">
                                    <option>us-east-1 (N. Virginia)</option>
                                    <option>us-west-2 (Oregon)</option>
                                    <option>eu-central-1 (Frankfurt)</option>
                                    <option>ap-southeast-1 (Singapore)</option>
                                </select>
                            </div>
                        </section>
                        <section className="bg-surface-container-highestest p-8 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-emerald-600">settings_suggest</span>
                                <h2 className="text-2xl font-bold tracking-tight text-on-surface">Step 3: Cluster Configuration</h2>
                            </div>
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-on-surface-variant mb-4">Tier Selection</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <div className="p-4 border-2 border-primary bg-surface-container-highest rounded-lg flex flex-col cursor-pointer">
                                        <span className="font-bold font-mono text-primary">M10</span>
                                        <span className="text-[10px] text-on-surface-variant mb-2">2GB RAM / 10GB Storage</span>
                                        <span className="text-xs font-medium">Standard workloads</span>
                                    </div>
                                    <div className="p-4 border border-black/5 dark:border-white/5 rounded-lg flex flex-col cursor-pointer hover:border-primary transition-all">
                                        <span className="font-bold font-mono text-on-surface">M20</span>
                                        <span className="text-[10px] text-on-surface-variant mb-2">4GB RAM / 20GB Storage</span>
                                        <span className="text-xs font-medium text-slate-500">High traffic APIs</span>
                                    </div>
                                    <div className="p-4 border border-black/5 dark:border-white/5 rounded-lg flex flex-col cursor-pointer hover:border-primary transition-all opacity-50 grayscale">
                                        <span className="font-bold font-mono text-on-surface">M30</span>
                                        <span className="text-[10px] text-on-surface-variant mb-2">8GB RAM / 40GB Storage</span>
                                        <span className="text-xs font-medium text-slate-500">Enterprise Scale</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-on-surface-variant">Cluster Name</label>
                                    <input className="w-full px-4 py-3 bg-surface-container-highest border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all outline-none font-mono" type="text" value="Cluster0" />
                                </div>
                                <div className="flex flex-wrap gap-6">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input checked="" className="w-5 h-5 rounded border-black/5 dark:border-white/5 text-primary focus:ring-primary" type="checkbox" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">Enable Automated Backups</span>
                                            <span className="text-[10px] text-on-surface-variant">Daily snapshots (Free tier)</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input className="w-5 h-5 rounded border-black/5 dark:border-white/5 text-primary focus:ring-primary" type="checkbox" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">Enable Sharding</span>
                                            <span className="text-[10px] text-on-surface-variant">Requires Tier M30+</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </section>
                        <section className="bg-surface-container-highestest p-8 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-blue-600">key</span>
                                <h2 className="text-2xl font-bold tracking-tight text-on-surface">Step 4: Database Access</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-on-surface-variant">Master Username</label>
                                    <input className="w-full px-4 py-3 bg-surface-container-highest border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all outline-none font-mono text-sm" placeholder="admin_user" type="text" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-on-surface-variant">Password</label>
                                    <div className="relative">
                                        <input className="w-full px-4 py-3 bg-surface-container-highest border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all outline-none font-mono text-sm" type="password" value="••••••••••••" />
                                        <button className="absolute right-3 top-3 text-primary text-xs font-bold uppercase tracking-tighter hover:underline">Generate</button>
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-sm font-semibold text-on-surface-variant">Assigned Roles</label>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-xs font-semibold flex items-center gap-1">Read/Write <span className="material-symbols-outlined text-[14px]">close</span></span>
                                        <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-xs font-semibold flex items-center gap-1">Atlas Admin <span className="material-symbols-outlined text-[14px]">close</span></span>
                                        <button className="px-3 py-1 border border-dashed border-black/5 dark:border-white/5 rounded-full text-xs font-medium text-on-surface-variant hover:bg-surface-container">+ Add Role</button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-surface-container-highest rounded-lg border border-black/5 dark:border-white/5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold">IP Access List</span>
                                    <button className="text-[10px] text-secondary font-bold uppercase hover:underline">Add current IP</button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between font-mono text-xs bg-surface-container-highest p-2 rounded border border-black/5 dark:border-white/5">
                                        <span>192.168.1.1/32</span>
                                        <span className="text-on-surface-variant italic">My Laptop</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    <aside className="lg:col-span-4 sticky top-24">
                        <div className="bg-surface-container p-1 rounded-2xl">
                            <div className="bg-surface-container-highestest p-6 rounded-xl shadow-lg shadow-on-surface/5 border border-black/5 dark:border-white/5">
                                <h3 className="text-lg font-extrabold tracking-tight mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">fact_check</span>
                                    Review &amp; Create
                                </h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-medium text-on-surface-variant">Project Name</span>
                                        <span className="text-xs font-bold text-right">Production Analytics</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-medium text-on-surface-variant">Provider</span>
                                        <span className="text-xs font-bold text-right">AWS (us-east-1)</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-medium text-on-surface-variant">Cluster Tier</span>
                                        <span className="text-xs font-mono font-bold text-right">M10 Standard</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-medium text-on-surface-variant">Backup</span>
                                        <span className="text-xs font-bold text-right text-emerald-600">Enabled</span>
                                    </div>
                                    <div className="pt-4 border-t border-black/5 dark:border-white/5 mt-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-bold">Estimated Cost</span>
                                            <span className="text-lg font-extrabold text-on-surface">$0.08<span className="text-xs font-medium text-on-surface-variant">/hr</span></span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-on-surface-variant">Monthly Total</span>
                                            <span className="text-xl font-black text-primary">$57.60</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <button className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-bold shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">add_task</span>
                                        Create Project
                                    </button>
                                    <button className="w-full py-3 bg-surface-container-high text-on-primary-fixed-variant rounded-xl font-semibold text-sm hover:bg-surface-dim transition-colors">
                                        Save as Draft
                                    </button>
                                </div>
                                <p className="mt-6 text-[10px] text-center text-on-surface-variant leading-relaxed">
                                    By creating this project, you agree to TIlBase's
                                    <a className="underline font-bold" href="#">Service Terms</a> and auto-billing cycles for the selected tier.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 p-6 bg-secondary-container/10 rounded-xl border border-secondary/20">
                            <h4 className="text-sm font-bold text-secondary-container mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">support_agent</span>
                                Need help sizing?
                            </h4>
                            <p className="text-xs text-on-surface-variant mb-4">Our solution architects can help you pick the right tier for your specific dataset.</p>
                            <a className="text-xs font-bold text-secondary hover:underline" href="#">Chat with support →</a>
                        </div>
                    </aside>
                </div>
            </main>
            <footer className="mt-auto border-t border-gray-200 py-8 px-6 text-center">
                <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-4 opacity-60">
                    <span className="text-xs font-mono">TIlBase Platform v2.4.0-stable</span>
                    <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest">
                        <a href="#">Status</a>
                        <a href="#">API Docs</a>
                        <a href="#">Security</a>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default ProjectCreation
