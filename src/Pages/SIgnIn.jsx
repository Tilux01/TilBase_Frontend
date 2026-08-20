import React, { useContext, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { objContext } from '../App';
import { auth, googleProvider, githubProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Mail, Lock, Eye, EyeOff, Loader2, Database } from 'lucide-react';
import TilBaseLogo from "../Components/TilBaseLogo";

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
          <meshPhysicalMaterial color="#39e03d" transparent opacity={0.8} roughness={0.1} transmission={0.9} thickness={1} emissive="#052E16" emissiveIntensity={0.5} />
        </Box>
      </Float>
      <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
        <Box args={[1.2, 1.2, 1.2]} position={[1.5, -0.5, 1]}>
          <meshPhysicalMaterial color="#16A34A" transparent opacity={0.6} roughness={0.2} transmission={0.8} emissive="#14532d" emissiveIntensity={0.8} />
        </Box>
      </Float>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={3}>
        <Sphere args={[0.8, 32, 32]} position={[0, 1.5, -1]}>
          <MeshDistortMaterial color="#10B981" attach="material" distort={0.4} speed={2} roughness={0.1} transparent opacity={0.9} emissive="#022c22" emissiveIntensity={0.8} />
        </Sphere>
      </Float>
    </group>
  );
};

const SIgnIn = () => {
    const { serverRoute, setUserCred, credObj, setUserPlan } = useContext(objContext);
    const navigate = useNavigate();
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const signIn = () => {
        setErrorMsg("");
        if (mail.trim() === "") return setErrorMsg("Please provide your email address");
        if (password.trim() === "") return setErrorMsg("Please provide your password to continue");

        setProcessing(true);
        axios.post(`${serverRoute}/devSignIn`, { mail, password })
            .then((response) => {
                setProcessing(false);
                const data = response?.data?.message;
                if (data?.Verified == 1) {
                    if (response.data.token) localStorage.setItem('tilbase_token', response.data.token);
                    setUserCred(data);
                    setUserPlan(response?.data?.getPlan);
                    navigate("/loader");
                } else {
                    credObj.current = { id: data?.id, mail: data?.Email };
                    navigate("/EmailVerification");
                }
            })
            .catch((error) => {
                setProcessing(false);
                if (error?.response?.data?.message) {
                    setErrorMsg(error?.response?.data?.message);
                } else {
                    setErrorMsg("Invalid credentials. Please try again.");
                }
            });
    };

    const handleFirebaseOAuth = async (provider) => {
        setErrorMsg("");
        setProcessing(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            const response = await axios.post(`${serverRoute}/oauthSignIn`, { 
                email: user.email, 
                displayName: user.displayName || user.email.split('@')[0], 
                photoURL: user.photoURL,
                providerId: provider === googleProvider ? 'google' : 'github',
                uid: user.uid
            });
            
            setProcessing(false);
            const data = response?.data?.message;
            if (data?.Verified == 1) {
                if (response.data.token) localStorage.setItem('tilbase_token', response.data.token);
                setUserCred(data);
                setUserPlan(response?.data?.getPlan);
                navigate("/loader");
            } else {
                credObj.current = { id: data?.id, mail: data?.Email };
                navigate("/EmailVerification");
            }
        } catch (error) {
            setProcessing(false);
            console.error(error);
            setErrorMsg(error.message || "OAuth authentication failed");
        }
    };

    return (
        <div className="h-screen w-full flex bg-[#0B101A] text-white selection:bg-[#16A34A] overflow-hidden font-sans">
            {/* Left Side: Premium Visual Hook */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 border-r border-[#222834] overflow-hidden bg-[#05080f]">
                {/* Abstract Neon Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#16A34A]/10 via-transparent to-[#0B101A] z-0 pointer-events-none"></div>
                
                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="flex items-center gap-2"><TilBaseLogo className="w-10 h-10" /><span className="text-3xl font-extrabold tracking-tighter text-white">TilBase</span></div>
                </div>

                {/* 3D Canvas */}
                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1} />
                        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#39e03d" />
                        <FloatingNodes />
                    </Canvas>
                </div>

                {/* Headline */}
                <div className="relative z-10 max-w-md">
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
                        Welcome <span className="text-[#39e03d] italic">back.</span>
                    </h2>
                    <p className="text-[#8c93a1] text-lg leading-relaxed">
                        Log in to manage your active clusters and review your platform performance.
                    </p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                {/* Mobile Background Glow */}
                <div className="lg:hidden absolute top-0 right-0 w-96 h-96 bg-[#16A34A] blur-[150px] opacity-10 rounded-full pointer-events-none"></div>
                <div className="lg:hidden absolute bottom-0 left-0 w-96 h-96 bg-[#39e03d] blur-[150px] opacity-10 rounded-full pointer-events-none"></div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative z-10"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10 cursor-pointer justify-center" onClick={() => navigate('/')}>
                        <div className="flex items-center gap-2"><TilBaseLogo className="w-10 h-10" /><span className="text-2xl font-bold tracking-tighter text-white">TilBase</span></div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2 text-white tracking-tight">Sign in</h1>
                        <p className="text-[#8c93a1]">Manage your global database infrastructure</p>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button 
                            onClick={() => handleFirebaseOAuth(githubProvider)}
                            disabled={processing}
                            className="flex items-center justify-center gap-2 bg-[#151922] border border-[#222834] hover:border-[#16A34A]/50 hover:bg-[#1A1F2E] transition-colors py-3.5 rounded-xl font-medium text-sm text-white disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> GitHub
                        </button>
                        <button 
                            onClick={() => handleFirebaseOAuth(googleProvider)}
                            disabled={processing}
                            className="flex items-center justify-center gap-2 bg-[#151922] border border-[#222834] hover:border-[#16A34A]/50 hover:bg-[#1A1F2E] transition-colors py-3.5 rounded-xl font-medium text-sm text-white disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg> Google
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center mb-8">
                        <div className="flex-grow border-t border-[#222834]"></div>
                        <span className="flex-shrink-0 mx-4 text-[#64748B] text-xs tracking-widest uppercase font-semibold">or sign in with email</span>
                        <div className="flex-grow border-t border-[#222834]"></div>
                    </div>

                    {errorMsg && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {errorMsg}
                        </motion.div>
                    )}

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#94A3B8]">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-[#64748B] group-focus-within:text-[#39e03d] transition-colors" />
                                </div>
                                <input value={mail} onChange={(e) => setMail(e.target.value)} type="email" placeholder="name@company.com" className="w-full bg-[#151922] border border-[#222834] rounded-xl py-3 pl-11 pr-4 text-white placeholder-[#475569] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] hover:border-[#334155] transition-all shadow-sm" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-[#94A3B8]">Password</label>
                                <a href="#" className="text-sm text-[#39e03d] hover:text-[#16A34A] transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-[#64748B] group-focus-within:text-[#39e03d] transition-colors" />
                                </div>
                                <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="••••••••••••" className="w-full bg-[#151922] border border-[#222834] rounded-xl py-3 pl-11 pr-12 text-white placeholder-[#475569] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] hover:border-[#334155] transition-all shadow-sm" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#64748B] hover:text-[#94A3B8] transition-colors">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={signIn} 
                            disabled={processing}
                            className="w-full bg-[#16A34A] text-[#050505] py-4 rounded-xl font-bold text-base hover:bg-[#39e03d] hover:shadow-[0_0_20px_rgba(22,163,74,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center h-14 mt-6"
                        >
                            {processing ? <Loader2 size={22} className="animate-spin text-[#050505]" /> : "Sign In"}
                        </button>
                    </div>

                    <div className="mt-8 text-center border-t border-[#222834] pt-8">
                        <p className="text-[#8c93a1]">
                            Don't have an account? <a onClick={() => navigate('/signup')} className="text-white font-semibold hover:text-[#39e03d] transition-colors cursor-pointer ml-1">Sign Up</a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SIgnIn;
