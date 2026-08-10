import React from 'react'

const UserProfile = () => {
    return (
        <div>
            <header className="fixed top-0 z-40 w-full bg-[#f7faf6] dark:bg-zinc-950 flex justify-between items-center px-6 py-3 border-b border-[#bec9c1]/30 font-['Inter'] font-medium tracking-tight">
                <div className="flex items-center gap-8">
                    <span className="text-lg font-bold text-[#111827] dark:text-zinc-100 tracking-tighter">Architect Ledger</span>
                    <nav className="hidden md:flex items-center gap-6">
                        <a className="text-[#3f4943] dark:text-zinc-400 hover:text-[#004e36] dark:hover:text-white transition-colors cursor-pointer active:opacity-80" href="#">Dashboard</a>
                        <a className="text-[#3f4943] dark:text-zinc-400 hover:text-[#004e36] dark:hover:text-white transition-colors cursor-pointer active:opacity-80" href="#">Queries</a>
                        <a className="text-[#3f4943] dark:text-zinc-400 hover:text-[#004e36] dark:hover:text-white transition-colors cursor-pointer active:opacity-80" href="#">Logs</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <button className="material-symbols-outlined text-[#3f4943] hover:text-[#004e36] p-2">notifications</button>
                    <button className="material-symbols-outlined text-[#3f4943] hover:text-[#004e36] p-2">help_outline</button>
                    <div className="h-8 w-8 rounded-full bg-primary-container flex items-center justify-center text-white text-xs font-bold border border-black/5 dark:border-white/5">
                        JD
                    </div>
                </div>
            </header>
            <aside className="h-screen w-64 fixed left-0 top-0 z-50 bg-[#ebefea] dark:bg-zinc-900 flex flex-col p-4 gap-2 border-r border-[#bec9c1]/30 font-['Inter'] text-sm font-medium">
                <div className="mb-8 mt-2 px-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 bg-primary-container rounded flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">database</span>
                        </div>
                        <div>
                            <div className="text-[#111827] dark:text-zinc-100 font-bold">System Admin</div>
                            <div className="text-[10px] text-on-surface-variant uppercase tracking-wider technical-data">db-prod-01</div>
                        </div>
                    </div>
                    <button className="w-full custom-gradient text-white py-2.5 rounded-md shadow-sm font-semibold flex items-center justify-center gap-2 mb-6 hover:opacity-90 transition-opacity">
                        <span className="material-symbols-outlined text-sm">add</span>
                        New Query
                    </button>
                </div>
                <nav className="flex-1 flex flex-col gap-1">
                    <a className="flex items-center gap-3 px-3 py-2 text-[#3f4943] dark:text-zinc-400 hover:bg-[#f1f5f0] dark:hover:bg-zinc-800/50 rounded-md transition-all" href="#">
                        <span className="material-symbols-outlined">grid_view</span> Overview
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2 text-[#3f4943] dark:text-zinc-400 hover:bg-[#f1f5f0] dark:hover:bg-zinc-800/50 rounded-md transition-all" href="#">
                        <span className="material-symbols-outlined">database</span> Databases
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2 text-[#3f4943] dark:text-zinc-400 hover:bg-[#f1f5f0] dark:hover:bg-zinc-800/50 rounded-md transition-all" href="#">
                        <span className="material-symbols-outlined">shield</span> Security
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2 bg-[#ffffff] dark:bg-zinc-800 text-[#00684a] dark:text-[#00a676] rounded-md shadow-sm" href="#">
                        <span className="material-symbols-outlined">settings</span> Settings
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2 text-[#3f4943] dark:text-zinc-400 hover:bg-[#f1f5f0] dark:hover:bg-zinc-800/50 rounded-md transition-all" href="#">
                        <span className="material-symbols-outlined">code</span> API Access
                    </a>
                </nav>
                <div className="mt-auto border-t border-black/5 dark:border-white/5 pt-4 flex flex-col gap-1">
                    <a className="flex items-center gap-3 px-3 py-2 text-[#3f4943] hover:text-[#004e36]" href="#">
                        <span className="material-symbols-outlined text-lg">contact_support</span> Support
                    </a>
                </div>
            </aside>
            <main className="ml-64 pt-16 min-h-screen bg-background">
                <div className="w-full p-8 md:p-12">
                    <div className="mb-10">
                        <h1 className="text-3xl font-extrabold text-on-background tracking-tight mb-2">User Profile</h1>
                        <p className="text-on-surface-variant max-w-2xl">Manage your architectural data permissions, security protocols, and interface preferences from a centralized ledger.</p>
                    </div>
                    <div className="grid grid-cols-12 gap-6 items-start">
                        <section className="col-span-12 lg:col-span-8 bg-surface-container-highestest rounded-xl p-8 shadow-[0px_12px_32px_-4px_rgba(17,24,39,0.06)] border border-black/5 dark:border-white/5">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="material-symbols-outlined text-primary">person</span>
                                <h2 className="text-lg font-bold text-on-surface">Personal Information</h2>
                            </div>
                            <div className="flex flex-col md:flex-row gap-10">
                                <div className="flex-shrink-0 group relative">
                                    <div className="w-32 h-32 rounded-lg bg-surface-container-high flex items-center justify-center text-3xl font-bold text-primary-container border-2 border-dashed border-black/5 dark:border-white/5 transition-all hover:border-primary cursor-pointer overflow-hidden">
                                        <img alt="JD" className="hidden" data-alt="close-up minimalist professional headshot portrait of a man with clean studio lighting and soft neutral background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxX2v9a8HMWbJ7iPRef5lhvsFALTSIfXvzuqR_7mfJpYyYtNULO89JPufgnEGFtngE49sftRUO4tfkQzw8dhwl_ZTsFD4yCXdI8NaleJbuZ4ilxY1qSKKtmO6ovV28Bc-YoCghBri5Vnpg2P3Ydqi033gnmtc0YlL_zNIAtiTK8hL57myMsRQNt4j81ssLOFY_nsFkGx3PzVnNLL2Q3brj_Jre1-cU79pLSGX0nKoBS3OoIk7fPogXnLctSA5CioJQFogbpU-O5BRt" />
                                        <span>JD</span>
                                        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="material-symbols-outlined text-white">cloud_upload</span>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-center mt-3 text-on-surface-variant font-medium uppercase tracking-widest">Update Photo</p>
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Full Name</label>
                                        <input className="w-full bg-surface-container-highest border-0 rounded-md focus:ring-2 focus:ring-primary text-on-surface py-2.5 px-4 transition-all" type="text" value="John Doe" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Job Title</label>
                                        <input className="w-full bg-surface-container-highest border-0 rounded-md focus:ring-2 focus:ring-primary text-on-surface py-2.5 px-4 transition-all" type="text" value="Lead Database Architect" />
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Work Email</label>
                                        <div className="relative">
                                            <input className="w-full bg-surface-container-highest border-0 rounded-md focus:ring-2 focus:ring-primary text-on-surface py-2.5 px-4 transition-all technical-data" type="email" value="john@tilbase.com" />
                                            <span className="material-symbols-outlined absolute right-4 top-2.5 text-on-surface-variant text-sm">verified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button className="px-6 py-2 bg-surface-container-high text-on-primary-fixed-variant font-bold rounded-md hover:bg-surface-container-highest transition-colors">Discard Changes</button>
                                <button className="ml-4 px-6 py-2 custom-gradient text-white font-bold rounded-md shadow-sm hover:opacity-90">Save Profile</button>
                            </div>
                        </section>
                        <section className="col-span-12 lg:col-span-4 space-y-6">
                            <div className="bg-surface-container rounded-xl p-6 border border-black/5 dark:border-white/5">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-secondary">tune</span>
                                    <h2 className="text-md font-bold text-on-surface">Preferences</h2>
                                </div>
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Display Theme</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button className="py-2 text-[11px] font-bold bg-surface-container-highest text-primary border-2 border-primary rounded-md">Light</button>
                                            <button className="py-2 text-[11px] font-bold bg-surface-container-high text-on-surface-variant rounded-md hover:bg-surface-container-highest transition-colors">Dark</button>
                                            <button className="py-2 text-[11px] font-bold bg-surface-container-high text-on-surface-variant rounded-md hover:bg-surface-container-highest transition-colors">System</button>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">Notification Matrix</label>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-on-surface font-medium">Critical Alerts</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input checked="" className="sr-only peer" type="checkbox" />
                                                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-on-surface font-medium">Daily Backups</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input className="sr-only peer" type="checkbox" />
                                                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-on-surface font-medium">Billing &amp; Invoices</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input checked="" className="sr-only peer" type="checkbox" />
                                                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-surface-container rounded-xl p-6 border border-black/5 dark:border-white/5">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Regional Settings</label>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 bg-surface-container-highest p-2 rounded-md border border-black/5 dark:border-white/5">
                                                <span className="material-symbols-outlined text-sm">language</span>
                                                <span className="text-sm font-medium">English (US)</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-surface-container-highest p-2 rounded-md border border-black/5 dark:border-white/5">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                <span className="text-sm font-medium">UTC -05:00 (EST)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="col-span-12 lg:col-span-8 bg-surface-container-highestest rounded-xl p-8 shadow-[0px_12px_32px_-4px_rgba(17,24,39,0.06)] border border-black/5 dark:border-white/5">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="material-symbols-outlined text-tertiary">security</span>
                                <h2 className="text-lg font-bold text-on-surface">Security &amp; Protocols</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Identity Update</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Current Password</label>
                                            <input className="w-full bg-surface-container-highest border-0 rounded-md focus:ring-2 focus:ring-tertiary text-on-surface py-2.5 px-4 transition-all" placeholder="••••••••••••" type="password" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">New Password</label>
                                            <input className="w-full bg-surface-container-highest border-0 rounded-md focus:ring-2 focus:ring-tertiary text-on-surface py-2.5 px-4 transition-all" placeholder="Min 12 characters" type="password" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Confirm New Password</label>
                                            <input className="w-full bg-surface-container-highest border-0 rounded-md focus:ring-2 focus:ring-tertiary text-on-surface py-2.5 px-4 transition-all" type="password" />
                                        </div>
                                        <button className="w-full py-2.5 bg-tertiary-container text-white font-bold rounded-md hover:bg-tertiary transition-colors">Update Password</button>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="bg-surface-container-highest p-5 rounded-lg border border-black/5 dark:border-white/5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-on-surface text-sm">Two-Factor Authentication</h3>
                                                <p className="text-xs text-on-surface-variant mt-1">Add an extra layer of structural integrity to your account.</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-primary bg-primary-fixed/30 px-2 py-1 rounded">SECURE</span>
                                        </div>
                                        <button className="w-full py-2 border-2 border-primary text-primary font-bold rounded-md hover:bg-surface-container-highest transition-colors text-sm">Manage 2FA Settings</button>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Active Ledger Access</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4 p-3 bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-md">
                                                <span className="material-symbols-outlined text-on-surface-variant">desktop_windows</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold">Chrome on macOS</span>
                                                        <span className="text-[9px] bg-primary text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter font-bold">Current</span>
                                                    </div>
                                                    <div className="text-[10px] text-on-surface-variant technical-data">IP: 192.168.1.14 | Richmond, VA</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-3 bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-md">
                                                <span className="material-symbols-outlined text-on-surface-variant">smartphone</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold">Safari on iPhone 15</span>
                                                    </div>
                                                    <div className="text-[10px] text-on-surface-variant technical-data">IP: 72.14.23.102 | 4 hours ago</div>
                                                </div>
                                                <button className="text-[10px] font-bold text-error uppercase tracking-widest hover:underline">Revoke</button>
                                            </div>
                                        </div>
                                        <button className="text-xs text-secondary font-bold hover:underline">Logout from all other devices</button>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="col-span-12 lg:col-span-4 bg-[#004e36] text-white rounded-xl p-8 flex flex-col justify-between h-full shadow-[0px_12px_32px_-4px_rgba(0,78,54,0.2)]">
                            <div>
                                <div className="h-10 w-10 bg-surface-container-highest/10 rounded-lg flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-white">verified_user</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Account Status: Verified</h3>
                                <p className="text-sm text-on-primary-container/80 leading-relaxed mb-6">Your identity has been fully verified against the master ledger. You have full access to high-availability database instances.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Member Since</span>
                                    <span className="technical-data text-sm font-bold">MAR 2023</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Trust Score</span>
                                    <span className="technical-data text-sm font-bold">99.8%</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Access Level</span>
                                    <span className="technical-data text-sm font-bold">SUPERADMIN</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <div className="h-16 md:hidden"></div>
        </div>
    )
}

export default UserProfile
