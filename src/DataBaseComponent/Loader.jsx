import { useGlobalModal } from "../Context/GlobalModalContext";
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { objContext } from '../App';
import PageLoader from '../Components/PageLoader'

const Loader = () => {
  const { showModal } = useGlobalModal();

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
          .catch(async (error)=>{
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "Empty project") {
                    navigate("/projectSeclection")
                    return
                }
                await showModal({ type: "alert", message: error?.response?.data?.message });
                navigate("/signin")
                return
            }
            navigate("/signin")
            
          })
      }
    }, [])
    
    return <PageLoader statusText="Connecting to Server..." />
}

export default Loader
