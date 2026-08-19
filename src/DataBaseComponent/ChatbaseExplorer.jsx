import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { objContext } from '../App';
import { io } from 'socket.io-client';

const ChatbaseExplorer = ({ cluster }) => {
    const { serverRoute, adminData, showModal } = useContext(objContext);

    const [channels, setChannels] = useState([]);
    const [activeChannel, setActiveChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState([]);
    const [showMembers, setShowMembers] = useState(false);
    const [activeConnections, setActiveConnections] = useState(1);
    const [activeTab, setActiveTab] = useState('feed'); // feed, inspector, sessions
    const [messageInput, setMessageInput] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const [socket, setSocket] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const fileInputRef = useRef(null);
    const [typingUsers, setTypingUsers] = useState({});
    const typingTimeout = useRef(null);
    
    const messagesEndRef = useRef(null);

    // Fetch Channels
    const loadChannels = async () => {
        try {
            const res = await axios.post(`${serverRoute}/api/chatbase/getChannels`, { clusterId: cluster.id });
            setChannels(res.data.channels || []);
            if (res.data.channels && res.data.channels.length > 0 && !activeChannel) {
                setActiveChannel(res.data.channels[0]);
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
            // Reverse so newest is at the bottom
            setMessages(res.data.messages || []);
        } catch (error) {
            console.error("Failed to fetch messages");
        }
    };

    useEffect(() => {
        if (cluster && cluster.id) {
            loadChannels();
        }
    }, [cluster]);

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
            if (activeChannel && msg.channelId === activeChannel.id) {
                setMessages(prev => [...prev, msg]);
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
        const name = prompt("Enter channel name:");
        if (!name) return;
        try {
            await axios.post(`${serverRoute}/api/chatbase/createChannel`, {
                clusterId: cluster.id,
                channelName: name,
                creatorId: adminData?.uid || 'Admin'
            });
            loadChannels();
        } catch (error) {
            showModal('alert', 'Error', "Failed to create channel");
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
            
            // Stop typing
            if (socket) {
                socket.emit('chatbase_typing', {
                    clusterId: cluster.id,
                    channelId: activeChannel.id,
                    userId: adminData?.uid || 'Admin',
                    isTyping: false
                });
            }
        } catch (error) {
            console.error("Failed to send message", error);
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
        
        if (isAudio) formData.append('duration', '0'); // Mock duration
        formData.append(fileKey, file);

        try {
            await axios.post(`${serverRoute}/api/chatbase/${endpoint}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Socket will handle incoming message
        } catch (error) {
            showModal('alert', 'Error', "Failed to upload media");
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
            showModal('alert', 'Error', "Failed to pin/unpin");
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
            showModal('alert', 'Error', "Failed to freeze/unfreeze channel. Are you an admin?");
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
            loadMembers(); // Refresh
        } catch (error) {
            showModal('alert', 'Error', "Failed to ban member. Are you an admin?");
        }
    };

    const handleTyping = (e) => {
        setMessageInput(e.target.value);
        if (socket && activeChannel) {
            if (!isTyping) {
                setIsTyping(true);
                socket.emit('chatbase_typing', {
                    clusterId: cluster.id,
                    channelId: activeChannel.id,
                    userId: adminData?.uid || 'Admin',
                    isTyping: true
                });
            }

            clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => {
                setIsTyping(false);
                socket.emit('chatbase_typing', {
                    clusterId: cluster.id,
                    channelId: activeChannel.id,
                    userId: adminData?.uid || 'Admin',
                    isTyping: false
                });
            }, 2000);
        }
    };

    // Calculate active typers
    const activeTypers = Object.entries(typingUsers)
        .filter(([id, typing]) => typing && id !== (adminData?.uid || 'Admin'))
        .map(([id]) => id);

    return (
        <div className="flex flex-col h-screen w-full bg-background text-on-surface font-sans overflow-hidden">
            
            {/* Top Navigation & Breadcrumbs */}
            <header className="flex-none bg-surface-container border-b border-black/5 dark:border-white/5 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link to="/clusters" className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container border border-black/5 dark:border-white/5 hover:bg-surface-container-high text-on-surface-variant transition-colors border border-black/5 dark:border-white/5">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                    </Link>
                    <div className="h-5 w-px bg-outline-variant/30"></div>
                    <div className="flex items-center gap-2 text-sm overflow-x-auto whitespace-nowrap hide-scrollbar max-w-2xl">
                        <span className="material-symbols-outlined text-primary text-lg">chat_bubble</span>
                        <span className="font-bold text-on-surface">
                            {cluster?.Cluster_Name || 'Chatbase'}
                        </span>
                        
                    </div>
                </div>
                
                <div className="flex items-center gap-6 shrink-0">
                    {/* Socket Telemetry Metrics */}
                    <div className="flex items-center gap-4 bg-surface-container-high px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5">
                        <div className="flex items-center gap-2 text-xs font-medium" title="Live WebSocket Connections">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-on-surface-variant">Sockets:</span>
                            <span className="text-on-surface font-mono">{activeConnections}</span>
                        </div>
                        <div className="w-px h-3 bg-outline-variant/30"></div>
                        <div className="flex items-center gap-2 text-xs font-medium" title="Cluster Throughput">
                            <span className="material-symbols-outlined text-[14px] text-primary">data_usage</span>
                            <span className="text-on-surface-variant">I/O:</span>
                            <span className="text-on-surface font-mono">0.0 Kb/s</span>
                        </div>
                    </div>
                    {cluster?.Cluster_Type === 'chatbase_secure' && (
                        <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider bg-green-500/10 text-green-500 rounded-md flex items-center gap-1 border border-green-500/20">
                            <span className="material-symbols-outlined text-[12px]">lock</span>
                            E2E Encrypted
                        </span>
                    )}
                    {activeChannel?.is_frozen ? (
                        <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider bg-cyan-500/10 text-cyan-500 rounded-md flex items-center gap-1 border border-cyan-500/20 cursor-pointer" onClick={handleToggleFreeze}>
                            <span className="material-symbols-outlined text-[12px]">ac_unit</span>
                            Frozen
                        </span>
                    ) : activeChannel ? (
                        <button onClick={handleToggleFreeze} className="text-on-surface-variant hover:text-cyan-500 transition-colors" title="Freeze Channel">
                            <span className="material-symbols-outlined text-sm">ac_unit</span>
                        </button>
                    ) : null}
                    {activeChannel && (
                        <button onClick={() => setActiveTab(activeTab === 'sessions' ? 'feed' : 'sessions')} className={`transition-colors p-1 rounded-md ${activeTab === 'sessions' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`} title="Toggle Members">
                            <span className="material-symbols-outlined text-sm">group</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Main 2-Pane Layout */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* Datagrid: Channel Directory */}
                <div className={`${activeChannel ? 'w-[400px]' : 'w-full'} flex-none bg-surface-container border-r border-black/5 dark:border-white/5 flex flex-col z-0 transition-all duration-300`}>
                    <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-surface-container-low">
                        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">table_chart</span>
                            Channel Directory
                        </h2>
                        <button onClick={handleCreateChannel} className="text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-md transition-colors text-xs font-bold flex items-center gap-1" title="Create Channel">
                            <span className="material-symbols-outlined text-[14px]">add</span>
                            New
                        </button>
                    </div>
                    
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-2 p-3 text-[10px] uppercase font-bold tracking-wider text-on-surface-variant border-b border-black/5 dark:border-white/5 bg-surface-container-lowest sticky top-0">
                        <div className="col-span-5">Channel ID</div>
                        <div className="col-span-3 text-center">Type</div>
                        <div className="col-span-4 text-right">Status</div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {channels.map(ch => (
                            <div
                                key={ch.id}
                                onClick={() => setActiveChannel(ch)}
                                className={`grid grid-cols-12 gap-2 items-center px-3 py-3 rounded-lg text-sm transition-all cursor-pointer ${
                                    activeChannel?.id === ch.id
                                        ? 'bg-surface-container-highest border border-primary/20 shadow-sm'
                                        : 'hover:bg-surface-container-high border border-transparent'
                                }`}
                            >
                                <div className="col-span-5 font-mono text-xs font-medium text-on-surface truncate">
                                    #{ch.channel_id || ch.id}
                                </div>
                                <div className="col-span-3 text-center">
                                    <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-surface-container-highest text-on-surface-variant rounded">
                                        {ch.type || 'public'}
                                    </span>
                                </div>
                                <div className="col-span-4 flex justify-end gap-1">
                                    {ch.is_frozen ? (
                                        <span className="material-symbols-outlined text-[14px] text-cyan-500" title="Frozen">ac_unit</span>
                                    ) : (
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1" title="Active"></span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {channels.length === 0 && (
                            <div className="p-8 text-center flex flex-col items-center text-on-surface-variant/60 font-medium">
                                <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                                <span>No channels found</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Area: Inspector Panels */}
                <div className="flex-1 flex flex-col relative bg-background">
                    {activeChannel ? (
                        <>
                            {/* Inspector Tabs */}
                            <div className="flex items-center gap-6 px-6 pt-4 border-b border-black/5 dark:border-white/5 bg-surface-container-lowest sticky top-0 z-10">
                                <button onClick={() => setActiveTab('feed')} className={`pb-3 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'feed' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">terminal</span> Stream Feed</span>
                                    {activeTab === 'feed' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
                                </button>
                                <button onClick={() => setActiveTab('inspector')} className={`pb-3 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'inspector' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">data_object</span> Node Inspector</span>
                                    {activeTab === 'inspector' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
                                </button>
                                <button onClick={() => setActiveTab('sessions')} className={`pb-3 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'sessions' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">group</span> Sessions & Members</span>
                                    {activeTab === 'sessions' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
                                </button>
                            </div>

                            {activeTab === 'feed' && (
                            <>
                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {messages.map(msg => {
                                    const isMe = msg.senderId === (adminData?.uid || 'Admin') || msg.sender_id === (adminData?.uid || 'Admin');
                                    const senderId = msg.senderId || msg.sender_id;
                                    const text = msg.text || msg.text_content;
                                    const msgId = msg.id || msg.msg_id;
                                    const isPinned = msg.is_pinned;
                                    let attachments = [];
                                    if (typeof msg.attachments === 'string') {
                                        try { attachments = JSON.parse(msg.attachments); } catch(e){}
                                    } else if (msg.attachments) {
                                        attachments = msg.attachments;
                                    }

                                    return (
                                        <div key={msgId} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-4 duration-300 relative group`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="text-xs text-on-surface-variant/50 font-medium">{senderId}</div>
                                                {isPinned ? <span className="material-symbols-outlined text-amber-500 text-[14px]" title="Pinned">push_pin</span> : null}
                                            </div>
                                            <div className={`flex items-start gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <div className={`px-4 py-2.5 rounded-2xl max-w-xl text-[15px] leading-relaxed shadow-sm flex flex-col gap-2 ${isMe ? 'bg-primary text-on-primary rounded-tr-sm' : 'bg-surface-container text-on-surface rounded-tl-sm border border-black/5 dark:border-white/5'}`}>
                                                    {text && <div>{text}</div>}
                                                    {attachments && attachments.map((att, idx) => (
                                                        <div key={idx} className="overflow-hidden rounded-md border border-black/10">
                                                            {att.type?.startsWith('image/') ? (
                                                                <img src={`${serverRoute}${att.url}`} alt="attachment" className="max-w-[200px] object-cover" />
                                                            ) : att.type?.startsWith('audio/') ? (
                                                                <audio controls src={`${serverRoute}${att.url}`} className="max-w-[250px]"></audio>
                                                            ) : (
                                                                <a href={`${serverRoute}${att.url}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-black/5 rounded-md hover:bg-black/10">
                                                                    <span className="material-symbols-outlined text-xl">description</span>
                                                                    <span className="text-sm underline">{att.name || 'Download File'}</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Pin Button */}
                                                <button onClick={() => handleTogglePin(msgId, isPinned)} className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-surface-container-high ${isPinned ? 'text-amber-500' : 'text-on-surface-variant'}`} title={isPinned ? "Unpin Message" : "Pin Message"}>
                                                    <span className="material-symbols-outlined text-sm">push_pin</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                {/* Typing Indicator */}
                                {activeTypers.length > 0 && (
                                    <div className="flex items-center gap-3 text-on-surface-variant text-sm bg-surface-container-high w-max px-4 py-2 rounded-full animate-in fade-in zoom-in-95">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-on-surface-variant/50 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                            <div className="w-1.5 h-1.5 bg-on-surface-variant/50 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                            <div className="w-1.5 h-1.5 bg-on-surface-variant/50 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                        </div>
                                        {activeTypers.join(', ')} typing...
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-6 bg-surface-container border-t border-black/5 dark:border-white/5 relative shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
                                {activeChannel.is_frozen ? (
                                    <div className="text-center text-on-surface-variant bg-surface-container-high p-4 rounded-xl border border-black/5 dark:border-white/5 font-medium flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-cyan-500">ac_unit</span>
                                        This channel is frozen. Only admins can unfreeze it.
                                    </div>
                                ) : (
                                    <form onSubmit={handleSend} className="flex gap-3 items-center">
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            className="hidden" 
                                            onChange={handleMediaUpload} 
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-on-surface-variant hover:text-primary p-3 bg-surface-container hover:bg-surface-container-high rounded-xl transition-colors border border-black/5 dark:border-white/5"
                                            title="Attach File"
                                        >
                                            <span className="material-symbols-outlined text-lg">attach_file</span>
                                        </button>
                                        <input 
                                            type="text" 
                                            value={messageInput}
                                            onChange={handleTyping}
                                            placeholder={`Message #${activeChannel.name}...`}
                                            className="flex-1 bg-background text-on-surface px-5 py-4 rounded-xl border border-black/5 dark:border-white/5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner"
                                        />
                                        <button 
                                            type="submit" 
                                            disabled={!messageInput.trim()}
                                            className="bg-primary text-on-primary px-6 py-4 rounded-xl font-bold shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                                        >
                                            <span className="material-symbols-outlined">send</span>
                                        </button>
                                    </form>
                                )}
                            </div>
                            </>
                            )}

                            {activeTab === 'inspector' && (
                                <div className="flex-1 overflow-y-auto p-6 bg-surface-container-lowest">
                                    <div className="max-w-2xl">
                                        <h3 className="text-sm font-bold text-on-surface mb-4 uppercase tracking-widest flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">tune</span> Channel Properties
                                        </h3>
                                        <div className="bg-surface-container border border-black/5 dark:border-white/5 rounded-xl overflow-hidden font-mono text-xs shadow-sm">
                                            <div className="flex justify-between items-center p-3 border-b border-black/5 dark:border-white/5">
                                                <span className="text-on-surface-variant">channelId</span>
                                                <span className="text-on-surface font-semibold">{activeChannel.id}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 border-b border-black/5 dark:border-white/5">
                                                <span className="text-on-surface-variant">name</span>
                                                <span className="text-on-surface text-primary font-semibold">"{activeChannel.channel_id}"</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 border-b border-black/5 dark:border-white/5">
                                                <span className="text-on-surface-variant">type</span>
                                                <span className="text-on-surface text-amber-500 font-semibold">"{activeChannel.type || 'public'}"</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 border-b border-black/5 dark:border-white/5 bg-surface-container-high">
                                                <span className="text-on-surface-variant">isFrozen</span>
                                                <span className={`${activeChannel.is_frozen ? 'text-cyan-500' : 'text-on-surface'} font-semibold`}>{activeChannel.is_frozen ? 'true' : 'false'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'sessions' && (
                                <div className="flex-1 overflow-y-auto p-6 bg-surface-container-lowest">
                                    <div className="max-w-4xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px]">badge</span> Client Session Table
                                            </h3>
                                        </div>
                                        
                                        <div className="bg-surface-container border border-black/5 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
                                            <div className="grid grid-cols-12 gap-2 p-3 text-[10px] uppercase font-bold tracking-wider text-on-surface-variant border-b border-black/5 dark:border-white/5 bg-surface-container-lowest">
                                                <div className="col-span-5">User ID</div>
                                                <div className="col-span-3">Role</div>
                                                <div className="col-span-4 text-right">Actions</div>
                                            </div>
                                            <div className="divide-y divide-black/5 dark:divide-white/5">
                                                {members.map(member => (
                                                    <div key={member.id} className="grid grid-cols-12 gap-2 p-3 items-center text-sm hover:bg-surface-container-highest transition-colors">
                                                        <div className="col-span-5 font-medium text-on-surface font-mono">{member.user_id}</div>
                                                        <div className="col-span-3">
                                                            <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-md font-bold ${member.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>{member.role}</span>
                                                        </div>
                                                        <div className="col-span-4 flex justify-end">
                                                            <button 
                                                                onClick={() => handleBanMember(member.user_id)} 
                                                                className="text-error/70 hover:text-error transition-colors p-1.5 hover:bg-error/10 rounded-md flex items-center gap-1" 
                                                                title="Ban User"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">gavel</span>
                                                                <span className="text-xs font-bold uppercase tracking-wider">Ban</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {members.length === 0 && (
                                                    <div className="p-8 text-center text-on-surface-variant/50 font-medium italic">
                                                        No members found.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant/50">
                            <span className="material-symbols-outlined text-4xl mb-4">forum</span>
                            <p className="font-medium text-sm">Select a channel to view messages</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatbaseExplorer;
