import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeWindow = ({ title = "Terminal", code, language = "javascript" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-4xl mx-auto my-6 rounded-xl overflow-hidden border border-outline-variant shadow-2xl bg-[#1e1e1e] group transition-all duration-300 hover:shadow-primary/10 hover:border-primary">
            {}
            <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <span className="ml-4 text-xs font-mono text-white/50 select-none">
                        {title}
                    </span>
                </div>
                
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-white/60 bg-white/5 hover:bg-white/10 hover:text-white transition-all focus:outline-none"
                    aria-label="Copy code"
                >
                    {copied ? (
                        <>
                            <span className="material-symbols-outlined text-[14px] text-green-400">check</span>
                            <span className="text-green-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[14px]">content_copy</span>
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            
            {}
            <div className="relative text-sm">
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: 'transparent',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        border: 'none',
                    }}
                    showLineNumbers={true}
                >
                    {code.trim()}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeWindow;
