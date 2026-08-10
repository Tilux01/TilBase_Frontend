import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { objContext } from '../App';
const Loader = () => {
    const {userCred, serverRoute, setAllProject, setCurrentProjectCred, setProjectHistory} = useContext(objContext)
    const getRequests = useRef(false)
    const navigate = useNavigate()
    useEffect(() => {
        if (!userCred) {
            navigate("/signin")
        }
    }, [userCred])
    useEffect(() => {
      if (!getRequests.current) {
            getRequests.current = true
          axios.post(`${serverRoute}/getProjects`, {
            id: userCred?.id,
            profileKey: userCred?.Profile_Key
          })
          .then((output)=>{
            setAllProject(output?.data?.message?.AllProject)
            setCurrentProjectCred(output?.data?.message?.currentProject)
            setProjectHistory(output?.data?.message?.projectHistory)
            navigate("/dashboard")
          })
          .catch((error)=>{
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "Empty project") {
                    navigate("/projectSeclection")
                    return
                }
                alert(error?.response?.data?.message);
                navigate("/signin")
                return
            }
            navigate("/signin")
            
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
                                <span className="font-mono text-sm text-on-surface-variant">Connecting to Server...</span>
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

export default Loader
