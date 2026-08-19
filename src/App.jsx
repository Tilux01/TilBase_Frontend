import axios from 'axios';

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('tilbase_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

import { Navigate, Route, Routes } from 'react-router-dom'
import TermsOfService from './Pages/TermsOfService'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import './App.css'
import LandingPage from './Pages/LandingPage'
import ProjectCreation from './Pages/ProjectCreation'
import SIgnIn from './Pages/SIgnIn'
import SignUp from './Pages/SignUp'
import EmailVerification from './Pages/EmailVerification'
import ResendVerification from './Pages/ResendVerification'
import AdminPortal from './Pages/AdminPortal'
import DataExplorer from './DataBaseComponent/DataExplorer'
import NotFound from './Pages/NotFound'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import MainDashboard from './DataBaseComponent/MainDashboard'
import Clusters from './DataBaseComponent/Clusters'
import NetworkAccess from './DataBaseComponent/NetworkAccess'
import ProjectSelection from './Pages/ProjectSelection'
import Loader from './DataBaseComponent/Loader'
import ProjectDetail from './Pages/ProjectDetail'
import PlanSelect from './Pages/PlanSelect'
import ProjectSaveLoader from './Pages/ProjectSaveLoader'
import NewCluster from './DataBaseComponent/NewCluster'
import DocumentPreview from './DataBaseComponent/DocumentPreview'
import DataAccess from './DataBaseComponent/DataAccess'
import Security from './DataBaseComponent/Security'
import Backup from './DataBaseComponent/Backup'
import Monitoring from './DataBaseComponent/Monitoring'
import Performance from './DataBaseComponent/Performance'
import Payment from './DataBaseComponent/Payment'
import Global from './DataBaseComponent/Global'
import Billing from './DataBaseComponent/Billing'
import Settings from './DataBaseComponent/Settings'
import Support from './DataBaseComponent/Support'
import DocsIntro from './Pages/Documentation/Content/DocsIntro'
import DocsDBAccess from './Pages/Documentation/Content/DocsDBAccess'
import DocsAuth from './Pages/Documentation/Content/DocsAuth'
import DocsDocumentDB from './Pages/Documentation/Content/DocsDocumentDB'
import DocsVectorDB from './Pages/Documentation/Content/DocsVectorDB'
import DocsPlaceholder from './Pages/Documentation/Content/DocsPlaceholder'
import DocsFlatDB from './Pages/Documentation/Content/DocsFlatDB'
import DocsGraphDB from './Pages/Documentation/Content/DocsGraphDB'
import DocsHierarchicalDB from './Pages/Documentation/Content/DocsHierarchicalDB'
import DocsRealTimeDB from './Pages/Documentation/Content/DocsRealTimeDB'
import DocsChatbase from './Pages/Documentation/Content/DocsChatbase'
import DocsErrorHandling from './Pages/Documentation/Content/DocsErrorHandling'
import DocsWebhooks from './Pages/Documentation/Content/DocsWebhooks'
import DocsBackups from './Pages/Documentation/Content/DocsBackups'
import { GlobalModalProvider } from './Context/GlobalModalContext'
import GlobalModal from './Components/GlobalModal'
export const objContext = createContext()
function App() {
  const [serverRoute, setServerRoute] = useState("https://tilbase-sql-query-backend-server.onrender.com")
  const credObj = useRef()
  const [userCred, setUserCred] = useState()
  const [userPlan, setUserPlan] = useState()
  const [projectHistory, setProjectHistory] = useState([])
  const [AllProject, setAllProject] = useState()
  const [currentProjectCred, setCurrentProjectCred] = useState()
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
  const [globalSearch, setGlobalSearch] = useState("")
  useEffect(() => {
    console.log("project history", projectHistory);
  }, [projectHistory])

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <>
    <GlobalModalProvider>
      <objContext.Provider value={{serverRoute, credObj, userCred, setUserCred, userPlan, setUserPlan, projectHistory, setProjectHistory, AllProject, setAllProject, currentProjectCred, setCurrentProjectCred, theme, setTheme, globalSearch, setGlobalSearch}}>
        <GlobalModal />
        <Routes>
          <Route path='/' element={<LandingPage/>}></Route>
          <Route path='/signup' element={<SignUp/>}></Route>
          <Route path='/terms' element={<TermsOfService/>}></Route>
          <Route path='/privacy' element={<PrivacyPolicy/>}></Route>
          <Route path='/signIn' element={<SIgnIn />}></Route>
          <Route path='/adminPortal' element={<AdminPortal />}></Route>
          <Route path='/dashboard' element={<MainDashboard/>}></Route>
          <Route path='/EmailVerification' element={<EmailVerification />}></Route>
          <Route path='/ResendVerification' element={<ResendVerification />}></Route>
          <Route path='/CreateProject' element={<ProjectSelection/>}></Route>
          <Route path='/loader' element={<Loader/>}></Route>
          <Route path='*' element={<NotFound/>}></Route>
          <Route path='/clusters' element={<Clusters />}></Route>
          <Route path='/cluster/:clusterId' element={<DataExplorer/>}></Route>
          <Route path='/new_cluster' element={<NewCluster />}></Route>
          <Route path='/new_project' element={<ProjectSelection/>}></Route>
          <Route path='/network-access' element={<NetworkAccess/>}></Route>
          <Route path='/documentPreview' element={<DocumentPreview />}></Route>
          <Route path='/projectSeclection' element={<ProjectSelection />}></Route>
          <Route path='/PlanSeclection' element={<PlanSelect />}></Route>
          <Route path='/projectDetail' element={<ProjectDetail />}></Route>
          <Route path='/saveProject' element={<ProjectSaveLoader />}></Route>
          <Route path='/data-access' element={<DataAccess/>}></Route>
          <Route path='/security' element={<Security/>}></Route>
          <Route path='/backup' element={<Backup/>}></Route>
          <Route path='/monitoring' element={<Monitoring/>}></Route>
          <Route path='/performance' element={<Performance/>}></Route>
          <Route path='/global' element={<Global/>}></Route>
          <Route path='/billing' element={<Billing/>}></Route>
          <Route path='/settings' element={<Settings/>}></Route>
          <Route path='/support' element={<Support/>}></Route>
          <Route path='/payment' element={<Payment/>}></Route>
          <Route path='/docs' element={<DocsIntro/>}></Route>
          <Route path='/docs/db-access' element={<DocsDBAccess/>}></Route>
          <Route path='/docs/auth' element={<DocsAuth/>}></Route>
          <Route path='/docs/error-handling' element={<DocsErrorHandling/>}></Route>
          <Route path='/docs/document-db' element={<DocsDocumentDB/>}></Route>
          <Route path='/docs/vector' element={<DocsVectorDB/>}></Route>
          <Route path='/docs/realtime-db' element={<DocsRealTimeDB/>}></Route>
          <Route path='/docs/graph-db' element={<DocsGraphDB/>}></Route>
          <Route path='/docs/hierarchical-db' element={<DocsHierarchicalDB/>}></Route>
          <Route path='/docs/flat-db' element={<DocsFlatDB/>}></Route>
          <Route path='/docs/chatbase' element={<DocsChatbase/>}></Route>
          <Route path='/docs/webhooks' element={<DocsWebhooks/>}></Route>
          <Route path='/docs/backups' element={<DocsBackups/>}></Route>
        </Routes>
      </objContext.Provider>
    </GlobalModalProvider>
    </>
  )
}

export default App
