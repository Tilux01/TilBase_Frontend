import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { objContext } from '../App';
import { io } from 'socket.io-client';
import { useGlobalModal } from '../Context/GlobalModalContext';

const ChatbaseExplorer = ({ cluster }) => {
    const { serverRoute, adminData } = useContext(objContext);
    const { showModal } = useGlobalModal();

    const [channels, setChannels] = useState([]);
    const [activeChannel, setActiveChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState([]);
    const [activeConnections, setActiveConnections] = useState(1);
    const [messageInput, setMessageInput] = useState('');
    const [socket, setSocket] = useState(null);
    const [typingUsers, setTypingUsers] = useState({});
    
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Fetch Channels
    const loadChannels = async () => {
        try {
            const res = await axios.post(`${serverRoute}/api/chatbase/getChannels`, { clusterId: cluster.id });
            const mappedChannels = (res.data.channels || []).map(c => ({
                ...c,
                name: c.channel_id,
            }));
            setChannels(mappedChannels);
            if (mappedChannels.length > 0 && !activeChannel) {
                setActiveChannel(mappedChannels[0]);
            }
        } catch (error) {
            console.error("Failed to load channels");
        }
    };

    // Load Messages for Active Channel
    const loadMessages = async () => {
        if (!activeChannel) return;
        try {
            const res = await axios.post(`${serverRoute}/api/chatbase/getMessages`, { 
                clusterId: cluster.id, 
                channelId: activeChannel.id 
            });
            setMessages((res.data.messages || []).map(m => ({
                ...m,
                senderId: m.sender_id || m.senderId,
                type: m.type || (m.attachments ? 'image' : 'text')
            })));
        } catch (error) {
            console.error("Failed to fetch messages");
        }
    };

    // Load Members for Active Channel
    const loadMembers = async () => {
        if (!activeChannel) return;
        try {
            const res = await axios.post(`${serverRoute}/api/chatbase/getMembers`, { 
                clusterId: cluster.id, 
                channelId: activeChannel.id 
            });
            setMembers(res.data.members || []);
        } catch (error) {
            console.error("Failed to fetch members");
        }
    };

    useEffect(() => {
        if (cluster && cluster.id) {
            loadChannels();
        }
    }, [cluster]);

    useEffect(() => {
        if (activeChannel) {
            loadMessages();
            loadMembers();
        }
    }, [activeChannel]);

    // Setup Socket
    useEffect(() => {
        const newSocket = io(serverRoute);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('join_cluster', cluster.id);
            if (activeChannel) {
                newSocket.emit('join_cluster', `chatbase_${activeChannel.id}`);
            }
        });

        newSocket.on('telemetry_connect', () => setActiveConnections(p => p + 1));
        newSocket.on('telemetry_disconnect', () => setActiveConnections(p => Math.max(1, p - 1)));

        newSocket.on('chatbase_message', (msg) => {
            if (activeChannel && (msg.channelId === activeChannel.id || msg.channel_id === activeChannel.id)) {
                setMessages(prev => [...prev, {
                    ...msg,
                    senderId: msg.sender_id || msg.senderId,
                    type: msg.type || (msg.attachments ? 'image' : 'text')
                }]);
            }
        });

        newSocket.on('message_pinned', (data) => {
            if (activeChannel && data.channelId === activeChannel.id) {
                setMessages(prev => prev.map(m => (m.id === data.msgId || m.msg_id === data.msgId) ? { ...m, is_pinned: 1 } : m));
            }
        });

        newSocket.on('message_unpinned', (data) => {
            if (activeChannel && data.channelId === activeChannel.id) {
                setMessages(prev => prev.map(m => (m.id === data.msgId || m.msg_id === data.msgId) ? { ...m, is_pinned: 0 } : m));
            }
        });

        newSocket.on('channel_frozen', (data) => {
            if (activeChannel && data.channelId === activeChannel.id) {
                setActiveChannel(prev => ({ ...prev, is_frozen: 1 }));
            }
        });

        newSocket.on('channel_unfrozen', (data) => {
            if (activeChannel && data.channelId === activeChannel.id) {
                setActiveChannel(prev => ({ ...prev, is_frozen: 0 }));
            }
        });

        newSocket.on('typing_status', (data) => {
            if (activeChannel && data.channelId === activeChannel.id) {
                setTypingUsers(prev => ({ ...prev, [data.userId]: data.isTyping }));
            }
        });

        return () => newSocket.close();
    }, [serverRoute, cluster.id, activeChannel]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typingUsers]);

    const handleCreateChannel = async () => {
        const name = await showModal({
            type: "prompt",
            title: "Create Channel",
            message: "Enter a name for the new channel:"
        });
        if (!name) return;
        try {
            await axios.post(`${serverRoute}/api/chatbase/createChannel`, {
                clusterId: cluster.id,
                channelName: name,
                creatorId: adminData?.uid || 'Admin'
            });
            loadChannels();
        } catch (error) {
            showModal({ type: 'alert', title: 'Error', message: "Failed to create channel" });
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeChannel) return;

        try {
            await axios.post(`${serverRoute}/api/chatbase/sendMessage`, {
                clusterId: cluster.id,
                channelId: activeChannel.id,
                senderId: adminData?.uid || 'Admin',
                text: messageInput
            });
            setMessageInput('');
            
            if (socket) {
                socket.emit('chatbase_typing', {
                    clusterId: cluster.id,
                    channelId: activeChannel.id,
                    userId: adminData?.uid || 'Admin',
                    isTyping: false
                });
            }
        } catch (error) {
            showModal({ type: 'alert', title: 'Error', message: "Failed to send message" });
        }
    };

    const handleMediaUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !activeChannel) return;

        const formData = new FormData();
        formData.append('clusterId', cluster.id);
        formData.append('channelId', activeChannel.id);
        formData.append('senderId', adminData?.uid || 'Admin');
        
        const isAudio = file.type.startsWith('audio/');
        const endpoint = isAudio ? 'sendVoiceNote' : 'sendMediaMessage';
        const fileKey = isAudio ? 'voice' : 'media';
        
        if (isAudio) formData.append('duration', '0');
        formData.append(fileKey, file);

        try {
            await axios.post(`${serverRoute}/api/chatbase/${endpoint}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } catch (error) {
            showModal({ type: 'alert', title: 'Error', message: "Failed to upload media" });
        }
    };

    const handleTogglePin = async (msgId, isCurrentlyPinned) => {
        try {
            const endpoint = isCurrentlyPinned ? 'unpinMessage' : 'pinMessage';
            await axios.post(`${serverRoute}/api/chatbase/${endpoint}`, {
                clusterId: cluster.id,
                channelId: activeChannel.id,
                msgId: msgId,
                userId: adminData?.uid || 'Admin'
            });
        } catch (error) {
            showModal({ type: 'alert', title: 'Error', message: "Failed to pin/unpin" });
        }
    };

    const handleToggleFreeze = async () => {
        try {
            const endpoint = activeChannel.is_frozen ? 'unfreezeChannel' : 'freezeChannel';
            await axios.post(`${serverRoute}/api/chatbase/${endpoint}`, {
                clusterId: cluster.id,
                channelId: activeChannel.id,
                userId: adminData?.uid || 'Admin'
            });
        } catch (error) {
            showModal({ type: 'alert', title: 'Error', message: "Failed to freeze/unfreeze channel. Are you an admin?" });
        }
    };

    const handleBanMember = async (targetUserId) => {
        try {
            await axios.post(`${serverRoute}/api/chatbase/banMember`, {
                clusterId: cluster.id,
                channelId: activeChannel.id,
                userId: adminData?.uid || 'Admin',
                targetUserId,
                reason: "Banned from dashboard"
            });
            loadMembers();
        } catch (error) {
            showModal({ type: 'alert', title: 'Error', message: "Failed to ban member. Are you an admin?" });
        }
    };

    return (
        <div className="w-full flex flex-col h-screen bg-background font-sans overflow-hidden">
            {/* Top Navigation Bar */}
            <header className="px-6 py-3 border-b border-black/5 dark:border-white/5 bg-surface flex justify-between items-center shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <Link to="/clusters" className="text-on-surface-variant hover:text-on-surface transition-colors p-1.5 rounded-md hover:bg-surface-container border border-black/5 dark:border-white/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </Link>
                    <div className="flex items-center text-sm">
                        <span className="material-symbols-outlined text-primary text-[20px] mr-2">forum</span>
                        <span className="font-semibold text-on-surface mr-2">{cluster.Cluster_Name}</span>
                        <span className="text-on-surface-variant/50 mr-2">/</span>
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase">Chatbase</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded-full border border-black/5 dark:border-white/5">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-xs font-bold font-mono">{activeConnections} Active</span>
                    </div>
                </div>
            </header>

            {/* 3-Pane Enterprise Layout */}
            <div className="flex flex-1 overflow-hidden">
                
                {/* Left Pane: Channels */}
                <div className="w-64 border-r border-black/5 dark:border-white/5 bg-surface-container-lowest flex flex-col">
                    <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-sm text-on-surface-variant uppercase tracking-wider">Channels</h3>
                        <button onClick={handleCreateChannel} className="text-primary hover:bg-primary/10 p-1 rounded-md transition-colors">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                        {channels.map(c => (
                            <button 
                                key={c.id} 
                                onClick={() => setActiveChannel(c)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeChannel?.id === c.id 
                                    ? 'bg-primary text-on-primary shadow-sm' 
                                    : 'text-on-surface hover:bg-surface-container-high'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[18px] opacity-70">tag</span>
                                {c.name}
                                {c.is_frozen === 1 && <span className="material-symbols-outlined text-[14px] ml-auto text-blue-300">ac_unit</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Center Pane: Chat Feed */}
                <div className="flex-1 flex flex-col bg-surface relative min-w-0">
                    {/* Active Channel Header */}
                    {activeChannel && (
                        <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-surface-container-lowest shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-on-surface-variant text-[24px]">tag</span>
                                <div>
                                    <h2 className="font-bold text-lg leading-none">{activeChannel.name}</h2>
                                    <p className="text-xs text-on-surface-variant mt-1 font-mono">ID: {activeChannel.id}</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleToggleFreeze} 
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${
                                    activeChannel.is_frozen 
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[16px]">{activeChannel.is_frozen ? 'ac_unit' : 'pause_circle'}</span>
                                {activeChannel.is_frozen ? 'Unfreeze' : 'Freeze'}
                            </button>
                        </div>
                    )}

                    {/* Message Feed */}
                    <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-surface">
                        {!activeChannel ? (
                            <div className="h-full flex items-center justify-center text-on-surface-variant flex-col gap-2">
                                <span className="material-symbols-outlined text-4xl opacity-50">forum</span>
                                <p>Select a channel to view messages</p>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-end min-h-full gap-4">
                                {messages.length === 0 && <div className="text-center text-on-surface-variant/50 my-auto pb-10">No messages yet.</div>}
                                
                                {messages.map((msg, i) => (
                                    <div key={i} className={`group flex gap-4 ${msg.senderId === adminData?.uid ? 'flex-row-reverse' : ''} animate-fade-in`}>
                                        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border border-black/5 dark:border-white/5">
                                            {msg.senderId?.substring(0,2).toUpperCase() || 'U'}
                                        </div>
                                        <div className={`flex flex-col max-w-[70%] ${msg.senderId === adminData?.uid ? 'items-end' : 'items-start'}`}>
                                            <div className={`flex items-baseline gap-2 mb-1 ${msg.senderId === adminData?.uid ? 'flex-row-reverse' : ''}`}>
                                                <span className="font-bold text-sm text-on-surface">{msg.senderId}</span>
                                                <span className="text-xs text-on-surface-variant font-mono">{new Date(msg.created_at || Date.now()).toLocaleTimeString()}</span>
                                                {msg.is_pinned === 1 && <span className="material-symbols-outlined text-[14px] text-primary" title="Pinned">push_pin</span>}
                                            </div>
                                            
                                            <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                                                msg.senderId === adminData?.uid 
                                                ? 'bg-primary text-on-primary rounded-tr-sm' 
                                                : 'bg-surface-container-high text-on-surface rounded-tl-sm'
                                            }`}>
                                                {msg.type === 'text' && <p>{msg.text}</p>}
                                                {msg.type === 'image' && (
                                                    <div className="flex flex-col gap-2">
                                                        <img src={`${serverRoute}${msg.media_url}`} alt="attachment" className="max-w-[200px] rounded-lg object-cover border border-white/10" />
                                                        {msg.text && <p>{msg.text}</p>}
                                                    </div>
                                                )}
                                                {msg.type === 'voice' && (
                                                    <audio controls src={`${serverRoute}${msg.media_url}`} className="max-w-[250px] h-8"></audio>
                                                )}
                                                {msg.type === 'file' && (
                                                    <a href={`${serverRoute}${msg.media_url}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-black/10 rounded-lg hover:bg-black/20 transition-colors">
                                                        <span className="material-symbols-outlined">description</span>
                                                        <span className="underline truncate max-w-[150px]">View Attachment</span>
                                                    </a>
                                                )}
                                            </div>

                                            {/* Action Bar (Hover) */}
                                            <div className={`flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${msg.senderId === adminData?.uid ? 'flex-row-reverse' : ''}`}>
                                                <button onClick={() => handleTogglePin(msg.id || msg.msg_id, msg.is_pinned === 1)} className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors text-xs flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">{msg.is_pinned === 1 ? 'do_not_disturb_on' : 'push_pin'}</span>
                                                    {msg.is_pinned === 1 ? 'Unpin' : 'Pin'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {Object.keys(typingUsers).some(k => typingUsers[k]) && (
                                    <div className="flex gap-4 items-center">
                                        <div className="w-8 h-8 rounded-full bg-surface-container-highest animate-pulse"></div>
                                        <span className="text-xs font-mono text-on-surface-variant animate-pulse">Someone is typing...</span>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    {activeChannel && (
                        <div className="p-4 bg-surface-container-lowest border-t border-black/5 dark:border-white/5 shrink-0 z-10">
                            {activeChannel.is_frozen === 1 ? (
                                <div className="bg-error-container text-on-error-container p-3 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">ac_unit</span>
                                    Channel is Frozen
                                </div>
                            ) : (
                                <form onSubmit={handleSend} className="flex gap-2">
                                    <button 
                                        type="button" 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-3 bg-surface-container-high text-on-surface rounded-xl hover:bg-surface-container-highest transition-colors flex-shrink-0"
                                        title="Attach File"
                                    >
                                        <span className="material-symbols-outlined">attach_file</span>
                                    </button>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        ref={fileInputRef}
                                        onChange={handleMediaUpload}
                                    />
                                    <input 
                                        type="text" 
                                        value={messageInput}
                                        onChange={(e) => {
                                            setMessageInput(e.target.value);
                                            if (socket) {
                                                socket.emit('chatbase_typing', {
                                                    clusterId: cluster.id,
                                                    channelId: activeChannel.id,
                                                    userId: adminData?.uid || 'Admin',
                                                    isTyping: e.target.value.length > 0
                                                });
                                            }
                                        }}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-surface-container-highest text-on-surface rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-on-surface-variant shadow-inner"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!messageInput.trim()}
                                        className="p-3 bg-primary text-on-primary rounded-xl hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                    >
                                        <span className="material-symbols-outlined">send</span>
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Pane: Inspector / Members */}
                <div className="w-80 border-l border-black/5 dark:border-white/5 bg-surface-container-lowest flex flex-col overflow-y-auto">
                    <div className="p-6 border-b border-black/5 dark:border-white/5 bg-surface flex flex-col items-center justify-center gap-2">
                        <div className="w-16 h-16 rounded-2xl bg-primary-container text-primary flex items-center justify-center shadow-inner border border-primary/20">
                            <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                        </div>
                        <h3 className="font-black text-lg text-on-surface tracking-tight mt-2">Inspector</h3>
                        <p className="text-xs font-mono text-on-surface-variant">Live Channel Telemetry</p>
                    </div>

                    {activeChannel ? (
                        <div className="p-4 flex flex-col gap-6">
                            {/* Member Roster */}
                            <div>
                                <h4 className="font-bold text-xs text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">group</span>
                                    Channel Roster ({members.length})
                                </h4>
                                <div className="flex flex-col gap-2">
                                    {members.length === 0 && <p className="text-xs text-on-surface-variant/50">No members found.</p>}
                                    {members.map(m => (
                                        <div key={m.id} className="flex justify-between items-center p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors border border-black/5 dark:border-white/5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-[10px] font-bold">
                                                    {m.user_id?.substring(0,2).toUpperCase() || 'U'}
                                                </div>
                                                <span className="font-medium text-sm truncate max-w-[120px]">{m.user_id}</span>
                                            </div>
                                            <button 
                                                onClick={async () => {
                                                    const confirmed = await showModal({
                                                        type: 'confirm',
                                                        title: 'Ban Member',
                                                        message: `Ban ${m.user_id} from this channel?`,
                                                        isDestructive: true
                                                    });
                                                    if(confirmed) {
                                                        handleBanMember(m.user_id);
                                                    }
                                                }} 
                                                className="text-error hover:bg-error-container p-1 rounded text-xs flex items-center transition-colors"
                                                title="Ban Member"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">block</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-on-surface-variant/50 p-6 text-center text-sm">
                            Select a channel to view inspector details.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ChatbaseExplorer;
