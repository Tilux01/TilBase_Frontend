import React, { useState, useEffect } from 'react';
import DocsLayout from '../DocsLayout';
import CodeWindow from '../../../Components/CodeWindow';

const sections = [
    { id: 'connection', title: 'Connection & Presence' },
    { id: 'messaging', title: 'Channel Messaging' },
    { id: 'reactions', title: 'Reactions' },
    { id: 'media', title: 'Media & Voice' },
    { id: 'webrtc', title: 'WebRTC Signaling' },
    { id: 'advanced', title: 'Advanced Controls' },
    { id: 'push', title: 'Push Notifications' },
    { id: 'ai', title: 'AI Native Integrations' },
    { id: 'offline', title: 'Offline & Delta Sync' },
    { id: 'listeners', title: 'Event Listeners' }
];

const DocsChatbase = () => {
    const [activeSection, setActiveSection] = useState(sections[0].id);

    useEffect(() => {
        const handleScroll = () => {
            let current = '';
            sections.forEach(section => {
                const element = document.getElementById(section.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 200 && rect.bottom >= 200) {
                        current = section.id;
                    }
                }
            });
            if (current && current !== activeSection) {
                setActiveSection(current);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeSection]);

    const scrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const toc = (
        <div className="space-y-1">
            {sections.map((section) => (
                <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeSection === section.id 
                            ? 'bg-surface-container-highest text-primary font-bold' 
                            : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                >
                    {section.title}
                </button>
            ))}
        </div>
    );

    return (
        <DocsLayout toc={toc}>
            <div className="mb-12 border-b border-black/5 dark:border-black/5 dark:border-white/5 pb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm">Database SDKs</span>
                    <span className="material-symbols-outlined text-outline-variant/50 text-[16px]">chevron_right</span>
                    <span className="text-on-surface-variant font-medium text-sm">Core Chat Engine</span>
                </div>
                <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-4">
                    Core Chat Engine Cluster
                </h1>
                <p className="text-on-surface-variant text-base max-w-3xl leading-relaxed">
                    A fully managed, real-time chat infrastructure. Build 1-to-1 messaging, group chats, AI-assisted channels, and open channels without worrying about scaling WebSockets or security.
                </p>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex gap-3 text-primary mt-6 max-w-3xl">
                    <span className="material-symbols-outlined mt-0.5">info</span>
                    <div>
                        <p className="font-bold">Chatbase requires a dedicated cluster.</p>
                        <p className="text-sm">You must create a cluster with `Cluster_Type = "chatbase"` (or `chatbase_secure` for encrypted payloads) in your project dashboard before using this SDK.</p>
                    </div>
                </div>
            </div>

            <section id="connection" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">wifi</span>
                    1. Connection & Presence
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    To connect to Chatbase, initialize the `chatbase()` namespace and pass the authenticated user's ID. This instantly marks them as online across the cluster and establishes the WebSocket connection.
                </p>
                <CodeWindow 
                    language="javascript"
                    code={`const TilBase = require("tilbase-sdk");
const db = new TilBase();

await db.Auth(profileKey, projectKey, clusterKey, dbUser, dbPassword, serverName);

const chat = db.chatbase();

// Connect the user to the cluster
await chat.connect("user_987", { 
    name: "Alex", 
    avatar: "https://example.com/avatar.png" 
});

// Update their online state manually (e.g., 'away', 'dnd', 'offline')
chat.setOnlineState('away');

// Listen for other users' presence changes across the cluster
chat.onUserPresenceChanged((userId, status) => {
    console.log(\`User \${userId} is now \${status}\`);
});

// Disconnect session
chat.disconnect();`}
                />
            </section>

            <section id="messaging" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">forum</span>
                    2. Channel Messaging
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Channels are the core of Chatbase. You must join a channel before interacting with it. All Read/Write actions automatically intercept your role-based access control (RBAC) permissions.
                </p>
                <CodeWindow 
                    language="javascript"
                    code={`// 1. Get a Channel Instance
const channel = chat.channel("general", "public");

// 2. Join the channel (Authenticates the user into the room)
await channel.join();

// 3. Send a message
await channel.sendMessage("Hello world!", { attachments: [] });

// 4. Threading: Reply to a specific message and fetch thread history
await channel.replyInThread("msg_123", "This is a reply!");
const thread = await channel.getThreadMessages("msg_123", 50, 0);

// 5. Typing Indicators (Real-time WebSocket events)
channel.startTyping();
// ... later
channel.stopTyping();

// 6. Schedule a message for later delivery
const futureTime = Date.now() + 1000 * 60 * 60; // 1 hour from now
await channel.scheduleMessage("Don't forget the meeting!", futureTime);

// 7. Edit an existing message
await channel.editMessage("msg_123", "Hello world! (edited)");

// 8. Delete a message
await channel.deleteMessage("msg_123");`}
                />
            </section>

            <section id="reactions" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">add_reaction</span>
                    3. Reactions
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Add native emoji reactions to any message in a channel. Reactions are instantly synchronized across all connected WebSocket clients.
                </p>
                <CodeWindow 
                    language="javascript"
                    code={`// Add an emoji reaction to a message
await channel.addReaction("msg_123", "🔥");

// Remove a reaction
await channel.removeReaction("msg_123", "🔥");`}
                />
            </section>

            <section id="media" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">perm_media</span>
                    4. Media & Voice
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Send file attachments, documents, and voice notes directly through the Chatbase engine. The backend natively manages multipart/form-data uploads and automatically stores files to Cloudinary (if configured) or your local cluster.
                </p>
                <CodeWindow 
                    language="javascript"
                    code={`// Send specific media types (Blob or File objects)
await channel.sendImage(fileBlob, "image.png");
await channel.sendVideo(fileBlob, "video.mp4");
await channel.sendDocument(fileBlob, "document.pdf");

// Send contacts or custom media types
await channel.sendContact({ name: "John Doe", phone: "+123456789" });
await channel.sendMediaMessage(fileBlob, "archive.zip", "application/zip");

// Send a voice note with a specific duration (ms)
await channel.sendVoiceNote(audioBlob, 5000);`}
                />
            </section>

            <section id="webrtc" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">video_call</span>
                    5. WebRTC Signaling (Voice/Video)
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Chatbase provides a robust WebRTC signaling layer natively through WebSockets. Build peer-to-peer Voice/Video call interfaces on top of it. You can leverage public STUN servers for standard NAT traversal or your own TURN servers for strict networks.
                </p>
                <CodeWindow 
                    language="javascript"
                    code={`// Start a call (Send SDP Offer)
await chat.startCall("user_456", "video", offerSdp);

// Accept a call (Send SDP Answer)
await chat.acceptCall("user_123", answerSdp);

// Reject or end a call
await chat.rejectCall("user_123");

// Send ICE Candidate to peer
await chat.sendIceCandidate("user_123", iceCandidate);`}
                />
            </section>

            <section id="advanced" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">settings_applications</span>
                    6. Advanced Controls
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Control channel moderation, message pinning, read receipts, and message forwarding.
                </p>
                <CodeWindow 
                    language="javascript"
                    code={`// Freeze channel (Prevents new messages)
await channel.freezeChannel();
await channel.unfreezeChannel();

// Update channel metadata (Name, Icon, Description)
await channel.updateMetadata({ name: "New Name", description: "Updated topic" });

// Mute or Unmute channel locally
channel.mute();
channel.unmute();

// Pin or unpin a specific message
await channel.pinMessage("msg_123");
await channel.unpinMessage("msg_123");

// Search messages in this channel
const searchResults = await channel.searchMessages("project deadline", 50);

// Forward a message to another channel ID
await channel.forwardMessage("target_channel_id", "msg_123");

// Read & Delivery Receipts
await channel.markAsDelivered("msg_123");
await channel.markAsRead("msg_123");

// Attempt to resend a failed message payload
await channel.resendFailedMessage("Hello world!");`}
                />
            </section>

            <section id="push" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">notifications_active</span>
                    7. Push Notifications
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Keep your users engaged even when their browser is closed. Chatbase seamlessly integrates with Service Workers to securely send web-push notifications to offline users. Encrypted channels receive generic notifications, ensuring end-to-end payload security.
                </p>
                <CodeWindow 
                    language="javascript"
                    code={`// 1. Register your service worker
const swRegistration = await navigator.serviceWorker.register('/sw.js');

// 2. Pass the registration to Chatbase to enable Push
await chat.enablePushNotifications(swRegistration);

// Now, if this user is offline, Chatbase will safely dispatch a push
// notification directly via their VAPID subscription whenever a message arrives.`}
                />
            </section>

            <section id="ai" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">smart_toy</span>
                    8. AI Native Integrations
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Every Chatbase cluster supports native Retrieval-Augmented Generation (RAG). You can schedule background tasks, post AI streams, and build autonomous agents that participate directly in the chat.
                </p>
                <CodeWindow 
                    language="javascript"
                    code={`// Schedule a background AI task
await channel.scheduleAITask("Summarize the last 50 messages in this channel.");
const tasks = await channel.getAITasks();

// Post a streaming AI response chunk to the channel
await channel.postAIStream("stream_123", "Hello", false, null);

// Update a specific AI task state
await channel.updateAIStreamTask("task_123", "processing");

// Register a function tool schema that the AI can call
await channel.registerClientTool("search_users", { type: "object", properties: {...} });

// Handoff an AI thread back to a human agent
await channel.handoffToHuman("agent_456", "User requested live support");`}
                />
            </section>

            <section id="offline" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">cloud_off</span>
                    9. Offline & Delta Sync
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    For robust mobile applications, use optimistic writes and local cache synchronization.
                </p>
                <CodeWindow 
                    language="javascript"
                    code={`// Send a message optimistically (Updates UI immediately, rolls back on failure)
await channel.optimisticSendMessage("Hello world!");

// Send a JSON patch instead of a full message replacement
await channel.streamDeltaPatch("msg_123", { text: "Updated text" });

// Sync offline mutations with the server when connection is restored
await channel.syncLocalCache([ { action: "send", tempId: "abc", text: "..." } ]);

// Subscribe to a specific field path inside a message JSON
await channel.subscribeFieldPath("msg_123", "metadata.status");`}
                />
            </section>

            <section id="listeners" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">headphones</span>
                    10. History & Event Listeners
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Retrieve historical messages and listen to all realtime WebSocket events broadcasted within the channel.
                </p>
                <CodeWindow 
                    language="javascript"
                    code={`// Retrieve message history (limit, offset)
const history = await channel.getMessages(50, 0);

// Listen for new messages
channel.onMessage((msg) => console.log(msg));

// Core Message Listeners
channel.onMessageEdited((msgId, newText) => {});
channel.onMessageDeleted((msgId) => {});
channel.onReactionAdded((msgId, userId, emoji) => {});
channel.onReactionRemoved((msgId, userId, emoji) => {});
channel.onMessagePinned((msgId) => {});
channel.onMessageUnpinned((msgId) => {});
channel.onMessageDeliveryStatusChanged((msgId, userId, status) => {});
channel.onUserTyping((userId, isTyping) => {});
channel.onMuteStateChanged((isMuted) => {});

// WebRTC Signaling Listeners (Attached to the global chat instance)
chat.onIncomingCall((callerId, callType, offerSdp) => {});
chat.onCallAccepted((responderId, answerSdp) => {});
chat.onCallRejected((responderId) => {});
chat.onIceCandidate((peerId, candidate) => {});

// Channel State Listeners
channel.onChannelFrozen(() => {});
channel.onChannelUnfrozen(() => {});

// Offline Resilience
channel.onOptimisticWriteRolledBack((tempMsgId, reason) => {});

// AI Stream Listeners
channel.onAIStreamChunk((streamId, chunk) => {});
channel.onAIStreamCompleted((streamId, finalMessage) => {});
channel.onAIStreamTaskUpdated((taskId, taskState) => {});
channel.onAIClientToolRegistered((toolName, schema) => {});
channel.onHumanHandoffRequested((agentId, reason) => {});`}
                />
            </section>
        </DocsLayout>
    );
};

export default DocsChatbase;
