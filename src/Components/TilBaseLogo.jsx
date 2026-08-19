import React from 'react';

const TilBaseLogo = ({ className = "w-8 h-8" }) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <svg viewBox="6 8 28 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                {/* Top Left Modular Block */}
                <rect x="6" y="8" width="12" height="10" rx="2" fill="#16A34A" fillOpacity="0.8" />
                {/* Top Right Modular Block */}
                <rect x="22" y="8" width="12" height="10" rx="2" fill="#16A34A" fillOpacity="1" />
                {/* Bottom Center Modular Block */}
                <rect x="14" y="22" width="12" height="12" rx="2" fill="#16A34A" fillOpacity="0.9" />
            </svg>
        </div>
    );
};

export default TilBaseLogo;
