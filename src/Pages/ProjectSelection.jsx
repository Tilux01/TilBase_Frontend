import React, { useContext, useEffect, useState } from 'react'
import userIcon from "../Images/user.png"
import { Link, useNavigate } from 'react-router-dom'
import { objContext } from '../App'


const ProjectSelection = () => {
    const { userCred } = useContext(objContext)
    const navigate = useNavigate()
    const [ProjectType, setProjectType] = useState()
    useEffect(() => {
        if (!userCred) {
            navigate("/signin")
        }
    }, [userCred])
    return (
        <div className="bg-surface font-body text-on-surface w-full min-h-screen flex flex-col">
            <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 max-w-7xl mx-auto w-full">
                <div className="w-full max-w-4xl mb-12 flex flex-col items-center text-center">
                    <span className="text-secondary font-mono text-xs tracking-widest uppercase mb-3">Project Initiation</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-2">Step 1 of 3: Project Type</h1>
                    <p className="text-on-surface-variant max-w-lg">Select the foundational architecture for your next deployment. Each category comes pre-configured with industry-standard security defaults.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
                    <button onClick={() => { setProjectType("Database") }} style={ProjectType == "Database" ? { border: "2px solid #004e36" } : null} className="group flex flex-col items-start p-6 bg-surface-container-lowest ghost-border rounded-xl hover:shadow-lg hover:border-primary-container transition-all duration-300 text-left relative overflow-hidden">
                        <div className="bg-surface-container-low p-3 rounded-lg mb-4 group-hover:bg-primary-container group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined" data-icon="database">database</span>
                        </div>
                        <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">Database</h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed">Get an exclusive data storage with maximum security and fast response</p>
                    </button>
                    <button onClick={() => { setProjectType("ChatBase") }} style={ProjectType == "ChatBase" ? { border: "2px solid #004e36" } : null} className="group flex flex-col items-start p-6 bg-surface-container-lowest ghost-border rounded-xl hover:shadow-lg hover:border-primary-container transition-all duration-300 text-left">
                        <div className="bg-surface-container-low p-3 rounded-lg mb-4 group-hover:bg-primary-container group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined" data-icon="bolt">bolt</span>
                        </div>
                        <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">ChatBase</h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed">Get exclusive all-in-one chat handling databse and realtime rendering</p>
                    </button>
                    {}
                </div>
                <div className="mt-16 flex flex-col sm:flex-row items-center gap-8 w-full max-w-lg justify-center">
                    <a className="text-on-surface-variant hover:text-on-surface transition-colors font-medium border-b border-transparent hover:border-on-surface-variant pb-1" href="#">Cancel Project Creation</a>
                    {
                        ProjectType ?
                            <Link to="/projectDetail" state={ProjectType}>
                                <button style={ProjectType ? { background: "#004e36", color: "white", cursor: "pointer" } : { cursor: "auto" }} className="px-12 py-3 bg-surface-container-high text-on-surface-variant/50 rounded-lg font-bold flex items-center gap-2 group" disabled="">
                                    Next Step
                                    <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
                                </button>
                            </Link>
                            :
                            <button style={ProjectType ? { background: "#004e36", color: "white", cursor: "pointer" } : { cursor: "auto" }} className="px-12 py-3 bg-surface-container-high text-on-surface-variant/50 rounded-lg font-bold flex items-center gap-2 group" disabled="">
                                Next Step
                                <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
                            </button>
                    }
                </div>
            </main>
        </div>
    )
}

export default ProjectSelection
