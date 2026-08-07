import React, { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { objContext } from '../App';
import { auth, googleProvider, githubProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Mail, Lock, User, Eye, EyeOff, Loader2, Database } from 'lucide-react';

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
          <meshPhysicalMaterial color="#84d7b2" transparent opacity={0.8} roughness={0.1} transmission={0.9} thickness={1} emissive="#004e36" emissiveIntensity={0.2} />
        </Box>
      </Float>
      <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
        <Box args={[1.2, 1.2, 1.2]} position={[1.5, -0.5, 1]}>
          <meshPhysicalMaterial color="#00a878" transparent opacity={0.6} roughness={0.2} transmission={0.8} emissive="#004e36" emissiveIntensity={0.5} />
        </Box>
      </Float>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={3}>
        <Sphere args={[0.8, 32, 32]} position={[0, 1.5, -1]}>
          <MeshDistortMaterial color="#3eb4ff" attach="material" distort={0.4} speed={2} roughness={0.1} transparent opacity={0.9} emissive="#004367" emissiveIntensity={0.8} />
        </Sphere>
      </Float>
    </group>
  );
};

const SignUp = () => {
    const { serverRoute, credObj, setUserCred, setUserPlan } = useContext(objContext);
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [acceptPolicy, setAcceptPolicy] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        setPasswordStrength(0);
        let strength = 0;
        if (/[A-Z]/.test(password) && /.*[a-z]{3}/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (password.length > 7) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        setPasswordStrength(strength);
    }, [password]);

    const submitCred = () => {
        setErrorMsg("");
        if (!userName || userName.trim() === "") return setErrorMsg("Username is required");
        if (!userName.match(/^[A-Za-z0-9]+$/)) return setErrorMsg("Only letters and numbers allowed for username");
        if (userName.length > 10) return setErrorMsg("Please use a shorter username");
        if (!mail || mail.trim() === "") return setErrorMsg("Email is required");
        if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))) return setErrorMsg("Please provide a valid email");
        if (!password || password.trim() === "") return setErrorMsg("Password is required");
        if (passwordStrength < 4) return setErrorMsg("Please use a strong password");
        if (!acceptPolicy) return setErrorMsg("Please accept the terms before proceeding");

        setProcessing(true);
        axios.post(`${serverRoute}/devSignUp`, { mail, password, userName })
            .then((response) => {
                setProcessing(false);
                credObj.current = { mail, id: response.data.message };
                navigate("/EmailVerification");
            })
            .catch((error) => {
                setProcessing(false);
                if (error?.response?.data?.message) {
                    setErrorMsg(error?.response?.data?.message);
                } else {
                    setErrorMsg("An unexpected error occurred");
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
        <div className="min-h-screen w-full flex bg-[#0A0F0D] text-white selection:bg-[#004e36] overflow-hidden">
            {}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 border-r border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#004e36]/20 to-[#0A0F0D] z-0"></div>
                
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
                        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3eb4ff" />
                        <FloatingNodes />
                    </Canvas>
                </div>

                <div className="relative z-10 max-w-md">
                    <h2 className="text-4xl font-bold mb-4 leading-tight">Start building at the edge.</h2>
                    <p className="text-white/60 text-lg">Join thousands of developers curating the next generation of databases and AI ChatBots seamlessly.</p>
                </div>
            </div>

            {}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                {}
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

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Create an account</h1>
                        <p className="text-white/60">Enter your details below to get started</p>
                    </div>

                    {}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button 
                            onClick={() => handleFirebaseOAuth(githubProvider)}
                            disabled={processing}
                            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors py-3 rounded-xl font-medium text-sm disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> GitHub
                        </button>
                        <button 
                            onClick={() => handleFirebaseOAuth(googleProvider)}
                            disabled={processing}
                            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors py-3 rounded-xl font-medium text-sm disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg> Google
                        </button>
                    </div>

                    <div className="relative flex items-center mb-8">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-white/40 text-sm">or continue with email</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    {errorMsg && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {errorMsg}
                        </motion.div>
                    )}

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User size={18} className="text-white/40 group-focus-within:text-[#84d7b2] transition-colors" />
                                </div>
                                <input value={userName} onChange={(e) => setUserName(e.target.value)} type="text" placeholder="johndoe" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-[#84d7b2] focus:ring-1 focus:ring-[#84d7b2] transition-all" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-white/40 group-focus-within:text-[#84d7b2] transition-colors" />
                                </div>
                                <input value={mail} onChange={(e) => setMail(e.target.value)} type="email" placeholder="name@company.com" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-[#84d7b2] focus:ring-1 focus:ring-[#84d7b2] transition-all" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-white/40 group-focus-within:text-[#84d7b2] transition-colors" />
                                </div>
                                <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="••••••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder-white/20 focus:outline-none focus:border-[#84d7b2] focus:ring-1 focus:ring-[#84d7b2] transition-all" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            
                            {}
                            <div className="pt-2">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">Security Level</span>
                                    <span className="text-xs font-semibold text-[#84d7b2]">
                                        {passwordStrength === 0 && password.length > 0 && "Weak"}
                                        {passwordStrength === 1 && "Fair"}
                                        {passwordStrength === 2 && "Good"}
                                        {passwordStrength === 3 && "Strong"}
                                        {passwordStrength >= 4 && "Optimized"}
                                    </span>
                                </div>
                                <div className="flex gap-1 h-1.5">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div key={level} className={`flex-1 rounded-full transition-all duration-300 ${passwordStrength >= level ? 'bg-[#84d7b2] shadow-[0_0_10px_rgba(132,215,178,0.5)]' : 'bg-white/10'}`}></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 pt-2 pb-4">
                            <div className="flex items-center h-5 mt-0.5">
                                <input checked={acceptPolicy} onChange={(e) => setAcceptPolicy(e.target.checked)} type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#84d7b2] focus:ring-[#84d7b2] focus:ring-offset-0 cursor-pointer" />
                            </div>
                            <p className="text-sm text-white/60 leading-tight">
                                I agree to the <Link to="/terms" className="text-white hover:text-[#84d7b2] transition-colors underline decoration-white/30">Terms of Service</Link> and <Link to="/privacy" className="text-white hover:text-[#84d7b2] transition-colors underline decoration-white/30">Privacy Policy</Link>.
                            </p>
                        </div>

                        <button 
                            onClick={submitCred} 
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-[#004e36] to-[#00a878] text-white py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(132,215,178,0.4)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center h-14"
                        >
                            {processing ? <Loader2 size={24} className="animate-spin text-white" /> : "Create Account"}
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-white/60">
                            Already have an account? <a onClick={() => navigate('/signin')} className="text-white font-bold hover:text-[#84d7b2] transition-colors cursor-pointer ml-1">Sign In</a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SignUp;
