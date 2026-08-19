import { useGlobalModal } from "../Context/GlobalModalContext";
import React, { useContext, useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { objContext } from '../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { showModal } = useGlobalModal();

    const { userCred, setUserCred, currentProjectCred, serverRoute } = useContext(objContext);
    const [activeTab, setActiveTab] = useState('profile'); 
    const navigate = useNavigate();

    useEffect(() => {
        if (!userCred) {
            navigate('/signin');
        }
    }, [userCred, navigate]);

    
    const [userName, setUserName] = useState(userCred?.UserName || '');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(userCred?.Profile_Img || '');
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // Workspace State
    const [projectName, setProjectName] = useState(currentProjectCred?.Project_Name || '');
    const [projectDesc, setProjectDesc] = useState(currentProjectCred?.Project_Description || '');
    const [isSavingWorkspace, setIsSavingWorkspace] = useState(false);

    // Handlers
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async () => {
        setIsSavingProfile(true);
        try {
            let finalAvatarUrl = userCred?.Profile_Img || '';

            if (avatarFile) {
                // Convert file to base64 Data URI
                const base64DataURI = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(avatarFile);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });

                // Upload to Cloudinary using unsigned preset
                const uploadUrl = `https://api.cloudinary.com/v1_1/dyyv2kv1x/image/upload`;
                const cloudinaryData = new FormData();
                cloudinaryData.append('file', base64DataURI);
                cloudinaryData.append('upload_preset', 'Siwes_Logbook');
                cloudinaryData.append('quality', 'auto');

                const uploadRes = await fetch(uploadUrl, {
                    method: 'POST',
                    body: cloudinaryData
                });
                
                const data = await uploadRes.json();
                
                if (data.error) {
                    throw new Error(data.error.message);
                }
                
                finalAvatarUrl = data.secure_url;
            }

            
            await axios.post(`${serverRoute}/updateProfile`, {
                user_id: userCred.id,
                UserName: userName,
                Profile_Img: finalAvatarUrl
            });
            
            setUserCred(prev => ({ 
                ...prev, 
                UserName: userName, 
                Profile_Img: finalAvatarUrl 
            }));
            setAvatarFile(null);
            await showModal({ type: "alert", message: "Profile updated successfully!" });
        } catch (error) {
            console.error(error);
            await showModal({ type: "alert", message: "Failed to update profile." });
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleSaveWorkspace = async () => {
        
        setIsSavingWorkspace(true);
        try {
            await axios.post(`${serverRoute}/updateWorkspace`, {
                user_id: userCred.id,
                project_id: currentProjectCred.id,
                Project_Name: projectName,
                Project_Description: projectDesc
            });
            
            
            currentProjectCred.Project_Name = projectName;
            currentProjectCred.Project_Description = projectDesc;
            await showModal({ type: "alert", message: "Workspace updated successfully!" });
        } catch (error) {
            console.error(error);
            await showModal({ type: "alert", message: "Failed to update workspace." });
        } finally {
            setIsSavingWorkspace(false);
        }
    };

    const handleRegenerateProfileKey = async () => {
        if (!await showModal({ type: "confirm", message: "Are you sure you want to regenerate your Profile Key? Any external apps using the old key will be broken.", isDestructive: true })) return;
        try {
            const response = await axios.post(`${serverRoute}/regenerateProfileKey`, { userId: userCred.id });
            setUserCred(prev => ({ ...prev, profile_key: response.data.message }));
            await showModal({ type: "alert", message: "Profile Key regenerated successfully!" });
        } catch (error) {
            console.error(error);
            await showModal({ type: "alert", message: "Failed to regenerate Profile Key." });
        }
    };

    const handleRegenerateProjectKey = async () => {
        
        if (!await showModal({ type: "confirm", message: "Are you sure you want to regenerate this Project Key?", isDestructive: true })) return;
        try {
            const response = await axios.post(`${serverRoute}/regenerateProjectKey`, { 
                userId: userCred.id,
                projectId: currentProjectCred.id,
                projectName: currentProjectCred.Project_Name
            });
            currentProjectCred.Project_Key = response.data.message;
            await showModal({ type: "alert", message: "Project Key regenerated successfully!" });
        } catch (error) {
            console.error(error);
            await showModal({ type: "alert", message: "Failed to regenerate Project Key." });
        }
    };

    const handleDeleteAccount = async () => {
        const confirmName = await showModal({ type: "prompt", message: `To delete your account, please type your username: ${userCred.UserName}` });
        if (confirmName !== userCred.UserName) {
            await showModal({ type: "alert", message: "Username did not match. Account deletion cancelled." });
            return;
        }
        
        try {
            await axios.post(`${serverRoute}/deleteAccount`, { user_id: userCred.id });
            await showModal({ type: "alert", message: "Account deleted successfully." });
            navigate("/signin");
        } catch (error) {
            console.error(error);
            await showModal({ type: "alert", message: "Failed to delete account." });
        }
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-end mb-10">
                <div className="space-y-1">
                    <h1 className="text-display-sm text-4xl font-extrabold tracking-tight text-on-surface">Settings</h1>
                    <p className="text-on-surface-variant text-sm font-medium">Manage your profile, preferences, and workspace configuration.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="col-span-1 flex flex-col gap-2">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-3 p-4 rounded-lg font-bold transition-all border-l-4 ${activeTab === 'profile' ? 'bg-surface-container-high text-primary border-primary' : 'hover:bg-surface-container border border-black/5 dark:border-white/5 text-on-surface-variant border-transparent'}`}>
                        <span className="material-symbols-outlined">person</span>
                        Profile
                    </button>
                    <button 
                        onClick={() => setActiveTab('workspace')}
                        className={`flex items-center gap-3 p-4 rounded-lg font-bold transition-all border-l-4 ${activeTab === 'workspace' ? 'bg-surface-container-high text-primary border-primary' : 'hover:bg-surface-container border border-black/5 dark:border-white/5 text-on-surface-variant border-transparent'}`}>
                        <span className="material-symbols-outlined">work</span>
                        Workspace
                    </button>
                    <button 
                        onClick={() => setActiveTab('apikeys')}
                        className={`flex items-center gap-3 p-4 rounded-lg font-bold transition-all border-l-4 ${activeTab === 'apikeys' ? 'bg-surface-container-high text-primary border-primary' : 'hover:bg-surface-container border border-black/5 dark:border-white/5 text-on-surface-variant border-transparent'}`}>
                        <span className="material-symbols-outlined">api</span>
                        API Keys
                    </button>
                </div>

                <div className="col-span-3 flex flex-col gap-6">
                    {}
                    {activeTab === 'profile' && (
                        <>
                            <div className="bg-surface-container p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                                <h3 className="text-xl font-bold text-on-surface mb-6">Profile Information</h3>
                                
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-24 h-24 rounded-full bg-surface-container border border-black/5 dark:border-white/5 overflow-hidden border-2 border-black/5 dark:border-white/5 flex-shrink-0 relative group">
                                        <img src={avatarPreview || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="Profile" className="w-full h-full object-cover transition-opacity group-hover:opacity-50" onError={(e) => { e.target.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"; }} />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <span className="material-symbols-outlined text-white">upload</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <label className="text-sm font-bold text-on-surface-variant">Upload New Avatar</label>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 p-2 rounded-lg border border-black/5 dark:border-white/5 text-on-surface focus:outline-none focus:border-primary transition-colors text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-surface-container-highest-highest file:text-primary hover:file:bg-surface-container-highest-highest cursor-pointer" 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-on-surface-variant">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={userName} 
                                            onChange={(e) => setUserName(e.target.value)}
                                            className="w-full bg-surface-container border border-black/5 dark:border-white/5 p-3 rounded-lg border border-black/5 dark:border-white/5 text-on-surface focus:outline-none focus:border-primary transition-colors" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-on-surface-variant">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={userCred?.Email || ''} 
                                            disabled 
                                            className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 p-3 rounded-lg border border-black/5 dark:border-white/5 text-on-surface-variant opacity-70 cursor-not-allowed" 
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button 
                                        onClick={handleSaveProfile}
                                        disabled={isSavingProfile}
                                        className="bg-primary hover:bg-primary/90 text-on-primary px-6 py-2.5 rounded-lg font-bold transition-all shadow-md flex items-center gap-2">
                                        {isSavingProfile ? <span className="material-symbols-outlined animate-spin">refresh</span> : null}
                                        Save Profile
                                    </button>
                                </div>
                            </div>

                            <div className="bg-surface-container p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                                <h3 className="text-xl font-bold text-on-surface mb-6">Danger Zone</h3>
                                <div className="p-4 border border-error/30 bg-error-container/20 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-error">Delete Account</h4>
                                        <p className="text-xs text-on-surface-variant mt-1">Permanently remove your account and all projects. This action cannot be undone.</p>
                                    </div>
                                    <button onClick={handleDeleteAccount} className="bg-error text-on-error px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-error/90 transition-colors">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* WORKSPACE TAB */}
                    {activeTab === 'workspace' && (
                        <div className="bg-surface-container p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                            <h3 className="text-xl font-bold text-on-surface mb-6">Workspace Configuration</h3>
                            {currentProjectCred ? (
                                <>
                                    <div className="space-y-6 mb-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-on-surface-variant">Project Name</label>
                                            <input 
                                                type="text" 
                                                value={projectName} 
                                                onChange={(e) => setProjectName(e.target.value)}
                                                className="w-full bg-surface-container border border-black/5 dark:border-white/5 p-3 rounded-lg border border-black/5 dark:border-white/5 text-on-surface focus:outline-none focus:border-primary transition-colors" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-on-surface-variant">Project Description</label>
                                            <textarea 
                                                value={projectDesc} 
                                                onChange={(e) => setProjectDesc(e.target.value)}
                                                rows="3"
                                                className="w-full bg-surface-container border border-black/5 dark:border-white/5 p-3 rounded-lg border border-black/5 dark:border-white/5 text-on-surface focus:outline-none focus:border-primary transition-colors" 
                                            ></textarea>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-on-surface-variant">Environment</label>
                                            <input 
                                                type="text" 
                                                value={currentProjectCred?.Environment || ''} 
                                                disabled 
                                                className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 p-3 rounded-lg border border-black/5 dark:border-white/5 text-on-surface-variant opacity-70 cursor-not-allowed uppercase" 
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={handleSaveWorkspace}
                                            disabled={isSavingWorkspace}
                                            className="bg-primary hover:bg-primary/90 text-on-primary px-6 py-2.5 rounded-lg font-bold transition-all shadow-md flex items-center gap-2">
                                            {isSavingWorkspace ? <span className="material-symbols-outlined animate-spin">refresh</span> : null}
                                            Save Workspace
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p className="text-on-surface-variant">No active workspace selected. Please select a project first.</p>
                            )}
                        </div>
                    )}

                    {/* API KEYS TAB */}
                    {activeTab === 'apikeys' && (
                        <div className="space-y-6">
                            <div className="bg-surface-container p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                                <h3 className="text-xl font-bold text-on-surface mb-2">Profile Key</h3>
                                <p className="text-sm text-on-surface-variant mb-6">Your master profile key used for global authentication.</p>
                                
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-surface-container border border-black/5 dark:border-white/5 p-4 rounded-lg border border-black/5 dark:border-white/5 font-mono text-sm overflow-x-auto text-on-surface whitespace-nowrap">
                                        {userCred?.profile_key || 'No Key Found'}
                                    </div>
                                    <button 
                                        onClick={handleRegenerateProfileKey}
                                        className="px-4 py-3 bg-surface-container-high hover:bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-lg text-primary font-bold text-sm transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">autorenew</span>
                                        Regenerate
                                    </button>
                                </div>
                            </div>

                            <div className="bg-surface-container p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                                <h3 className="text-xl font-bold text-on-surface mb-2">Project Key</h3>
                                <p className="text-sm text-on-surface-variant mb-6">The access key for the currently active workspace.</p>
                                
                                {currentProjectCred ? (
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 bg-surface-container border border-black/5 dark:border-white/5 p-4 rounded-lg border border-black/5 dark:border-white/5 font-mono text-sm overflow-x-auto text-on-surface whitespace-nowrap">
                                            {currentProjectCred?.Project_Key || 'No Key Found'}
                                        </div>
                                        <button 
                                            onClick={handleRegenerateProjectKey}
                                            className="px-4 py-3 bg-surface-container-high hover:bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-lg text-primary font-bold text-sm transition-colors flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">autorenew</span>
                                            Regenerate
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-on-surface-variant">No active workspace selected.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
