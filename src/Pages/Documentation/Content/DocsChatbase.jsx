import React from 'react';
import CodeWindow from '../../../Components/CodeWindow';

const DocsChatbase = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div>
                <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-4">Chatbase Engine API</h1>
                <p className="text-xl text-on-surface-variant leading-relaxed mb-6">
                    A fully managed, real-time chat infrastructure. Build 1-to-1 messaging, group chats, and open channels without worrying about scaling WebSockets.
                </p>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex gap-3 text-primary">
                    <span className="material-symbols-outlined">info</span>
                    <div>
                        <p className="font-bold">Chatbase requires a dedicated cluster.</p>
                        <p className="text-sm">You must create a cluster with `Cluster_Type = "chatbase"` in your project dashboard before using this SDK.</p>
                    </div>
                </div>
            </div>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-on-surface border-b border-surface-container-highest pb-2">1. Initialization & Presence</h2>
                <p className="text-on-surface-variant">
                    To connect to Chatbase, you must initialize the `chatbase()` namespace and pass the authenticated user's ID. This instantly marks them as "online" and establishes the WebSocket connection.
                </p>
                <CodeWindow 
                    language="javascript"
                    code={`const { TilBase } = require("tilbase-node-module");
const db = new TilBase("YOUR_PROJECT_KEY", "YOUR_CLUSTER_KEY");

const chat = db.chatbase();

// Connect the user (establishes WebSocket presence)
await chat.connectUser("user_987", { 
    name: "Alex", 
    avatar: "https://example.com/avatar.png" 
});`}
                />
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-on-surface border-b border-surface-container-highest pb-2">2. Channels & Messaging</h2>
                <p className="text-on-surface-variant">
                    Channels are the core of Chatbase. You can join channels, send messages, and listen for incoming messages in real-time.
                </p>
                <CodeWindow 
                    language="javascript"
                    code={`// 1. Get a Channel Instance (creates it if it doesn't exist)
const channel = chat.channel("general", "public");

// 2. Join the channel
await channel.join();

// 3. Send a message
await channel.sendMessage("Hello world!", {
    attachments: [],
    replyTo: null
});

// 4. Listen for live events
channel.onMessage((msg) => {
    console.log("New Message:", msg.text);
});

channel.onTyping((user) => {
    console.log(user.name + " is typing...");
});`}
                />
            </section>
        </div>
    );
};

export default DocsChatbase;
