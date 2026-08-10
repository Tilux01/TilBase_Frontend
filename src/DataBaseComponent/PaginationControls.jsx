import React from 'react';

const PaginationControls = ({ currentPage, hasMore, onNext, onPrev }) => {
    return (
        <div className="flex items-center justify-between px-4 py-3 bg-surface-container border border-black/5 dark:border-white/5 rounded-xl mt-4">
            <span className="text-sm font-semibold text-on-surface-variant">
                Page <span className="text-on-surface">{currentPage}</span>
            </span>
            <div className="flex items-center gap-2">
                <button 
                    onClick={onPrev} 
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 transition-all ${currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-surface-container-highest text-on-surface-variant/50' : 'bg-surface-container-highest text-on-primary-fixed-variant hover:opacity-80 active:scale-95'}`}
                >
                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                    Prev
                </button>
                <button 
                    onClick={onNext} 
                    disabled={!hasMore}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 transition-all ${!hasMore ? 'opacity-50 cursor-not-allowed bg-surface-container-highest text-on-surface-variant/50' : 'bg-surface-container-highest text-on-primary-fixed-variant hover:opacity-80 active:scale-95'}`}
                >
                    Next
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
            </div>
        </div>
    );
};

export default PaginationControls;
