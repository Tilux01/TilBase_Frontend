import React, { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import userIcon from "../Images/user.png";
import { objContext } from '../App';

const DashboardLayout = ({ children }) => {
    const { userCred, setUserCred, currentProjectCred, setCurrentProjectCred, AllProject, theme, setTheme, setProjectHistory, serverRoute, projectHistory, globalSearch, setGlobalSearch } = useContext(objContext);
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const [isProjectDropdownOpen, setIsProjectDropdownOpen] = React.useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);

    const unreadHistory = projectHistory ? projectHistory.filter(h => !h.is_read) : [];

    const markHistoryRead = (historyIds) => {
        if (!historyIds || historyIds.length === 0) return;
        
        // Optimistic update
        setProjectHistory(prev => prev.map(h => 
            historyIds.includes(h.id) ? { ...h, is_read: 1 } : h
        ));
        
        axios.post(`${serverRoute}/markHistoryRead`, {
            userId: userCred?.id,
            Profile_Key: userCred?.Profile_Key,
            projectId: currentProjectCred?.id,
            projectKey: currentProjectCred?.Project_Key,
            historyIds
        }).catch(err => console.error("Error marking history read", err));
    };

    const handleNotificationClick = (alert) => {
        markHistoryRead([alert.id]);
        setIsNotificationsOpen(false);
        
        const title = alert.History_Title.toLowerCase();
        if (title.includes("cluster")) navigate("/clusters");
        else if (title.includes("network")) navigate("/network-access");
        else if (title.includes("data") || title.includes("user") || title.includes("access") || title.includes("admin")) navigate("/data-access");
        else if (title.includes("backup")) navigate("/backup");
        else if (title.includes("error") || title.includes("fail") || title.includes("alert")) navigate("/monitoring");
        else navigate("/dashboard");
    };

    const clearAllNotifications = () => {
        const ids = unreadHistory.map(h => h.id);
        markHistoryRead(ids);
        setIsNotificationsOpen(false);
    };

    useEffect(() => {
        if (currentProjectCred?.id && userCred?.id) {
            axios.post(`${serverRoute}/fetchHistory`, {
                userId: userCred?.id,
                Profile_Key: userCred?.Profile_Key,
                projectId: currentProjectCred?.id,
                projectKey: currentProjectCred?.Project_Key
            })
            .then(res => {
                setProjectHistory(res.data.message || []);
            })
            .catch(err => console.error("Error fetching history on switch:", err));
        }
    }, [currentProjectCred?.id, userCred?.id, serverRoute]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const getLinkClass = (path) => {
        if (currentPath === path || currentPath.startsWith(path + '/')) {
            return "cursor-pointer bg-primary/10 text-primary border-l-2 border-primary font-semibold px-4 py-3 flex items-center gap-3 transition-all";
        }
        return "cursor-pointer text-on-surface-variant px-4 py-3 flex items-center gap-3 hover:bg-surface-container transition-all border-l-2 border-transparent";
    };

    const handleLogout = () => {
        setUserCred(null);
        setCurrentProjectCred(null);
        navigate('/signin');
    };

    return (
        <div style={{width: "100%"}}>
            <header className="fixed top-0 w-full h-16 z-40 bg-surface-container-lowest border-b border-outline-variant/30 flex justify-between items-center px-6 max-w-full transition-colors duration-300">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-bold tracking-tighter text-primary">TIlBase</span>
                    <div className="hidden md:flex items-center bg-surface-container px-3 py-1.5 rounded-lg border border-transparent focus-within:border-primary transition-all">
                        <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
                        <input 
                            className="bg-transparent border-none focus:ring-0 text-sm font-medium w-64 text-on-surface" 
                            placeholder="Search clusters..." 
                            type="text" 
                            value={globalSearch}
                            onChange={(e) => {
                                setGlobalSearch(e.target.value);
                                if (currentPath !== '/clusters' && e.target.value.trim() !== '') {
                                    navigate('/clusters');
                                }
                            }} 
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={toggleTheme} className="p-2 text-on-surface-variant hover:bg-surface-container transition-colors rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                    <div className="relative">
                        <button 
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                            className="p-2 text-on-surface-variant hover:bg-surface-container transition-colors rounded-lg relative"
                        >
                            <span className="material-symbols-outlined">notifications</span>
                            {unreadHistory.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface-container-lowest"></span>
                            )}
                        </button>
                        
                        {isNotificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg z-50 overflow-hidden">
                                <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container/20">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-on-surface text-sm">Notifications</h3>
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">{unreadHistory.length} New</span>
                                    </div>
                                    {unreadHistory.length > 0 && (
                                        <button onClick={clearAllNotifications} className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/10">
                                    {unreadHistory.length > 0 ? (
                                        unreadHistory.slice(0, 10).map((alert, idx) => (
                                            <div key={idx} onClick={() => handleNotificationClick(alert)} className="p-4 hover:bg-surface-container transition-colors flex gap-3 group cursor-pointer">
                                                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-[16px]">info</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-on-surface line-clamp-1">{alert.History_Title}</p>
                                                    <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{alert.History_Description}</p>
                                                    <p className="text-[10px] font-bold text-on-surface-variant/70 mt-2 uppercase tracking-wider">{new Date(alert.Time_Stamp).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">notifications_paused</span>
                                            <p className="text-sm font-medium text-on-surface-variant">No new notifications</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 border-t border-outline-variant/10 bg-surface-container/20 text-center">
                                    <Link to="/dashboard" onClick={() => setIsNotificationsOpen(false)} className="text-xs font-bold text-primary hover:underline">View all history</Link>
                                </div>
                            </div>
                        )}
                    </div>
                    <Link to="/support">
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container transition-colors rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined">help</span>
                        </button>
                    </Link>
                    <Link to="/settings">
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container transition-colors rounded-lg">
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                    </Link>
                    <div className="relative">
                        <div 
                            className="cursor-pointer ml-2 w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-outline-variant/30 hover:border-primary transition-colors"
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                        >
                            <img alt="Profile_Image" className="w-full h-full object-cover" src={userCred?.Profile_Img || userIcon} />
                        </div>
                        {isProfileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg z-50 overflow-hidden">
                                <div className="p-4 border-b border-outline-variant/10 bg-surface-container/20">
                                    <p className="font-bold text-sm text-on-surface">{userCred?.UserName || "User"}</p>
                                    <p className="text-xs text-on-surface-variant truncate mt-0.5">{userCred?.Email}</p>
                                </div>
                                <div className="p-2 flex flex-col">
                                    <Link 
                                        to="/settings" 
                                        onClick={() => setIsProfileDropdownOpen(false)}
                                        className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg transition-colors flex items-center gap-3 font-medium"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">person</span>
                                        My Profile
                                    </Link>
                                    <Link 
                                        to="/billing" 
                                        onClick={() => setIsProfileDropdownOpen(false)}
                                        className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg transition-colors flex items-center gap-3 font-medium"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">credit_card</span>
                                        Billing Details
                                    </Link>
                                </div>
                                <div className="p-2 border-t border-outline-variant/10">
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors flex items-center gap-3 font-bold"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">logout</span>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            
            <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] z-30 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col py-4 overflow-y-auto transition-colors duration-300">
                <div className="relative px-6 mb-6">
                    <div className="flex justify-between items-center group">
                        <div 
                            className="cursor-pointer flex-1" 
                            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                        >
                            <div className="flex items-center gap-1">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 hover:text-primary transition-colors">{currentProjectCred?.Project_Name || "No Project"}</h2>
                                <span className="material-symbols-outlined text-[14px] text-on-surface-variant/60">{isProjectDropdownOpen ? 'expand_less' : 'expand_more'}</span>
                            </div>
                            <p className="text-[10px] text-on-surface-variant opacity-70 technical-mono">Database Fleet</p>
                        </div>
                        <Link to="/new_project" title="Create New Project">
                            <button className="p-1 rounded bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/30 text-on-surface-variant group-hover:text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-[16px]">add</span>
                            </button>
                        </Link>
                    </div>

                    {isProjectDropdownOpen && (
                        <div className="absolute left-6 right-6 top-full mt-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-lg z-50 overflow-hidden">
                            <div className="max-h-48 overflow-y-auto">
                                {AllProject && AllProject.length > 0 ? (
                                    AllProject.map((project) => (
                                        <div 
                                            key={project.id}
                                            onClick={() => {
                                                setCurrentProjectCred(project);
                                                setIsProjectDropdownOpen(false);
                                            }}
                                            className={`px-4 py-3 cursor-pointer text-sm font-medium transition-colors ${currentProjectCred?.id === project.id ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-container'}`}
                                        >
                                            {project.Project_Name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-xs text-on-surface-variant">No projects found</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <nav className="flex flex-col">
                    <Link to="/dashboard">
                        <div className={getLinkClass('/dashboard')}>
                            <span className="material-symbols-outlined">storage</span>
                            <span className="text-sm">Dashboard</span>
                        </div>
                    </Link>
                    <Link to="/clusters">
                        <div className={getLinkClass('/clusters')}>
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="text-sm">Clusters</span>
                        </div>
                    </Link>
                    <Link to="/data-access">
                        <div className={getLinkClass('/data-access')}>
                            <span className="material-symbols-outlined">key</span>
                            <span className="text-sm">Database Access</span>
                        </div>
                    </Link>
                    <Link to="/network-access">
                        <div className={getLinkClass('/network-access')}>
                            <span className="material-symbols-outlined">lan</span>
                            <span className="text-sm">Network Access</span>
                        </div>
                    </Link>
                    <Link to="/security">
                        <div className={getLinkClass('/security')}>
                            <span className="material-symbols-outlined">security</span>
                            <span className="text-sm">Security</span>
                        </div>
                    </Link>
                    <Link to="/backup">
                        <div className={getLinkClass('/backup')}>
                            <span className="material-symbols-outlined">settings_backup_restore</span>
                            <span className="text-sm">Backups</span>
                        </div>
                    </Link>
                    <Link to="/monitoring">
                        <div className={getLinkClass('/monitoring')}>
                            <span className="material-symbols-outlined">monitoring</span>
                            <span className="text-sm">Monitoring</span>
                        </div>
                    </Link>
                    <Link to="/performance">
                        <div className={getLinkClass('/performance')}>
                            <span className="material-symbols-outlined">speed</span>
                            <span className="text-sm">Performance</span>
                        </div>
                    </Link>
                    <Link to="/global">
                        <div className={getLinkClass('/global')}>
                            <span className="material-symbols-outlined">public</span>
                            <span className="text-sm">Global</span>
                        </div>
                    </Link>
                    <Link to="/billing">
                        <div className={getLinkClass('/billing')}>
                            <span className="material-symbols-outlined">payments</span>
                            <span className="text-sm">Billing</span>
                        </div>
                    </Link>

                    <Link to="/settings">
                        <div className={getLinkClass('/settings')}>
                            <span className="material-symbols-outlined">settings</span>
                            <span className="text-sm">Settings</span>
                        </div>
                    </Link>
                    <Link to="/support">
                        <div className={getLinkClass('/support')}>
                            <span className="material-symbols-outlined">contact_support</span>
                            <span className="text-sm">Support</span>
                        </div>
                    </Link>
                </nav>
            </aside>
            
            <main className="ml-64 pt-24 pb-12 px-8 min-h-screen bg-surface-container-lowest w-[calc(100%-16rem)]">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
