import React, { useState, useEffect } from 'react';
import DocsLayout from '../DocsLayout';
import CodeWindow from '../../../Components/CodeWindow';

const sections = [
    { id: 'concepts', title: 'Core Concepts' },
    { id: 'rooms', title: 'Joining Rooms' },
    { id: 'messages', title: 'Sending Messages' },
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
                            ? 'bg-primary/10 text-primary font-bold' 
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
            <div className="mb-12 border-b border-outline-variant/20 pb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm">AI Integrations</span>
                    <span className="material-symbols-outlined text-outline-variant/50 text-[16px]">chevron_right</span>
                    <span className="text-on-surface-variant font-medium text-sm">ChatBase</span>
                </div>
                <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-4">
                    ChatBase SDK
                </h1>
                <p className="text-on-surface-variant text-base max-w-3xl leading-relaxed">
                    A specialized communication module designed for instant messaging, group management, and AI chatbot integrations. 
                </p>
            </div>

            <section id="concepts" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">forum</span>
                    Core Concepts
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    ChatBase abstracts away the complexity of managing live chat rooms. It handles user presence, message history storage, and live message broadcasts instantly across all connected users in a specific room.
                </p>
            </section>

            <section id="rooms" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">meeting_room</span>
                    Joining Rooms
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Users must join a room to start receiving messages for that specific channel.
                </p>
                <CodeWindow 
                    title="Subscribe to Room" 
                    language="javascript"
                    code={`const chatStore = db.chatbase();

// Join a support room
chatStore.joinRoom("support_channel_123");

// Listen for incoming messages in this room
chatStore.onMessage("support_channel_123", (message) => {
    console.log(\`[\${message.sender}]: \${message.text}\`);
});`} 
                />
            </section>

            <section id="messages" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">chat</span>
                    Sending Messages
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Broadcast a message to everyone in the room. The ChatBase engine automatically saves the payload to history and pushes it to all active clients.
                </p>
                <CodeWindow 
                    title="Send Message" 
                    language="javascript"
                    code={`// Send a message to the room
await chatStore.sendMessage("support_channel_123", {
    sender: "Agent_Smith",
    text: "How can I help you today?",
    attachments: []
});`} 
                />
            </section>
        </DocsLayout>
    );
};

export default DocsChatbase;
