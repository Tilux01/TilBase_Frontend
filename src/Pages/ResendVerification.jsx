import React, { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { objContext } from '../App';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { MailCheck, CheckCircle2, Loader2, Database, ArrowLeft } from 'lucide-react';

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

const ResendVerification = () => {
    const {serverRoute, credObj} = useContext(objContext)
    const navigate = useNavigate()
    const [processing, setProcessing] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!credObj.current) { 
            navigate("/signup")
            return
        }
        
        axios.post(`${serverRoute}/resendOTP`, {
            id: credObj?.current?.id, 
            mail: credObj?.current?.mail
        })  
        .then(() => {
            setProcessing(false);
            setSuccess(true);
        })
        .catch((error)=>{
            setProcessing(false);
            if (error?.response?.data?.message) {
                setErrorMsg(error?.response?.data?.message)
            } else {
                setErrorMsg("Failed to resend verification email.")
            }
        })      
    }, [])

    const goToConfirm = () =>{
        navigate("/EmailVerification")
    }

    const goToLogIn = () =>{
        navigate("/signIn")
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
                    <h2 className="text-4xl font-bold mb-4 leading-tight">We're on it.</h2>
                    <p className="text-white/60 text-lg">Delivering critical security codes directly to your inbox so you can proceed safely.</p>
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
                        {processing ? (
                            <div className="w-16 h-16 bg-[#3eb4ff]/10 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0 border border-[#3eb4ff]/20 shadow-[0_0_20px_rgba(62,180,255,0.1)]">
                                <Loader2 size={32} className="text-[#3eb4ff] animate-spin" />
                            </div>
                        ) : success ? (
                            <div className="w-16 h-16 bg-[#84d7b2]/10 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0 border border-[#84d7b2]/20 shadow-[0_0_20px_rgba(132,215,178,0.1)]">
                                <MailCheck size={32} className="text-[#84d7b2]" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                                <span className="material-symbols-outlined text-3xl text-red-500">error</span>
                            </div>
                        )}
                        
                        <h1 className="text-3xl font-bold mb-2">
                            {processing ? "Sending email..." : success ? "Email Sent" : "Sending Failed"}
                        </h1>
                        <p className="text-white/60">
                            {processing ? "Please wait while we generate and send a new verification code." : success ? "A new verification code has been securely dispatched to your inbox." : "There was a problem sending your verification email."}
                        </p>
                    </div>

                    {errorMsg && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {errorMsg}
                        </motion.div>
                    )}

                    <div className="space-y-6">
                        <button 
                            onClick={goToConfirm} 
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-[#004e36] to-[#00a878] text-white py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(132,215,178,0.4)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2 h-14"
                        >
                            <span>Enter OTP Code</span>
                            <CheckCircle2 size={20} />
                        </button>
                    </div>

                    <div className="mt-8 text-center border-t border-white/10 pt-6">
                        <a onClick={goToLogIn} className="flex items-center justify-center gap-2 text-white/60 hover:text-white font-medium transition-colors cursor-pointer group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to log in
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ResendVerification;
