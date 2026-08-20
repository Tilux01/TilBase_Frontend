import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import axios from 'axios';
import { objContext } from '../App';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import { useGlobalModal } from '../Context/GlobalModalContext';

const BroadcastExplorer = ({ cluster }) => {
    const { serverRoute, adminData } = useContext(objContext);
    const { showModal } = useGlobalModal();

    // Stream State
    const [socket, setSocket] = useState(null);
    const [viewerCount, setViewerCount] = useState(0);
    const [peakViewers, setPeakViewers] = useState(0);
    const [sheddingState, setSheddingState] = useState('NORMAL');
    
    // Chat State
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [hostAnnouncements, setHostAnnouncements] = useState([]);
    
    // Engagement State
    const [reactions, setReactions] = useState({ heart: 0, clap: 0, fire: 0, star: 0 });
    const [activePoll, setActivePoll] = useState(null);
    const [pollInput, setPollInput] = useState('');
    const [qaList, setQaList] = useState([]);
    const [raisedHands, setRaisedHands] = useState([]);
    
    const feedRef = useRef(null);

    // SDK/Socket Initialization
    useEffect(() => {
        if (!cluster || !cluster.id) return;

        const newSocket = io(serverRoute);
        setSocket(newSocket);
        const roomId = `live_room_${cluster.id}`;

        newSocket.on('connect', () => {
            newSocket.emit('broadcast_join', {
                clusterId: cluster.id,
                roomId: roomId,
                userId: adminData?.uid || 'AdminHost',
                role: 'host'
            });
        });

        // Batch 1: Viewers & Messages
        newSocket.on('broadcast_viewer_count', (data) => {
            setViewerCount(data.totalViewers);
            setPeakViewers(data.peakViewers);
        });

        newSocket.on('broadcast_message_received', (data) => {
            setMessages(prev => {
                const newMsgs = [...prev, data.message];
                return newMsgs.slice(-200); // Keep max 200 msgs in DOM for performance
            });
        });

        newSocket.on('broadcast_host_announcement', (data) => {
            setHostAnnouncements(prev => [data.announcement, ...prev]);
        });

        // Batch 2: Engagement
        newSocket.on('broadcast_reaction_aggregate', (data) => {
            setReactions(prev => ({ ...prev, ...data.reactionCounts }));
        });

        newSocket.on('broadcast_poll_started', (data) => {
            setActivePoll(data.poll);
        });

        newSocket.on('broadcast_poll_updated', (data) => {
            setActivePoll(prev => prev ? { ...prev, votes: data.aggregatedVotes } : prev);
        });

        newSocket.on('broadcast_poll_closed', (data) => {
            setActivePoll(null);
        });

        // Batch 3: Q&A and Stage
        newSocket.on('broadcast_qa_submitted', (data) => {
            setQaList(prev => [...prev, data.question]);
        });

        newSocket.on('broadcast_qa_upvoted', (data) => {
            setQaList(prev => prev.map(q => q.id === data.questionId ? { ...q, upvotes: data.newVoteCount } : q));
        });

        newSocket.on('broadcast_qa_active', (data) => {
            setQaList(prev => prev.map(q => q.id === data.activeQuestion.id ? { ...q, isAnswered: true } : q));
        });

        newSocket.on('broadcast_stage_hand_raised', (data) => {
            setRaisedHands(prev => [...new Set([...prev, data.userId])]);
        });

        newSocket.on('broadcast_stage_granted', (data) => {
            // Simulated stage UI popup
        });

        // Cleanup
        return () => {
            newSocket.emit('broadcast_leave', {
                clusterId: cluster.id,
                roomId: roomId,
                userId: adminData?.uid || 'AdminHost'
            });
            newSocket.close();
        };
    }, [cluster, serverRoute, adminData]);

    // Auto-scroll
    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !socket) return;
        
        socket.emit('broadcast_send_message', {
            clusterId: cluster.id,
            roomId: `live_room_${cluster.id}`,
            userId: adminData?.uid || 'AdminHost',
            message: { text: messageInput }
        });
        setMessageInput('');
    };

    const handleAnnouncement = async () => {
        const text = await showModal({
            type: "prompt",
            title: "Host Announcement",
            message: "Enter the announcement text:",
            placeholder: "e.g., We'll be taking a quick break!"
        });
        if (!text || !socket) return;
        socket.emit('broadcast_host_announcement', {
            clusterId: cluster.id,
            roomId: `live_room_${cluster.id}`,
            userId: adminData?.uid || 'AdminHost',
            announcement: { text }
        });
    };

    const handleCreatePoll = () => {
        if (!pollInput || !socket) return;
        const opts = pollInput.split(',').map((o, i) => ({ id: `opt${i}`, text: o.trim() }));
        socket.emit('broadcast_poll_create', {
            clusterId: cluster.id,
            roomId: `live_room_${cluster.id}`,
            userId: adminData?.uid || 'AdminHost',
            pollConfig: { question: "Live Poll", options: opts }
        });
        setPollInput('');
    };

    const handleClosePoll = () => {
        if (!activePoll || !socket) return;
        socket.emit('broadcast_poll_close', {
            clusterId: cluster.id,
            roomId: `live_room_${cluster.id}`,
            userId: adminData?.uid || 'AdminHost',
            pollId: activePoll.id
        });
    };

    const handleAnswerQuestion = (questionId) => {
        if (!socket) return;
        socket.emit('broadcast_qa_answered', {
            clusterId: cluster.id,
            roomId: `live_room_${cluster.id}`,
            userId: adminData?.uid || 'AdminHost',
            questionId
        });
    };

    const totalPollVotes = activePoll ? Object.values(activePoll.votes || {}).reduce((a,b) => a+b, 0) : 0;

    return (
        <div className="w-full flex flex-col h-screen bg-background font-sans overflow-hidden">
            {/* Standard Header */}
            <header className="px-6 py-3 border-b border-black/5 dark:border-white/5 bg-surface flex justify-between items-center shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <Link to="/clusters" className="text-on-surface-variant hover:text-on-surface transition-colors p-1.5 rounded-md hover:bg-surface-container border border-black/5 dark:border-white/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </Link>
                    <div className="flex items-center text-sm">
                        <span className="material-symbols-outlined text-primary text-[20px] mr-2">dns</span>
                        <span className="font-semibold text-on-surface mr-2">{cluster.Cluster_Name}</span>
                        <span className="text-on-surface-variant/50 mr-2">/</span>
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase">Broadcast</span>
                    </div>
                </div>
            </header>

            {/* Broadcast Dashboard Layout */}
            <div className="flex flex-1 overflow-hidden">
            
            {/* Left: Stream Info & Stage */}
            <div className="w-1/4 border-r border-outline-variant p-6 flex flex-col gap-6 bg-surface-container-lowest">
                <div className="bg-surface-container p-6 rounded-2xl shadow-sm border border-outline-variant">
                    <h2 className="text-xl font-bold mb-4 tracking-tight flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">sensors</span>
                        Live Telemetry
                    </h2>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-on-surface-variant font-medium text-sm">Active Viewers</span>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                            <span className="font-mono font-bold text-lg">{viewerCount.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-on-surface-variant font-medium text-sm">Peak Concurrent</span>
                        <span className="font-mono font-bold text-sm">{peakViewers.toLocaleString()}</span>
                    </div>
                    
                    <div className="w-full h-px bg-outline-variant my-4"></div>
                    
                    <div className="flex flex-col gap-2">
                        <span className="text-on-surface-variant font-medium text-sm">Shedding State</span>
                        <div className={`px-3 py-1.5 rounded-md text-xs font-bold text-center uppercase tracking-wider ${sheddingState === 'NORMAL' ? 'bg-primary-container text-on-primary-container' : 'bg-error-container text-on-error-container animate-pulse'}`}>
                            {sheddingState}
                        </div>
                    </div>
                </div>

                {/* Raised Hands / Stage Access */}
                <div className="flex-1 bg-surface-container p-4 rounded-2xl border border-outline-variant overflow-y-auto">
                    <h3 className="font-bold text-sm text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">front_hand</span>
                        Stage Requests ({raisedHands.length})
                    </h3>
                    <div className="flex flex-col gap-2">
                        {raisedHands.map(user => (
                            <div key={user} className="flex justify-between items-center bg-surface-container-high p-2 rounded-lg text-sm">
                                <span className="font-mono truncate w-24">{user}</span>
                                <button className="text-primary hover:bg-primary-container px-2 py-1 rounded transition-colors font-semibold text-xs">
                                    Bring to Stage
                                </button>
                            </div>
                        ))}
                        {raisedHands.length === 0 && (
                            <p className="text-sm text-on-surface-variant/50 text-center py-4">No pending requests</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Center: High-Velocity Chat Stream */}
            <div className="flex-1 flex flex-col relative bg-surface-container-lowest">
                {/* Host Announcements Bar */}
                {hostAnnouncements.length > 0 && (
                    <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-2 pointer-events-none">
                        {hostAnnouncements.slice(0, 3).map((ann, i) => (
                            <div key={i} className="bg-primary text-on-primary p-3 rounded-lg shadow-lg font-medium flex items-center gap-3 animate-slide-down pointer-events-auto">
                                <span className="material-symbols-outlined">campaign</span>
                                <span>{ann.text}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Feed */}
                <div ref={feedRef} className="flex-1 overflow-y-auto p-6 pt-24 scroll-smooth">
                    <div className="flex flex-col gap-2 justify-end min-h-full">
                        {messages.length === 0 && <p className="text-center text-on-surface-variant/50 my-auto">Stream is quiet...</p>}
                        {messages.map((msg, i) => (
                            <div key={i} className="flex gap-3 hover:bg-surface-container-high p-2 rounded-xl transition-colors animate-slide-up">
                                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs shrink-0">
                                    {msg.senderId?.substring(0,2) || 'U'}
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-sm">{msg.senderId || 'User'}</span>
                                        <span className="text-xs text-on-surface-variant font-mono">{new Date(msg.timestamp || Date.now()).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-on-surface text-sm leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Input Dock */}
                <div className="p-4 bg-surface-container border-t border-outline-variant">
                    <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
                        <button type="button" onClick={handleAnnouncement} className="p-3 bg-secondary-container text-on-secondary-container rounded-xl hover:bg-secondary transition-colors" title="Post Host Announcement">
                            <span className="material-symbols-outlined">campaign</span>
                        </button>
                        <input 
                            type="text" 
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Send a message to the stream..."
                            className="flex-1 bg-surface-container-highest text-on-surface rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-on-surface-variant"
                        />
                        <button type="submit" className="p-3 bg-primary text-on-primary rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* Right: Engagement Engine */}
            <div className="w-1/4 border-l border-outline-variant p-6 flex flex-col gap-6 bg-surface-container-lowest overflow-y-auto">
                
                {/* Reactions */}
                <div className="bg-surface-container p-6 rounded-2xl shadow-sm border border-outline-variant shrink-0">
                    <h3 className="font-bold text-sm text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">favorite</span>
                        Live Reactions
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(reactions).map(([type, count]) => (
                            <div key={type} className="flex flex-col items-center bg-surface-container-highest p-3 rounded-xl border border-outline-variant/30">
                                <span className="text-2xl mb-1">{type === 'heart' ? '❤️' : type === 'clap' ? '👏' : type === 'fire' ? '🔥' : '⭐'}</span>
                                <span className="font-mono font-bold text-lg">{count.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Polls */}
                <div className="bg-surface-container p-6 rounded-2xl shadow-sm border border-outline-variant shrink-0">
                    <h3 className="font-bold text-sm text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">poll</span>
                        Active Poll
                    </h3>
                    {!activePoll ? (
                        <div className="flex flex-col gap-3">
                            <input 
                                type="text"
                                value={pollInput}
                                onChange={(e)=>setPollInput(e.target.value)}
                                placeholder="Opt 1, Opt 2, Opt 3" 
                                className="bg-surface-container-highest rounded-lg px-3 py-2 text-sm outline-none"
                            />
                            <button onClick={handleCreatePoll} className="bg-primary text-on-primary font-bold text-sm py-2 rounded-lg hover:bg-primary/90 transition-colors">
                                Launch Live Poll
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 animate-fade-in">
                            <p className="font-bold text-sm">{activePoll.question}</p>
                            {activePoll.options?.map(opt => {
                                const votes = activePoll.votes?.[opt.id] || 0;
                                const percent = totalPollVotes > 0 ? Math.round((votes / totalPollVotes) * 100) : 0;
                                return (
                                    <div key={opt.id} className="relative h-8 bg-surface-container-highest rounded-lg overflow-hidden flex items-center px-3 z-0">
                                        <div className="absolute top-0 left-0 h-full bg-primary/20 -z-10 transition-all duration-500" style={{ width: `${percent}%` }}></div>
                                        <span className="text-sm z-10 flex-1 font-medium">{opt.text}</span>
                                        <span className="text-xs font-mono font-bold z-10">{percent}%</span>
                                    </div>
                                );
                            })}
                            <button onClick={handleClosePoll} className="mt-2 bg-error text-on-error font-bold text-sm py-2 rounded-lg hover:bg-error/90 transition-colors">
                                Close Poll
                            </button>
                        </div>
                    )}
                </div>

                {/* Q&A */}
                <div className="flex-1 min-h-[200px] bg-surface-container p-4 rounded-2xl border border-outline-variant overflow-y-auto">
                    <h3 className="font-bold text-sm text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">forum</span>
                        Q&A Queue ({qaList.length})
                    </h3>
                    <div className="flex flex-col gap-3">
                        {qaList.map(q => (
                            <div key={q.id} className={`p-3 rounded-xl border ${q.isAnswered ? 'bg-surface-container-highest border-primary/50' : 'bg-surface-container-high border-outline-variant'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-on-surface-variant">{q.userId}</span>
                                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-primary">
                                        <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                                        {q.upvotes}
                                    </div>
                                </div>
                                <p className="text-sm mb-3">{q.text}</p>
                                {!q.isAnswered && (
                                    <button onClick={() => handleAnswerQuestion(q.id)} className="w-full border border-primary text-primary font-bold text-xs py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                                        Mark Answered
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            </div>
        </div>
    );
};

export default BroadcastExplorer;
