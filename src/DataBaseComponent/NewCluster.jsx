import { useGlobalModal } from "../Context/GlobalModalContext";
import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from './DashboardLayout'
import userIcon from "../Images/user.png"
import { Link, useNavigate } from 'react-router-dom'
import { generateCLuterName, generateRandom } from '../BasicFx'
import axios from 'axios'
import { objContext } from '../App'
import CopyButton from './CopyButton'


const NewCluster = () => {
  const { showModal } = useGlobalModal();

    const navigate = useNavigate()
    const { userCred, currentProjectCred, userPlan, serverRoute, setProjectHistory } = useContext(objContext)
    const [processing, setProcessing] = useState(false)
    const [clusterType, setClusterType] = useState()
    const [clusterName, setClusterName] = useState(`Cluster-${generateCLuterName()}`)
    const [ClusterKey, setClusterKey] = useState(generateRandom())
    const [clusterPassword, setClusterPassword] = useState(generateRandom())
    useEffect(() => {
        console.log(currentProjectCred);

        if (!userCred) {
            navigate("/signin")
            return
        }
        if (!userPlan) {
            navigate("/signin")
            return
        }
    }, [])
    const createCluster = async () => {
        if (!clusterType) {
            return await showModal({ type: "alert", message: "please selct cluster type" })
        }
        if (!clusterName || clusterName.trim() == "") {
            return await showModal({ type: "alert", message: "Please write cluster name" })
        }
        setProcessing(true)
        axios.post(`${serverRoute}/createCluster`, {
            user_id: userCred?.id,
            user_key: userCred?.Profile_Key,
            project_id: currentProjectCred?.id,
            project_key: currentProjectCred?.Project_Key,
            Cluster_Name: clusterName,
            Cluster_Password: clusterPassword,
            Cluster_Type: clusterType,
            Cluster_Key: ClusterKey
        })
            .then(async (result) => {
                setProcessing(false)
                console.log(result.data?.message)
                setProjectHistory(prev=> [...prev, result.data?.message?.history])
                await showModal({ type: "alert", message: "cluster created successfully" })
                navigate("/clusters")
            })
            .catch(async (error) => {
                setProcessing(false)
                console.log(error?.response?.data);
                await showModal({ type: "alert", message: error?.response?.data?.message })
            })
    }
    return (
        <div className='bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed'>
            <DashboardLayout>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                    <div className="lg:col-span-8 xl:col-span-9 space-y-10">
                    <header>
                        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Create New Cluster</h1>
                        <p className="text-on-surface-variant font-medium">Provision a managed architectural database instance with precision.</p>
                    </header>
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary">1</span>
                            <h2 className="text-xl font-bold tracking-tight">Cluster Selection</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {currentProjectCred?.Project_Type === 'ChatBase' ? (
                                <>
                                    <div onClick={() => { setClusterType("chatbase") }} className={`p-5 bg-surface-container ghost-border rounded-xl hover:border-primary transition-all cursor-pointer group ${clusterType == "chatbase" ? "border-2 border-purple-400 rounded-xl" : null}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="material-symbols-outlined text-purple-400 text-3xl">forum</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">Core Chat Engine</h3>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">Standard real-time messaging, group chats, typing indicators, and presence tracking.</p>
                                    </div>
                                    <div onClick={() => { setClusterType("chatbase_broadcast") }} className={`p-5 bg-surface-container ghost-border rounded-xl hover:border-primary transition-all cursor-pointer group ${clusterType == "chatbase_broadcast" ? "border-2 border-pink-400 rounded-xl" : null}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="material-symbols-outlined text-pink-400 text-3xl">podcasts</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">Broadcast Chat</h3>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">High-concurrency cluster optimized for live streams, one-to-many announcements, and massive open audiences.</p>
                                    </div>
                                    <div onClick={() => { setClusterType("chatbase_ai") }} className={`p-5 bg-surface-container ghost-border rounded-xl hover:border-primary transition-all cursor-pointer group ${clusterType == "chatbase_ai" ? "border-2 border-indigo-400 rounded-xl" : null}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="material-symbols-outlined text-indigo-400 text-3xl">robot_2</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">AI Moderation Engine</h3>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">Built-in sentiment analysis and auto-moderation. Automatically filters toxic messages and warns users.</p>
                                    </div>
                                    <div onClick={() => { setClusterType("chatbase_secure") }} className={`p-5 bg-surface-container ghost-border rounded-xl hover:border-primary transition-all cursor-pointer group ${clusterType == "chatbase_secure" ? "border-2 border-amber-400 rounded-xl" : null}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="material-symbols-outlined text-amber-400 text-3xl">enhanced_encryption</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">Encrypted Vault</h3>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">End-to-end encrypted messaging setup. Keys are never stored on the server. Compliance ready.</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div onClick={() => { setClusterType("document") }} className={`p-5 bg-surface-container ghost-border rounded-xl hover:border-primary transition-all cursor-pointer group ${clusterType == "document" ? "border-2 border-secondary rounded-xl" : null}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="material-symbols-outlined text-secondary text-3xl icon icon-filled">database</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">Document DB</h3>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">Flexible JSON‑like storage. Perfect for catalogs, content management, or apps with changing data structures.</p>
                                    </div>
                                    <div onClick={() => { setClusterType("vector") }} className={`p-5 bg-surface-container ghost-border rounded-xl hover:border-primary transition-all cursor-pointer group ${clusterType == "vector" ? "border-2 border-teal-400 rounded-xl" : null}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="material-symbols-outlined text-teal-400 text-3xl">data_array</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">Vector DB</h3>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">High-dimensional embedding storage. Native Cosine Similarity for fast AI semantic search.</p>
                                    </div>
                                    <div onClick={() => { setClusterType("realtime") }} className={`p-5 bg-surface-container ghost-border rounded-xl hover:border-primary transition-all cursor-pointer group ${clusterType == "realtime" ? "border-2 border-tertiary rounded-xl" : null}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="material-symbols-outlined text-tertiary text-3xl">sync</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">RealTime DB</h3>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">Low‑latency, live‑sync database. Ideal for chat apps, collaborative tools, or live dashboards.</p>
                                    </div>
                                    <div onClick={() => { setClusterType("flat") }} className={`p-5 bg-surface-container ghost-border rounded-xl hover:border-primary transition-all cursor-pointer group ${clusterType == "flat" ? "border-2 border-orange-400 rounded-xl" : null}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="material-symbols-outlined text-orange-400 text-3xl icon icon-filled">cloud</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">Flat DB</h3>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">Simple file‑based database storage. Best for small apps, contact lists, or configuration data. No complex setup.</p>
                                    </div>
                                    <div onClick={() => { setClusterType("graph") }} className={`p-5 bg-surface-container ghost-border rounded-xl hover:border-primary transition-all cursor-pointer group ${clusterType == "graph" ? "border-2 border-primary rounded-xl" : null}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="material-symbols-outlined text-primary text-3xl">bar_chart</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">Graph DB</h3>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">Store and query connected data. Best for social networks, recommendation engines, or fraud detection.</p>
                                    </div>
                                    <div onClick={() => { setClusterType("hierarchical") }} className={`p-5 bg-surface-container ghost-border rounded-xl hover:border-primary transition-all cursor-pointer group ${clusterType == "hierarchical" ? "border-2 border-emerald-400 rounded-xl" : null}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="material-symbols-outlined text-emerald-400 text-3xl">folder</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">Hierarchical DB</h3>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">Tree‑structured data storage. Good for organizational charts, file systems, or XML/JSON nested data.</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary">2</span>
                            <h2 className="text-xl font-bold tracking-tight">Cloud Provider &amp; Region</h2>
                        </div>
                        <div className="bg-surface-container-highest rounded-xl p-8 space-y-8">
                            {}
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider">Select Region</label>
                                <select className="w-full bg-surface-container-highest border-black/5 dark:border-white/5 rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                                    <option>TiluxM001 (Nigeria)</option>
                                </select>
                                <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-sm bg-surface-container-highest">
                                    <img className="w-full h-full object-cover opacity-60 mix-blend-multiply" data-alt="A stylized global world map visualization optimized for a technical dashboard. The map uses a minimalist dot-matrix or wireframe style in deep forest green and slate grey tones. Strategic glowing nodes represent data center locations across continents. The aesthetic is clean, professional, and architectural, emphasizing global connectivity and reliable infrastructure." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiIGNc6prvrJFcGJGf4AshPz96vNcvYC8bPR7LHqWEjjlskqOHPlsCSJV0dAI_YXfVF-0hAc1UgNMJG3Ko3spiKOMzHtrYbC7OcCYJe1jlOFb2WjFzA2dcYQlB0ow3QE-Yn1oyyE7J_6AUDyB8nsNBL0MxQxXsdjHvfC5D-HwtS2hJieOJkYUnE2tvwZ1iA71y7LIMnya4K8qBB9cuZU45lqkqKXqa22eZDEgxD3IpnKhZvsVWcLBM9qbhDi08yhuOMIlLBNH16Tw5" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
                                    <div style={{ top: "67%", left: "49%" }} className="absolute left-1/2 w-3 h-3 bg-primary rounded-full border-2 border-white"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary">3</span>
                            <h2 className="text-xl font-bold tracking-tight">Cluster Settings</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider">Cluster Name</label>
                                <input className="w-full font-mono bg-surface-container-highest border-black/5 dark:border-white/5 rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary transition-all" type="text" value={clusterName} onChange={(e) => { setClusterName(e.target.value) }} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-on-surface" for="project-id">Cluster ID</label>
                                <div className="flex items-center px-4 py-3 bg-surface-container border border-black/5 dark:border-white/5 rounded-lg select-none">
                                    <span className="text-sm font-mono text-on-surface-variant">{ClusterKey}</span>
                                    <CopyButton textToCopy={ClusterKey} className="ml-auto text-on-surface-variant text-sm flex items-center" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-on-surface" for="project-id">Cluster Password</label>
                                <div className="flex items-center px-4 py-3 bg-surface-container border border-black/5 dark:border-white/5 rounded-lg select-none">
                                    <span className="text-sm font-mono text-on-surface-variant">{clusterPassword}</span>
                                    <CopyButton textToCopy={clusterPassword} className="ml-auto text-on-surface-variant text-sm flex items-center" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between p-4 bg-surface-container border border-black/5 dark:border-white/5 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded shadow-sm">
                                        <span className="material-symbols-outlined text-primary">history</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Backup Services</h4>
                                        <p className="text-xs text-on-surface-variant">Automated daily snapshots with 30-day retention.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input checked="" className="sr-only peer" type="checkbox" />
                                    <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-surface-container border border-black/5 dark:border-white/5 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded shadow-sm">
                                        <span className="material-symbols-outlined text-secondary">security</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Network Isolation</h4>
                                        <p className="text-xs text-on-surface-variant">VPC Peering and Private Link capabilities.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input className="sr-only peer" type="checkbox" />
                                    <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </section>
                    </div>
                    <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
                    <div className="sticky top-24">
                        <div className="bg-surface-container ghost-border rounded-2xl shadow-sm p-6 space-y-8">
                            <div>
                                <h3 className="text-lg font-extrabold tracking-tight mb-6">Current Plan</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-on-surface-variant">Tier</span>
                                        <span style={{ textTransform: "Capitalize" }} className="font-bold text-primary">{userPlan?.Plan_Name}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-on-surface-variant">Provider</span>
                                        <span className="font-bold">TiluxM001</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-on-surface-variant">Region</span>
                                        <span className="font-bold">Nigeria</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-on-surface-variant">Specs</span>
                                        <span className="font-mono text-xs">{userPlan?.Ram || 1}gb ({userPlan?.Cloud_Storage >= 1000 ? userPlan?.Cloud_Storage / 1000 + "gb" : userPlan?.Cloud_Storage + "mb"} space)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-zinc-100">
                                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Estimated Cost</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-extrabold tracking-tighter text-on-surface">{userPlan?.plan_price}$</span>
                                    <span className="text-on-surface-variant font-medium">/mo</span>
                                </div>
                                <p className="text-[10px] text-zinc-400 mt-2 italic text-cyan-700 underline cursor-pointer">Go to payment to change your current plan</p>
                            </div>
                            {
                                processing ?
                                    <div className="w-full bg-login-gradient text-on-primary font-semibold py-4 rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 bg-primary">
                                        <div className="custom-spinner-small bg-primary border-green-500"></div>
                                        Processing...
                                    </div>
                                    :
                                    <button onClick={createCluster} className="bg-primary w-full primary-gradient text-white py-4 rounded-xl font-bold tracking-tight hover:brightness-110 transition-all shadow-md shadow-primary/20">
                                        Create Cluster
                                    </button>
                            }
                            <p className="text-center text-[11px] text-on-surface-variant leading-relaxed">
                                By clicking "Create Cluster", you agree to the Architectural Ledger
                                <a className="text-secondary underline underline-offset-2" href="/terms">Terms of Service</a>.
                            </p>
                        </div>
                        <div className="mt-6 p-4 bg-surface-container border border-black/5 dark:border-white/5 rounded-xl flex gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">info</span>
                            <p className="text-xs text-on-surface-variant leading-tight">Visit Network access to set security rules and add IP address</p>
                        </div>
                    </div>
                    </aside>
                </div>
            </DashboardLayout>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-t border-zinc-200 flex items-center justify-around z-50">
                <button className="flex flex-col items-center justify-center gap-1 text-zinc-500">
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="text-[10px] uppercase font-bold">Dash</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-1 text-primary">
                    <span className="material-symbols-outlined" >dns</span>
                    <span className="text-[10px] uppercase font-bold">Clusters</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-1 text-zinc-500">
                    <span className="material-symbols-outlined">security</span>
                    <span className="text-[10px] uppercase font-bold">Security</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-1 text-zinc-500">
                    <span className="material-symbols-outlined">person</span>
                    <span className="text-[10px] uppercase font-bold">Profile</span>
                </button>
            </nav>
        </div>
    )
}

export default NewCluster
