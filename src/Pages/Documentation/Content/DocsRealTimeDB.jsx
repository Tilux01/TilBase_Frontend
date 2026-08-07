import React, { useState, useEffect } from 'react';
import DocsLayout from '../DocsLayout';
import CodeWindow from '../../../Components/CodeWindow';

const sections = [
    { id: 'concepts', title: 'Core Concepts' },
    { id: 'publish', title: 'Publishing Events' },
    { id: 'subscribe', title: 'Subscribing to Events' },
];

const DocsRealTimeDB = () => {
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
                    <span className="text-primary font-bold tracking-widest uppercase text-sm">Database SDKs</span>
                    <span className="material-symbols-outlined text-outline-variant/50 text-[16px]">chevron_right</span>
                    <span className="text-on-surface-variant font-medium text-sm">Realtime DB</span>
                </div>
                <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-4">
                    Realtime DB SDK
                </h1>
                <p className="text-on-surface-variant text-base max-w-3xl leading-relaxed">
                    A dedicated engine for high-frequency, low-latency live data syncing. Perfect for multiplayer games, stock tickers, and live collaborative dashboards.
                </p>
            </div>

            <section id="concepts" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">bolt</span>
                    Core Concepts
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    The Realtime DB operates entirely over WebSockets using a Publisher/Subscriber (PubSub) model. Instead of writing data to a hard drive and querying it later, you publish events to "channels". Anyone listening to that channel receives the data instantly.
                </p>
            </section>

            <section id="publish" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">send</span>
                    Publishing Events
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    You can push JSON payloads to any channel you define. 
                </p>
                <CodeWindow 
                    title="Publish Data" 
                    language="javascript"
                    code={`const realStore = db.realtime();

// Push a stock price update to the "finance_ticker" channel
await realStore.publish("finance_ticker", {
    symbol: "TSLA",
    price: 245.50,
    timestamp: Date.now()
});`} 
                />
            </section>

            <section id="subscribe" className="scroll-mt-28 mb-16 space-y-6">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">sensors</span>
                    Subscribing to Events
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                    Listen to a channel to receive live updates. The callback function fires every time a payload hits the channel.
                </p>
                <CodeWindow 
                    title="Listen for Live Data" 
                    language="javascript"
                    code={`// Listen to the finance ticker
realStore.subscribe("finance_ticker", (data) => {
    console.log(\`Stock Update: \${data.symbol} is now $\${data.price}\`);
    // Instantly update your UI chart here
});

// To stop listening
// realStore.unsubscribe("finance_ticker");`} 
                />
            </section>
        </DocsLayout>
    );
};

export default DocsRealTimeDB;
