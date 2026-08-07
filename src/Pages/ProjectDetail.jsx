import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { generateRandom } from '../BasicFx'
import { objContext } from '../App'
import CopyButton from '../DataBaseComponent/CopyButton'

const ProjectDetail = () => {
    const { userCred } = useContext(objContext)
    const navigate = useNavigate()
    const location = useLocation()
    const ProjectType = location?.state
    const [ProjectKey, setProjectKey] = useState()
    const [ProjectName, setProjectName] = useState("")
    const [projectDescription, setProjectDescription] = useState("")
    const [Environment, setEnvironment] = useState()
    if (!ProjectType) {
        navigate("/projectSeclection")
    }
    useEffect(() => {        
        if (!userCred) {
            navigate("/signin")
        }
        const random = generateRandom()
        setProjectKey(random)
    }, [])
    const proceed = () => {
        if (ProjectName.trim() == "") {
            alert("Please input project title to continue")
            return
        }
        if (ProjectName?.length > 15) {
            alert("Please use shoter name for the project")
            return
        }
        if (projectDescription?.trim() == "") {
            alert("Please input project description to continue")
            return
        }
        if (projectDescription?.length > 255) {
            alert("please provide shorter description")
            return
        }
        if (!Environment) {
            alert("Please select an environment")
            return
        }
        navigate("/PlanSeclection", {
            state:{
                ProjectType,
                ProjectKey,
                ProjectName,
                projectDescription,
                Environment
            }
        })
    }
    return (
        <>
            <main className="flex-1 flex flex-col items-center pt-12 pb-12 px-6">
                <div className="w-full max-w-4xl mb-12 flex flex-col items-center text-center">
                    <span className="text-secondary font-mono text-xs tracking-widest uppercase mb-3">Project Information</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-2">Step 2 of 3: General Information</h1>
                    <p className="text-on-surface-variant max-w-lg">Provide Necessary Informations for this project</p>
                </div>
                <div className="w-full max-w-2xl bg-surface-container-lowest p-8 lg:p-12 rounded-xl shadow-sm">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Project Details</h1>
                        <p className="text-on-surface-variant">Configure your architectural ledger instance by providing core identification and environment parameters.</p>
                    </div>
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-on-surface" for="project-name">Project Name</label>
                                <input onChange={(e) => { setProjectName(e.target.value) }} className="w-full px-4 py-3 bg-surface-container-low border-transparent border-2 rounded-lg focus:border-primary focus:ring-0 transition-all outline-none placeholder:text-on-surface-variant/50" id="project-name" placeholder="e.g. Acme Production" type="text" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-on-surface" for="project-id">Project ID</label>
                                <div className="flex items-center px-4 py-3 bg-surface-container border border-outline-variant/30 rounded-lg select-none">
                                    <span className="text-sm font-mono text-on-surface-variant">{ProjectKey}</span>
                                    <CopyButton textToCopy={ProjectKey} className="ml-auto text-on-surface-variant text-sm" />
                                </div>
                                <p className="text-[11px] text-on-surface-variant leading-tight">Auto-generated unique slug for API access.</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-on-surface" for="description">Project Description</label>
                            <textarea onChange={(e) => { setProjectDescription(e.target.value) }} className="w-full px-4 py-3 bg-surface-container-low border-transparent border-2 rounded-lg focus:border-primary focus:ring-0 transition-all outline-none placeholder:text-on-surface-variant/50" id="description" placeholder="Briefly describe the purpose and scope of this ledger..." rows="4"></textarea>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-on-surface">Environment Selection</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <label onClick={(e) => { setEnvironment("production") }} style={Environment == "production" ? { border: "2px solid #004e36" } : null} className="relative flex flex-col p-4 bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl cursor-pointer hover:border-primary/50 transition-all group has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                    <input checked="" className="sr-only" name="environment" type="radio" value="production" />
                                    <span className="material-symbols-outlined text-primary mb-2">rocket_launch</span>
                                    <span className="font-bold text-sm mb-1">Production</span>
                                    <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Mission Critical</span>
                                </label>
                                <label onClick={(e) => { setEnvironment("stagging") }} style={Environment == "stagging" ? { border: "2px solid #004e36" } : null} className="relative flex flex-col p-4 bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl cursor-pointer hover:border-primary/50 transition-all group has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                    <input className="sr-only" name="environment" type="radio" value="staging" />
                                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors mb-2">science</span>
                                    <span className="font-bold text-sm mb-1">Staging</span>
                                    <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Pre-deployment</span>
                                </label>
                                <label onClick={(e) => { setEnvironment("development") }} style={Environment == "development" ? { border: "2px solid #004e36" } : null} className="relative flex flex-col p-4 bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl cursor-pointer hover:border-primary/50 transition-all group has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                    <input className="sr-only" name="environment" type="radio" value="development" />
                                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors mb-2">code</span>
                                    <span className="font-bold text-sm mb-1">Development</span>
                                    <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Sandbox</span>
                                </label>
                            </div>
                        </div>
                        <section class="space-y-6">
                            <div class="flex items-center justify-between">
                                <h2 class="text-xl font-bold flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary">public</span>
                                    Region Selection
                                </h2>
                                <span class="text-xs font-mono bg-surface-container px-2 py-1 rounded">Selected: TiluxM001</span>
                            </div>
                            <div class="relative w-full h-[300px] rounded-xl overflow-hidden ghost-border group">
                                <img alt="World Map" class="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 transition-all duration-700" data-alt="minimalist clean technical world map visualization with glowing data points on a soft light gray background" data-location="Global" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9hwVYPc3ZrctWYSByQsRRu8wDf5OqoAYuenclxIBTtYBFEGChe3nK4k7pcFK9y1s7I9yrpttmP16DuZ_ALI5qwHHPFf48kADS-Amc2MM62VsrDh38HY6tEIDQ26o4kx2rNPMzsgF1cSQaivJJX8T2_6PJDfkMat372muRKOHbIgkd0fXfnw581Y-dDFZ8UL8YFY7EDapHu_djklbbGG6ZUFZJGFpXE0smJbgUDN1P4e0W4N9HcvQNCIEfwuozANQgzhJlHOQqCqB_" />
                                <div class="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent"></div>
                                <div class="absolute top-[59%] left-[46%] group/pin cursor-pointer">
                                    <div class="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                                    <div class="absolute top-4 left-0 bg-surface-container-lowest shadow-lg p-2 rounded text-xs font-bold whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity">Nigeria (TiluxM001)</div>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button class="p-4 rounded-lg bg-surface-container-lowest ghost-border border-primary ring-1 ring-primary flex flex-col gap-1 text-left">
                                    <span class="text-sm font-bold">Nigeria</span>
                                    <span class="text-xs text-on-surface-variant">TiluxM001</span>
                                </button>
                            </div>
                        </section>
                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/20">
                            <Link to="/projectSeclection">
                                <button className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-on-primary-fixed-variant bg-surface-container-high rounded-lg hover:bg-surface-variant transition-colors flex items-center justify-center gap-2" type="button">
                                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                                    Back
                                </button>
                            </Link>
                            {
                                ProjectType && ProjectKey && ProjectName.trim() != "" && projectDescription.trim() != "" && Environment ?
                                    <button onClick={proceed} className="w-full sm:w-auto px-10 py-3 text-sm font-bold text-white bg-gradient-to-br from-primary to-primary-container rounded-lg shadow-lg shadow-primary/10 hover:opacity-90 active:scale-95 transition-all">
                                        Continue to Step 3
                                    </button>
                                    :
                                    <button className="cursor-default w-full sm:w-auto px-10 py-3 text-sm font-bold text-primary from-primary to-primary-container rounded-lg shadow-lg shadow-primary/10 hover:opacity-90 active:scale-95 transition-all">
                                        Continue to Step 3
                                    </button>
                            }
                        </div>
                    </div>
                </div>
                <p className="mt-8 text-sm text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">info</span>
                    You can modify these settings later in the Project Console.
                </p>
            </main>
            <footer className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant/30 px-6 py-2 flex justify-around items-center z-40">
                <div className="flex flex-col items-center p-2 text-primary">
                    <span className="material-symbols-outlined">edit_square</span>
                    <span className="text-[10px] font-medium mt-1">Details</span>
                </div>
                <div className="flex flex-col items-center p-2 text-on-surface-variant">
                    <span className="material-symbols-outlined">database</span>
                    <span className="text-[10px] font-medium mt-1">Databases</span>
                </div>
                <div className="flex flex-col items-center p-2 text-on-surface-variant">
                    <span className="material-symbols-outlined">settings</span>
                    <span className="text-[10px] font-medium mt-1">Setup</span>
                </div>
            </footer>
        </>
    )
}

export default ProjectDetail
