import React, { useState } from 'react';

const CopyButton = ({ textToCopy, className = "text-on-surface-variant hover:text-primary text-sm" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e) => {
        e.stopPropagation();
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <span 
            onClick={handleCopy} 
            className={`material-symbols-outlined cursor-pointer transition-colors ${className} ${copied ? '!text-primary' : ''}`}
            title="Copy to clipboard"
        >
            {copied ? 'check' : 'content_copy'}
        </span>
    );
};

export default CopyButton;
