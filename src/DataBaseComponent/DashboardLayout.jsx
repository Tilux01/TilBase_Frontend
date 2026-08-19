import React, { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import userIcon from "../Images/user.png";
import { objContext } from '../App';
import TilBaseLogo from '../Components/TilBaseLogo';

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
      }).then(res => setProjectHistory(res.data.message || []))
      .catch(err => console.error("Error fetching history on switch:", err));
    }
  }, [currentProjectCred?.id, userCred?.id, serverRoute]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const getLinkClass = (path) => {
    if (currentPath === path || currentPath.startsWith(path + '/')) {
      return "flex items-center gap-3 text-[13px] font-semibold text-on-surface bg-surface-container border border-black/5 dark:border-white/5 px-3 py-2.5 rounded-xl cursor-pointer shadow-inner [&>span]:text-primary";
    }
    return "flex items-center gap-3 text-[13px] font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest px-3 py-2.5 rounded-xl transition-colors cursor-pointer";
  };

  const handleLogout = () => {
    setUserCred(null);
    setCurrentProjectCred(null);
    navigate('/signin');
  };

  return (
    <div style={{width: "100%", backgroundColor: "var(--color-background)"}}>
      <aside className="fixed left-0 top-0 w-64 h-screen z-50 bg-background border-r border-black/5 dark:border-white/5 flex flex-col py-6 overflow-y-auto transition-colors duration-300" style={{ scrollbarWidth: 'none' }}>
        <div className="flex items-center gap-3 px-6 mb-6 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <TilBaseLogo />
          <span className="font-bold text-base text-on-surface tracking-wide">TilBase Analytics</span>
        </div>

        <div className="relative px-6 mb-6">
          <div className="flex justify-between items-center group">
            <div className="cursor-pointer flex-1" onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}>
              <div className="flex items-center gap-1">
                <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface hover:text-primary transition-colors">{currentProjectCred?.Project_Name || "No Project"}</h2>
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant/60">{isProjectDropdownOpen ? 'expand_less' : 'expand_more'}</span>
              </div>
              <p className="text-[10px] text-on-surface-variant opacity-70 technical-mono">Database Fleet</p>
            </div>
            <Link to="/new_project" title="Create New Project">
              <button className="p-1 rounded bg-surface-container border border-black/5 dark:border-white/5 hover:bg-surface-container-highest transition-colors text-on-surface-variant group-hover:text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px]">add</span>
              </button>
            </Link>
          </div>

          {isProjectDropdownOpen && (
            <div className="absolute left-6 right-6 top-full mt-2 bg-surface-container border border-black/5 dark:border-white/5 rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="max-h-48 overflow-y-auto">
                {AllProject && AllProject.length > 0 ? (
                  AllProject.map((project) => (
                    <div key={project.id} onClick={() => { setCurrentProjectCred(project); setIsProjectDropdownOpen(false); }} className={`px-4 py-3 cursor-pointer text-sm font-medium transition-colors ${currentProjectCred?.id === project.id ? 'bg-primary-container text-on-primary-container' : 'text-on-surface hover:bg-surface-container-highest'}`}>
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

        <nav className="flex flex-col gap-1 px-3">
          <Link to="/dashboard"><div className={getLinkClass('/dashboard')}><span className="material-symbols-outlined text-[18px]">storage</span> Dashboard</div></Link>
          <Link to="/clusters"><div className={getLinkClass('/clusters')}><span className="material-symbols-outlined text-[18px]">dashboard</span> Clusters</div></Link>
          <Link to="/data-access"><div className={getLinkClass('/data-access')}><span className="material-symbols-outlined text-[18px]">key</span> Database Access</div></Link>
          <Link to="/network-access"><div className={getLinkClass('/network-access')}><span className="material-symbols-outlined text-[18px]">lan</span> Network Access</div></Link>
          <Link to="/security"><div className={getLinkClass('/security')}><span className="material-symbols-outlined text-[18px]">security</span> Security</div></Link>
          <Link to="/backup"><div className={getLinkClass('/backup')}><span className="material-symbols-outlined text-[18px]">settings_backup_restore</span> Backups</div></Link>
          <Link to="/monitoring"><div className={getLinkClass('/monitoring')}><span className="material-symbols-outlined text-[18px]">monitoring</span> Monitoring</div></Link>
          <Link to="/performance"><div className={getLinkClass('/performance')}><span className="material-symbols-outlined text-[18px]">speed</span> Performance</div></Link>
          <Link to="/global"><div className={getLinkClass('/global')}><span className="material-symbols-outlined text-[18px]">public</span> Global</div></Link>
          <Link to="/billing"><div className={getLinkClass('/billing')}><span className="material-symbols-outlined text-[18px]">payments</span> Billing</div></Link>
          <Link to="/settings"><div className={getLinkClass('/settings')}><span className="material-symbols-outlined text-[18px]">settings</span> Settings</div></Link>
          <Link to="/support"><div className={getLinkClass('/support')}><span className="material-symbols-outlined text-[18px]">contact_support</span> Support</div></Link>
        </nav>
      </aside>

      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-[64px] z-40 bg-background flex justify-between items-center px-10 transition-colors duration-300">
        <div className="flex-1 max-w-md relative hidden md:block">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-full py-2.5 pl-12 pr-4 text-sm text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-0 transition-colors" placeholder="Search Clusters..." type="text" value={globalSearch} onChange={(e) => { setGlobalSearch(e.target.value); if (currentPath !== '/clusters' && e.target.value.trim() !== '') { navigate('/clusters'); } }} />
        </div>
        <div className="flex items-center gap-6 ml-auto">
          <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-surface-container border border-black/5 dark:border-white/5 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer ">
            <span className="material-symbols-outlined text-[18px]">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <div className="relative">
            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="w-10 h-10 rounded-full bg-surface-container border border-black/5 dark:border-white/5 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer relative">
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              {unreadHistory.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>}
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-surface-container border border-black/5 dark:border-white/5 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="p-4 flex justify-between items-center bg-surface-container">
                  <h3 className="font-bold text-on-surface text-sm">Notifications</h3>
                  {unreadHistory.length > 0 && <button onClick={clearAllNotifications} className="text-xs font-bold text-on-surface-variant hover:text-primary">Clear All</button>}
                </div>
                <div className="max-h-80 overflow-y-auto ">
                  {unreadHistory.length > 0 ? (
                    unreadHistory.slice(0, 10).map((alert, idx) => (
                      <div key={idx} onClick={() => handleNotificationClick(alert)} className="p-4 hover:bg-surface-container-highest transition-colors flex gap-3 group cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-surface-container border border-black/5 dark:border-white/5 flex items-center justify-center shrink-0 "><span className="material-symbols-outlined text-[16px]">info</span></div>
                        <div>
                          <p className="text-sm font-bold text-on-surface line-clamp-1">{alert.History_Title}</p>
                          <p className="text-[10px] font-bold text-on-surface-variant mt-2 uppercase tracking-wider">{new Date(alert.Time_Stamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  ) : <div className="p-8 text-center text-sm font-medium text-on-surface-variant">No new notifications</div>}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <div className="cursor-pointer flex items-center gap-3 border-l border-black/5 dark:border-white/5 pl-6 ml-2" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-[1.5px]">
                <div className="w-full h-full bg-background text-on-surface flex items-center justify-center text-sm font-bold rounded-full overflow-hidden">
                  {userCred?.Profile_Img ? <img alt="Profile" className="w-full h-full object-cover" src={userCred?.Profile_Img} /> : (userCred?.UserName?.charAt(0)?.toUpperCase() || "T")}
                </div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-on-surface">{userCred?.UserName || "Tilux"}</span>
                <span className="text-[10px] text-on-surface-variant">Pro Member</span>
              </div>
            </div>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-surface-container border border-black/5 dark:border-white/5 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="p-2 flex flex-col">
                  <Link to="/settings" onClick={() => setIsProfileDropdownOpen(false)} className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface rounded-lg transition-colors flex items-center gap-3 font-medium"><span className="material-symbols-outlined text-[18px]">person</span>My Profile</Link>
                  <Link to="/billing" onClick={() => setIsProfileDropdownOpen(false)} className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface rounded-lg transition-colors flex items-center gap-3 font-medium"><span className="material-symbols-outlined text-[18px]">credit_card</span>Billing Details</Link>
                </div>
                <div className="p-2 "><button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container hover:text-on-error-container rounded-lg transition-colors flex items-center gap-3 font-bold"><span className="material-symbols-outlined text-[18px]">logout</span>Sign Out</button></div>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="ml-64 pt-[64px] pb-12 px-10 min-h-screen bg-background w-[calc(100%-16rem)] relative z-0">
        {children}
      </main>
    </div>
  );
};
export default DashboardLayout;
