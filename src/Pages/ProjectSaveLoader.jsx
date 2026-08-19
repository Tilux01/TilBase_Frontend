import { useGlobalModal } from "../Context/GlobalModalContext";
import axios from 'axios'
import React, { useContext, useRef } from 'react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { objContext } from '../App'
import PageLoader from '../Components/PageLoader'

const ProjectSaveLoader = () => {
  const { showModal } = useGlobalModal();

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
            .catch(async (error)=>{
                const errorMsg = error?.response?.data?.message;
                if (errorMsg == "Project validation error, please provide necessary parameters") {
                    navigate("/signin")
                    return
                }
                if (errorMsg === "User has exhausted total project limit") {
                    await showModal({ type: "alert", message: "You have reached your maximum project limit! Please upgrade your plan to create more projects." });
                    navigate("/payment");
                    return;
                }
                await showModal({ type: "alert", message: errorMsg || "Error Creating project, please try again" })
                console.log(error?.response);
                console.log(error);
                
                
                navigate("/new_project")
            })
        }

    }, [])
    return <PageLoader statusText="Creating your project and getting it ready for use..." />
}

export default ProjectSaveLoader
