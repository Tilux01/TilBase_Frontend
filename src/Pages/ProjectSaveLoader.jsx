import axios from 'axios'
import React, { useContext, useRef } from 'react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { objContext } from '../App'

const ProjectSaveLoader = () => {
    const { userCred, serverRoute, setProjectHistory, setAllProject,  setCurrentProjectCred } = useContext(objContext)
    console.log(setProjectHistory);
    
    const sendProject = useRef(false)
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        if (!userCred) {
            navigate("/signin")
            return
        }
        const values = location?.state?.allCred
        console.log(values);
        if (!sendProject.current) {
            sendProject.current = true
            console.log(userCred);
            
            axios.post(`${serverRoute}/create-project`, {
                userId: userCred?.id,
                ProjectName: values?.ProjectName,
                ProjectKey: values?.ProjectKey,
                ProjectType: values?.ProjectType,
                projectDescription: values?.projectDescription,
                Environment: values?.Environment,
                ProjectPlan: values?.ProjectPlan
            })
            .then((output)=>{
                setAllProject(output?.data?.AllProject)
                setCurrentProjectCred(output?.data?.fetchProject)
                setProjectHistory(output?.data?.message) 
                navigate("/dashboard")
            })
            .catch((error)=>{
                const errorMsg = error?.response?.data?.message;
                if (errorMsg == "Project validation error, please provide necessary parameters") {
                    navigate("/signin")
                    return
                }
                if (errorMsg === "User has exhausted total project limit") {
                    alert("You have reached your maximum project limit! Please upgrade your plan to create more projects.");
                    navigate("/payment");
                    return;
                }
                alert(errorMsg || "Error Creating project, please try again")
                console.log(error?.response);
                console.log(error);
                
                
                navigate("/new_project")
            })
        }

    }, [])
    return (
        <div>
            <main className="relative flex flex-col items-center justify-center w-full h-full p-6">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-surface-container-highest opacity-40"></div>
                    <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "radial-gradient(#004e36 0.5px, transparent 0.5px)", backgroundSize: "32px 32px"}}></div>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className="pulse-soft flex flex-col items-center">
                        <div className="mb-6 flex items-center justify-center w-20 h-20 bg-primary-container rounded-lg shadow-lg">
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
                                <span className="font-mono text-sm text-on-surface-variant">Creating your project and getting it ready for use...</span>
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
    )
}

export default ProjectSaveLoader
