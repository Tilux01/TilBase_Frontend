import React, { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { objContext } from '../App';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Mail, CheckCircle2, Loader2, Database, KeyRound } from 'lucide-react';

const FloatingNodes = () => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Box args={[1.5, 1.5, 1.5]} position={[-1.5, 0.5, 0]}>
          <meshPhysicalMaterial color="#3eb4ff" transparent opacity={0.8} roughness={0.1} transmission={0.9} thickness={1} emissive="#004367" emissiveIntensity={0.2} />
        </Box>
      </Float>
      <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
        <Box args={[1.2, 1.2, 1.2]} position={[1.5, -0.5, 1]}>
          <meshPhysicalMaterial color="#006496" transparent opacity={0.6} roughness={0.2} transmission={0.8} emissive="#004367" emissiveIntensity={0.5} />
        </Box>
      </Float>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={3}>
        <Sphere args={[0.8, 32, 32]} position={[0, 1.5, -1]}>
          <MeshDistortMaterial color="#84d7b2" attach="material" distort={0.4} speed={2} roughness={0.1} transparent opacity={0.9} emissive="#004e36" emissiveIntensity={0.8} />
        </Sphere>
      </Float>
    </group>
  );
};

const EmailVerification = () => {
    const {serverRoute, credObj, setUserCred, setUserPlan} = useContext(objContext)
    const navigate = useNavigate()
    const [OTP, setOTP] = useState("")
    const [processing, setProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!credObj.current) { 
            navigate("/signup")
        }
    }, [])
    
    const goToResend = () =>{
        navigate("/ResendVerification")
    }

    const verifyOTP = () =>{
        setErrorMsg("");
        if (OTP.length < 6) {
            setErrorMsg("Please provide a 6-digit code");
            return;
        }
        
        setProcessing(true);
        axios.post(`${serverRoute}/confirmOTP`, {
            id: credObj?.current?.id,
            mail: credObj?.current?.mail,
            OTP
        })
        .then((output)=>{
            setProcessing(false);
            if (output?.data?.token) localStorage.setItem('tilbase_token', output.data.token);
            navigate("/projectSeclection")
            setUserPlan(output?.data?.getPlan)
            setUserCred(output?.data?.message)
        })
        .catch((error)=>{
            setProcessing(false);
            if (error?.response?.data?.message) {
                setErrorMsg(error?.response?.data?.message)
            } else {
                setErrorMsg("Verification failed. Please try again.");
            }
        })
    }

    return (
        <div className="min-h-screen w-full flex bg-[#0A0F0D] text-white selection:bg-[#004e36] overflow-hidden">
            {}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 border-r border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#004367]/20 to-[#0A0F0D] z-0"></div>
                
                <div className="relative z-10 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#3eb4ff] to-[#84d7b2] rounded-xl flex items-center justify-center shadow-lg">
                        <Database size={20} color="white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#84d7b2] to-[#3eb4ff]">TilBase</span>
                </div>

                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1} />
                        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#84d7b2" />
                        <FloatingNodes />
                    </Canvas>
                </div>

                <div className="relative z-10 max-w-md">
                    <h2 className="text-4xl font-bold mb-4 leading-tight">Secure your access.</h2>
                    <p className="text-white/60 text-lg">Verify your identity to deploy and manage high-performance databases across the globe.</p>
                </div>
            </div>

            {}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                <div className="lg:hidden absolute top-0 right-0 w-96 h-96 bg-[#84d7b2] blur-[150px] opacity-20 rounded-full"></div>
                <div className="lg:hidden absolute bottom-0 left-0 w-96 h-96 bg-[#3eb4ff] blur-[150px] opacity-20 rounded-full"></div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="lg:hidden flex items-center gap-3 mb-10 cursor-pointer justify-center" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-gradient-to-tr from-[#3eb4ff] to-[#84d7b2] rounded-xl flex items-center justify-center shadow-lg">
                            <Database size={20} color="white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#84d7b2] to-[#3eb4ff]">TilBase</span>
                    </div>

                    <div className="mb-8 text-center lg:text-left">
                        <div className="w-16 h-16 bg-[#84d7b2]/10 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0 border border-[#84d7b2]/20 shadow-[0_0_20px_rgba(132,215,178,0.1)]">
                            <Mail size={32} className="text-[#84d7b2]" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Check your email</h1>
                        <p className="text-white/60">We've sent a 6-digit verification code to <span className="text-white font-semibold">{credObj?.current?.mail || "your email"}</span>.</p>
                    </div>

                    {errorMsg && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {errorMsg}
                        </motion.div>
                    )}

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Verification Code</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <KeyRound size={18} className="text-white/40 group-focus-within:text-[#84d7b2] transition-colors" />
                                </div>
                                <input 
                                    value={OTP} 
                                    onChange={(e) => setOTP(e.target.value)} 
                                    type="text" 
                                    maxLength="6"
                                    placeholder="000000" 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-[#84d7b2] focus:ring-1 focus:ring-[#84d7b2] transition-all text-xl tracking-[0.5em] font-mono text-center" 
                                />
                            </div>
                        </div>

                        <button 
                            onClick={verifyOTP} 
                            disabled={processing || OTP.length < 6}
                            className="w-full bg-gradient-to-r from-[#004e36] to-[#00a878] text-white py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(132,215,178,0.4)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center h-14"
                        >
                            {processing ? <Loader2 size={24} className="animate-spin text-white" /> : "Verify Account"}
                        </button>
                    </div>

                    <div className="mt-8 text-center border-t border-white/10 pt-6">
                        <p className="text-white/60 mb-2 text-sm">
                            Didn't receive the code?
                        </p>
                        <button onClick={goToResend} className="text-[#84d7b2] font-semibold hover:text-white transition-colors">
                            Click here to resend
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EmailVerification;
