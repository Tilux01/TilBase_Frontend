const fs = require('fs');
const path = require('path');

const components = [
  { file: 'Security.jsx', name: 'Security', icon: 'security', desc: 'Manage encryption keys, authentication methods, and database auditing.' },
  { file: 'Backup.jsx', name: 'Backups', icon: 'settings_backup_restore', desc: 'Configure automated snapshot schedules and point-in-time recovery.' },
  { file: 'Monitoring.jsx', name: 'Monitoring', icon: 'monitoring', desc: 'View real-time database metrics, alerts, and system health.' },
  { file: 'Performance.jsx', name: 'Performance', icon: 'speed', desc: 'Analyze query performance, slow logs, and index usage.' },
  { file: 'Global.jsx', name: 'Global', icon: 'public', desc: 'Manage multi-region replication and global data distribution.' },
  { file: 'Billing.jsx', name: 'Billing', icon: 'payments', desc: 'View usage, invoices, and manage payment methods.' },
  { file: 'Settings.jsx', name: 'Settings', icon: 'settings', desc: 'Configure project details, API keys, and team members.' },
  { file: 'Support.jsx', name: 'Support', icon: 'contact_support', desc: 'Get help, read documentation, and contact the engineering team.' }
];

const dir = '/home/tilux/Documents/React Js/TIlBase/TilBase FrontEnd/src/DataBaseComponent';

components.forEach(comp => {
  const content = `import React from 'react';
import DashboardLayout from './DashboardLayout';

const ${comp.name} = () => {
    return (
        <DashboardLayout>
            <div className="flex justify-between items-end mb-10">
                <div className="space-y-1">
                    <h1 className="text-display-sm text-4xl font-extrabold tracking-tight text-on-surface">${comp.name}</h1>
                    <p className="text-on-surface-variant text-sm font-medium">${comp.desc}</p>
                </div>
            </div>

            <div className="bg-surface-container-lowest p-12 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl text-primary">${comp.icon}</span>
                </div>
                <h2 className="text-2xl font-bold text-on-surface mb-2">Coming Soon</h2>
                <p className="text-on-surface-variant max-w-md mx-auto leading-relaxed">
                    We are currently building out the ${comp.name} dashboard to provide you with the best experience. Stay tuned for updates!
                </p>
                <button className="mt-8 px-6 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold rounded-lg transition-all text-sm">
                    Read the Documentation
                </button>
            </div>
        </DashboardLayout>
    );
};

export default ${comp.name};
`;
  fs.writeFileSync(path.join(dir, comp.file), content);
  console.log(`Updated ${comp.file}`);
});
