import React from 'react';

const PageLoader = ({ statusText = "Connecting to Server..." }) => {
    return (
        <div className="bg-surface-container-lowest h-screen w-full flex items-center justify-center">
            <main className="relative flex flex-col items-center justify-center w-full h-full p-6">
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className="pulse-soft flex flex-col items-center">
                        {/* Changed rounded-lg to rounded-full for a perfectly round icon */}
                        <div className="mb-6 flex items-center justify-center w-20 h-20 bg-primary-container rounded-full shadow-lg">
                            <span className="material-symbols-outlined text-on-primary-container text-4xl">database</span>
                        </div>
                        <h1 className="font-headline font-black text-primary text-5xl md:text-6xl tracking-tighter">
                            TilBase
                        </h1>
                        <p className="font-mono text-on-surface-variant tracking-widest text-xs mt-4 uppercase">
                            All in one cloud system
                        </p>
                    </div>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex items-center space-y-2 flex-col">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
                                <span className="font-mono text-sm text-on-surface-variant">{statusText}</span>
                            </div>
                        </div>
                        <div className="custom-spinner-loader bg-primary border-green-500 mb-3"></div>
                    </div>
                </div>
            </main>
            <div className="sr-only">
                <img alt="technical background" data-alt="close-up of sleek dark server hardware with subtle green status lights in a clean data center environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-sk20p7IMBMijpe_g6GKdEkHJPVpgzZUo2zDUedFfdLVu66eTPvoDiEjyIeQAg86rq0ore34pxx_0WACckTcjvU_ji_apmB1Pqg-a5QxsrSGZuMr7tlwdV73Jk_viU2GiQZDYYAgjtwboplQ_aLwnT_Mry14_SFD_Aqhxlc9UKaO8UFy0hu7XI2Dyqe76mmjyWHyQQ4Wr2S59z4vf15nYLYRSXfUsc2-RszK4B-Z1oGP186ak2HxOYgX5M_vtQwRGvODWC9OrRijZ" />
            </div>
        </div>
    );
};

export default PageLoader;
