import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { Globe, Lock, Code2, Database, Shield, Zap, Terminal, CheckCircle2, XCircle, MessageSquare, Server, ShoppingCart, Bot, Gamepad2, ChevronDown, ChevronUp, Star } from 'lucide-react';


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
          <meshPhysicalMaterial 
            color="#84d7b2" 
            transparent 
            opacity={0.8} 
            roughness={0.1} 
            transmission={0.9} 
            thickness={1} 
            emissive="#004e36" 
            emissiveIntensity={0.2}
          />
        </Box>
      </Float>
      <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
        <Box args={[1.2, 1.2, 1.2]} position={[1.5, -0.5, 1]}>
          <meshPhysicalMaterial 
            color="#00a878" 
            transparent 
            opacity={0.6} 
            roughness={0.2} 
            transmission={0.8}
            emissive="#004e36" 
            emissiveIntensity={0.5}
          />
        </Box>
      </Float>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={3}>
        <Sphere args={[0.8, 32, 32]} position={[0, 1.5, -1]}>
          <MeshDistortMaterial 
            color="#3eb4ff" 
            attach="material" 
            distort={0.4} 
            speed={2} 
            roughness={0.1} 
            transparent 
            opacity={0.9}
            emissive="#004367"
            emissiveIntensity={0.8}
          />
        </Sphere>
      </Float>
    </group>
  );
};


const GlassCard = ({ children, className = '', style = {} }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-3xl ${className}`}
      style={style}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(132,215,178,0.15), transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// --- FAQ Component ---
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-[#84d7b2] transition-colors"
      >
        <span className="text-lg font-bold">{question}</span>
        {isOpen ? <ChevronUp size={20} className="text-[#84d7b2]" /> : <ChevronDown size={20} className="text-white/40" />}
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-white/60 leading-relaxed pr-8">{answer}</p>
      </motion.div>
    </div>
  );
};


const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="w-full min-h-screen bg-[#0A0F0D] text-white selection:bg-[#004e36] selection:text-white font-body overflow-x-hidden relative z-0">
      
      {}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -100, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-[#004e36]/30 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 -right-1/4 w-[600px] h-[600px] bg-[#006496]/20 rounded-full blur-[100px]" 
        />
      </div>

      {}
      <header className="fixed top-0 w-full z-50 bg-[#0A0F0D]/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#84d7b2] to-[#3eb4ff]">
            TilBase
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <a href="#how-it-works" className="text-white/70 hover:text-white transition-colors">How it Works</a>
            <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
            <a href="#chatbase" className="text-white/70 hover:text-white transition-colors">ChatBase</a>
            <a href="#pricing" className="text-white/70 hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex gap-4">
            <button onClick={() => navigate('/signIn')} className="text-white/80 hover:text-white font-medium text-sm transition-colors">
              Log In
            </button>
            <button onClick={() => navigate('/signup')} className="bg-[#84d7b2] text-[#0A0F0D] px-5 py-2 rounded-lg font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(132,215,178,0.4)]">
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {}
      <section className="relative pt-40 pb-20 lg:pt-52 lg:pb-20 px-6 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center min-h-[90vh]">
        <div className="lg:w-1/2 z-10 mt-12 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84d7b2] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00a878]"></span>
              </span>
              <span className="text-sm font-semibold tracking-widest text-[#84d7b2] uppercase">v2.0 Now Live</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              The Database <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#84d7b2] via-[#00a878] to-[#3eb4ff]">
                Built for the Future
              </span>
            </h1>
            
            <p className="text-xl text-white/60 mb-10 max-w-lg leading-relaxed">
              Scale globally, secure instantly. TilBase is the ultimate DBaaS and ChatBase platform for modern developers creating next-gen applications.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('/signup')} className="group relative bg-[#004e36] text-white px-8 py-4 rounded-xl font-bold text-lg overflow-hidden transition-all shadow-[0_0_30px_rgba(0,78,54,0.5)]">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span className="relative">Start Building for Free</span>
              </button>
              <button className="bg-white/5 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2">
                <Terminal size={20} /> View Documentation
              </button>
            </div>
          </motion.div>
        </div>
        
        <div className="lg:w-1/2 w-full h-[400px] lg:h-[600px] relative z-10">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3eb4ff" />
            <FloatingNodes />
          </Canvas>
        </div>
      </section>

      {}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Unrivaled Architecture</h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">Everything you need to build at hyperscale, seamlessly integrated into a single platform.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
          
          {}
          <GlassCard className="md:col-span-8 p-10 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#004e36]/30 flex items-center justify-center mb-6 border border-[#84d7b2]/20">
                <Globe className="text-[#84d7b2]" size={28} />
              </div>
              <h3 className="text-3xl font-bold mb-4">Global Sharded Clusters</h3>
              <p className="text-white/60 text-lg max-w-md">Distribute data across continents with sub-millisecond coordination. No configuration, just instantaneous planetary scale.</p>
            </div>
            {}
            <div className="absolute right-0 bottom-0 w-2/3 h-2/3 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#006496]/40 to-transparent blur-2xl rounded-tl-full"></div>
          </GlassCard>

          {}
          <GlassCard className="md:col-span-4 p-10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#3eb4ff]/20 flex items-center justify-center mb-6 border border-[#3eb4ff]/20">
                <Code2 className="text-[#3eb4ff]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant GraphQL & REST APIs</h3>
            </div>
            <div className="bg-[#0A0F0D] rounded-xl p-4 font-mono text-sm text-[#84d7b2] border border-white/10 shadow-inner">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
              >_</motion.span> POST /api/v2/clusters
            </div>
          </GlassCard>

          {}
          <GlassCard className="md:col-span-4 p-10 flex flex-col justify-between group">
            <div className="absolute right-10 top-10 text-white/5 group-hover:text-white/10 transition-colors">
              <Lock size={120} />
            </div>
            <div className="relative z-10 mt-auto">
              <h3 className="text-xl font-bold mb-3">Military-Grade Security</h3>
              <p className="text-white/60 text-sm">Hardware-level AES-256 encryption at rest and in transit.</p>
            </div>
          </GlassCard>

          {}
          <GlassCard className="md:col-span-8 p-10 flex items-center justify-between overflow-hidden">
            <div className="max-w-sm z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/20">
                <Database className="text-white" size={24} />
              </div>
              <h3 className="text-3xl font-bold mb-4">Native ChatBase Integrations</h3>
              <p className="text-white/60 text-lg">Build AI-powered chatbots directly on top of your live database schemas with zero middleware.</p>
            </div>
            {}
            <div className="hidden md:block w-72 h-80 bg-white/5 rounded-2xl border border-white/10 p-4 transform rotate-12 translate-x-10 shadow-2xl backdrop-blur-md">
              <div className="w-full h-8 rounded-lg bg-white/10 mb-4 flex items-center px-3 gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-[#84d7b2]"></div>
              </div>
              <div className="space-y-3">
                <div className="h-10 w-3/4 bg-white/10 rounded-lg"></div>
                <div className="h-10 w-1/2 bg-[#004e36]/50 rounded-lg ml-auto"></div>
                <div className="h-10 w-full bg-white/10 rounded-lg"></div>
              </div>
            </div>
          </GlassCard>

        </div>
      </section>

      {}
      <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center mb-24">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">From Code to Global Edge in Seconds</h2>
          <p className="text-xl text-white/60">A seamless flow designed to get out of your way.</p>
        </div>
        <div className="relative">
          {}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-[#004e36] via-[#84d7b2] to-[#3eb4ff]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {[
              { step: "01", title: "Deploy", desc: "Connect via our lightweight SDK. Define your schemas using native TypeScript models.", icon: <Code2 size={32} /> },
              { step: "02", title: "Sync", desc: "Data instantly replicates across 35+ global edge nodes. Zero configuration required.", icon: <Server size={32} /> },
              { step: "03", title: "Chat", desc: "Native ChatBase models ingest the data in real-time. Ready to answer user queries.", icon: <MessageSquare size={32} /> }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="w-20 h-20 mx-auto bg-[#0A0F0D] border-2 border-[#84d7b2]/30 rounded-2xl flex items-center justify-center mb-6 text-[#84d7b2] shadow-[0_0_30px_rgba(132,215,178,0.2)] group-hover:border-[#84d7b2] transition-colors relative z-10">
                  {item.icon}
                </div>
                <div className="text-center bg-[#0A0F0D] p-8 rounded-3xl border border-white/10 shadow-xl">
                  <div className="text-[#3eb4ff] font-mono text-sm font-bold mb-4 tracking-widest">STEP {item.step}</div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-white/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section id="performance" className="py-32 bg-[#0A0F0D] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">Performance that defies physics.</h2>
            <p className="text-xl text-white/60 mb-10 leading-relaxed">
              Our holographic routing engine ensures your queries hit the closest edge node globally. Experience average ping times of <span className="text-[#84d7b2] font-bold">&lt; 50ms</span> anywhere on Earth.
            </p>
            <div className="flex gap-8">
              <div>
                <div className="text-5xl font-bold text-[#84d7b2] mb-2">99.999%</div>
                <div className="text-white/50 tracking-wider text-sm uppercase">Uptime SLA</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-[#3eb4ff] mb-2">&lt; 10ms</div>
                <div className="text-white/50 tracking-wider text-sm uppercase">Read Latency</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[400px]"
          >
            {}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <GlassCard className="absolute top-0 right-10 w-3/4 h-64 p-6 rotate-3">
              <div className="h-4 w-1/3 bg-[#84d7b2]/30 rounded mb-6"></div>
              <div className="flex items-end gap-2 h-32">
                {[40, 70, 45, 90, 60, 100, 80, 50, 75].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="w-full bg-gradient-to-t from-[#004e36] to-[#84d7b2] rounded-t-sm"
                  />
                ))}
              </div>
            </GlassCard>
            <GlassCard className="absolute bottom-0 left-0 w-2/3 h-48 p-6 -rotate-6 bg-[#004367]/10 border-[#3eb4ff]/20">
              <div className="h-4 w-1/2 bg-[#3eb4ff]/30 rounded mb-4"></div>
              <div className="space-y-3 mt-8">
                <div className="h-2 w-full bg-white/10 rounded">
                  <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-[#3eb4ff] rounded"></motion.div>
                </div>
                <div className="h-2 w-full bg-white/10 rounded">
                  <motion.div animate={{ width: ['0%', '70%'] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-full bg-[#84d7b2] rounded"></motion.div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {}
      <section id="chatbase" className="py-32 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3eb4ff]/10 border border-[#3eb4ff]/20 mb-6">
              <Bot size={16} className="text-[#3eb4ff]" />
              <span className="text-sm font-bold tracking-widest text-[#3eb4ff] uppercase">Native AI Integration</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Your data, instantly conversational.</h2>
            <p className="text-xl text-white/60 mb-8 leading-relaxed">
              Stop building fragile ETL pipelines just to sync data to a vector database. TilBase auto-vectorizes your NoSQL/SQL data at the edge.
            </p>
            <ul className="space-y-4 mb-10 text-white/80">
              <li className="flex gap-4 items-start"><CheckCircle2 className="text-[#84d7b2] shrink-0 mt-1" /> <span><strong>Zero-ETL RAG:</strong> Real-time Retrieval-Augmented Generation out of the box.</span></li>
              <li className="flex gap-4 items-start"><CheckCircle2 className="text-[#84d7b2] shrink-0 mt-1" /> <span><strong>Context-Aware:</strong> The AI understands your schema and user permissions automatically.</span></li>
              <li className="flex gap-4 items-start"><CheckCircle2 className="text-[#84d7b2] shrink-0 mt-1" /> <span><strong>Drop-in UI:</strong> Add our highly customizable chat widget in 3 lines of code.</span></li>
            </ul>
          </div>
          <div className="lg:w-1/2 w-full">
            <GlassCard className="p-4 bg-gradient-to-br from-white/10 to-transparent">
              <div className="bg-[#0A0F0D] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3 bg-white/5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3eb4ff] to-[#84d7b2] flex items-center justify-center"><Bot size={16} color="white" /></div>
                  <div>
                    <div className="font-bold text-sm">TilBase AI Assistant</div>
                    <div className="text-xs text-[#84d7b2]">Online • Connected to cluster_production</div>
                  </div>
                </div>
                <div className="p-6 space-y-6 h-80 overflow-y-auto">
                  <div className="flex gap-4 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-white/10 shrink-0"></div>
                    <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none text-sm text-white/80">How many users signed up from the EU region today?</div>
                  </div>
                  <div className="flex gap-4 max-w-[85%] ml-auto flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3eb4ff] to-[#84d7b2] shrink-0 flex items-center justify-center"><Bot size={14} color="white" /></div>
                    <div className="bg-[#004e36]/30 border border-[#84d7b2]/20 p-4 rounded-2xl rounded-tr-none text-sm text-white/90 shadow-[0_0_20px_rgba(0,78,54,0.3)]">
                      <p className="mb-3">I found <strong>1,423</strong> new signups from the EU region today.</p>
                      <div className="bg-black/40 p-2 rounded text-xs font-mono text-[#84d7b2]">SELECT count(*) FROM users WHERE region='EU' AND created_at {'>'} TODAY();</div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {}
      <section id="developers" className="py-32 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Code Meets UI</h2>
          <p className="text-xl text-white/60">Connect in seconds using the Node SDK. See changes instantly.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-0 lg:h-[500px] bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          {}
          <div className="lg:w-1/2 p-8 bg-[#0a0a0a] border-r border-white/10 relative">
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <pre className="text-sm font-mono leading-loose text-white/80 overflow-x-auto">
              <code>
                <span className="text-[#ff7b72]">import</span> &#123; TilBase &#125; <span className="text-[#ff7b72]">from</span> <span className="text-[#a5d6ff]">'tilbase-node'</span>;<br/><br/>
                <span className="text-[#ff7b72]">const</span> db = <span className="text-[#ff7b72]">new</span> <span className="text-[#d2a8ff]">TilBase</span>(&#123;<br/>
                &nbsp;&nbsp;clusterKey: <span className="text-[#a5d6ff]">process.env.CLUSTER_KEY</span>,<br/>
                &nbsp;&nbsp;dbUser: <span className="text-[#a5d6ff]">'admin'</span>,<br/>
                &nbsp;&nbsp;dbPassword: <span className="text-[#a5d6ff]">process.env.DB_PASSWORD</span>,<br/>
                &nbsp;&nbsp;clusterType: <span className="text-[#a5d6ff]">'Document'</span><br/>
                &#125;);<br/><br/>
                <span className="text-[#8b949e]"></span><br/>
                <span className="text-[#ff7b72]">await</span> db.<span className="text-[#d2a8ff]">connect</span>();<br/>
                <span className="text-[#79c0ff]">console</span>.<span className="text-[#d2a8ff]">log</span>(<span className="text-[#a5d6ff]">'Connected via DBAuth 🚀'</span>);
              </code>
            </pre>
          </div>
          
          {}
          <div className="lg:w-1/2 p-12 bg-gradient-to-br from-[#004e36]/10 to-[#004367]/10 flex flex-col justify-center items-center relative overflow-hidden">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-black"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#84d7b2] flex items-center justify-center text-white font-bold text-xl">🚀</div>
                <div>
                  <h4 className="font-bold text-lg">Cluster Active</h4>
                  <p className="text-gray-500 text-sm">prj_xg902 • eu-west-1</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div animate={{ width: '100%' }} transition={{ duration: 2, ease: "easeOut" }} className="h-full bg-[#00a878]"></motion.div>
                </div>
                <p className="text-xs text-center text-gray-400 font-medium tracking-wider">SYNCING DATA...</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {}
      <section className="py-32 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Built for Modern Architectures</h2>
          <p className="text-xl text-white/60">If it needs to be fast and smart, it belongs on TilBase.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Bot size={24} />, title: "AI Startups", desc: "Train your models on live data. Stop building complex ETL pipelines just to feed a vector database. Everything is native." },
            { icon: <Gamepad2 size={24} />, title: "Real-time Gaming", desc: "Keep game state perfectly synchronized across 35+ edge regions with sub-10ms latency. Say goodbye to lag." },
            { icon: <ShoppingCart size={24} />, title: "Global E-commerce", desc: "Never lose a cart. Our multi-region active-active architecture ensures 99.999% uptime during your biggest sales." }
          ].map((uc, i) => (
            <GlassCard key={i} className="p-8 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 text-[#84d7b2] border border-[#84d7b2]/20">
                {uc.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{uc.title}</h3>
              <p className="text-white/60 leading-relaxed">{uc.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {}
      <section className="py-32 px-6 max-w-5xl mx-auto border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">How We Compare</h2>
          <p className="text-xl text-white/60">Why leading teams are migrating to TilBase.</p>
        </div>
        <GlassCard className="overflow-x-auto p-1">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-6 font-bold text-lg text-white/50 w-1/4">Feature</th>
                <th className="p-6 font-black text-2xl text-[#84d7b2] w-1/4 bg-[#004e36]/10 rounded-t-xl border-x border-t border-[#84d7b2]/20 shadow-[0_-10px_20px_rgba(0,78,54,0.3)]">TilBase</th>
                <th className="p-6 font-bold text-lg w-1/4 text-center">Firebase</th>
                <th className="p-6 font-bold text-lg w-1/4 text-center">Supabase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { feature: "6-in-1 DB Types (Document, Graph, etc.)", tb: true, fb: false, sb: false },
                { feature: "Native ChatBase Clusters", tb: true, fb: false, sb: false },
                { feature: "Automatic Event History/Audit Trails", tb: true, fb: false, sb: false },
                { feature: "Strict Native RBAC (dbUser + dbPassword)", tb: true, fb: true, sb: true },
                { feature: "Open Source Compatible", tb: true, fb: false, sb: true },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="p-6 text-white/80 font-medium">{row.feature}</td>
                  <td className="p-6 bg-[#004e36]/10 border-x border-[#84d7b2]/20 group-last:rounded-b-xl group-last:border-b">
                    <CheckCircle2 className="text-[#84d7b2] mx-auto" />
                  </td>
                  <td className="p-6 text-center">
                    {row.fb ? <CheckCircle2 className="text-white/50 mx-auto" /> : <XCircle className="text-white/20 mx-auto" />}
                  </td>
                  <td className="p-6 text-center">
                    {row.sb ? <CheckCircle2 className="text-white/50 mx-auto" /> : <XCircle className="text-white/20 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </section>

      {}
      <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Simple, Scalable Pricing</h2>
          <p className="text-xl text-white/60">Start free. Pay as you scale globally.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {}
          <GlassCard className="p-8 pb-12">
            <h3 className="text-xl font-medium text-white/80 mb-2">Starter</h3>
            <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-white/50 font-medium">/mo</span></div>
            <p className="text-white/60 text-sm mb-8">For personal projects and hackathons.</p>
            <ul className="space-y-4 mb-10 text-sm">
              <li className="flex gap-3 items-center"><Shield size={16} className="text-[#84d7b2]" /> 1 Database Cluster</li>
              <li className="flex gap-3 items-center"><Shield size={16} className="text-[#84d7b2]" /> Basic Role-Based Access</li>
              <li className="flex gap-3 items-center"><Shield size={16} className="text-[#84d7b2]" /> Shared Infrastructure</li>
            </ul>
            <button className="w-full py-3 rounded-xl border border-white/20 font-bold hover:bg-white/5 transition-colors">Start Free</button>
          </GlassCard>

          {}
          <GlassCard className="p-10 pb-12 transform md:scale-105 border-[#84d7b2]/50 shadow-[0_0_50px_rgba(0,78,54,0.3)] relative">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#3eb4ff] via-[#84d7b2] to-[#3eb4ff]"></div>
            <div className="absolute -top-4 right-8 bg-[#84d7b2] text-[#0A0F0D] text-xs font-bold px-3 py-1 rounded-full">RECOMMENDED</div>
            
            <h3 className="text-2xl font-bold text-[#84d7b2] mb-2">Standard</h3>
            <div className="text-5xl font-bold mb-6">$49<span className="text-xl text-white/50 font-medium">/mo</span></div>
            <p className="text-white/60 text-sm mb-8">For production apps and growing teams.</p>
            <ul className="space-y-4 mb-10 text-sm">
              <li className="flex gap-3 items-center"><Zap size={18} className="text-[#84d7b2]" /> Multiple Cluster Types</li>
              <li className="flex gap-3 items-center"><Zap size={18} className="text-[#84d7b2]" /> Comprehensive Project History</li>
              <li className="flex gap-3 items-center"><Zap size={18} className="text-[#84d7b2]" /> Native ChatBase Access</li>
              <li className="flex gap-3 items-center"><Zap size={18} className="text-[#84d7b2]" /> Daily Backups</li>
            </ul>
            <button onClick={() => navigate('/signup')} className="w-full py-4 rounded-xl bg-gradient-to-r from-[#004e36] to-[#00a878] font-bold text-lg hover:shadow-[0_0_20px_rgba(132,215,178,0.4)] transition-all">Get Standard</button>
          </GlassCard>

          {}
          <GlassCard className="p-8 pb-12">
            <h3 className="text-xl font-medium text-white/80 mb-2">Premium</h3>
            <div className="text-4xl font-bold mb-6">$199<span className="text-lg text-white/50 font-medium">/mo</span></div>
            <p className="text-white/60 text-sm mb-8">For mission-critical infrastructure.</p>
            <ul className="space-y-4 mb-10 text-sm">
              <li className="flex gap-3 items-center"><Globe size={16} className="text-[#3eb4ff]" /> Unlimited Database Types</li>
              <li className="flex gap-3 items-center"><Globe size={16} className="text-[#3eb4ff]" /> Advanced Analytics</li>
              <li className="flex gap-3 items-center"><Globe size={16} className="text-[#3eb4ff]" /> 24/7 Priority Support</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-white/10 font-bold hover:bg-white/20 transition-colors">Contact Sales</button>
          </GlassCard>
        </div>
      </section>

      {}
      <section className="py-32 px-6 max-w-4xl mx-auto border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
        </div>
        <GlassCard className="p-8">
          <FAQItem 
            question="What types of databases can I build?" 
            answer="TilBase supports 6 distinct cluster types out-of-the-box: Document, Vector DB, Realtime, Flat, Graph, and our native ChatBase. Operations are strictly isolated and routed by their specific Cluster_Type."
          />
          <FAQItem 
            question="How is authentication handled in the Node SDK?" 
            answer="Instead of a generic cluster password, the Node module authenticates via specific Database_Users credentials (dbUser, dbPassword) coupled with the clusterKey. This enables strict Role-Based Access Control (RBAC) on the client side."
          />
          <FAQItem 
            question="Can I monitor cluster lifecycle events?" 
            answer="Absolutely. Our Project_History table acts as the ultimate source of truth. Every action—like cluster creation, pausing, resuming, or deleting—instantly triggers an audit log so your history feed is perfectly accurate."
          />
          <FAQItem 
            question="What happens if I pause a cluster?" 
            answer="If a cluster's Current_State is set to paused, the backend authentication (DBAuth.js) immediately and completely rejects connections with a 403 Forbidden error until the state is marked as active again."
          />
        </GlassCard>
      </section>

      {}
      <footer className="relative mt-20 pt-32 pb-10 overflow-hidden">
        {}
        <div className="absolute inset-0 z-[-1]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#004e36]/60 via-[#0A0F0D] to-[#0A0F0D]"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#3eb4ff]/30 to-transparent blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl lg:text-7xl font-bold mb-8">Ready to Scale?</h2>
            <div className="flex flex-col sm:flex-row justify-center max-w-lg mx-auto gap-3">
              <input type="email" placeholder="Enter your email" className="bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-[#84d7b2] flex-1 backdrop-blur-md" />
              <button className="bg-white text-black px-8 py-4 rounded-xl font-bold whitespace-nowrap hover:bg-gray-200 transition-colors">Start Free</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-t border-white/10 pt-16 text-sm">
            <div>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-3 text-white/60">
                <li><a href="#" className="hover:text-[#84d7b2]">Database</a></li>
                <li><a href="#" className="hover:text-[#84d7b2]">ChatBase</a></li>
                <li><a href="#" className="hover:text-[#84d7b2]">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Resources</h4>
              <ul className="space-y-3 text-white/60">
                <li><a href="#" className="hover:text-[#84d7b2]">Documentation</a></li>
                <li><a href="#" className="hover:text-[#84d7b2]">API Reference</a></li>
                <li><a href="#" className="hover:text-[#84d7b2]">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-white/60">
                <li><a href="#" className="hover:text-[#84d7b2]">About Us</a></li>
                <li><a href="#" className="hover:text-[#84d7b2]">Careers</a></li>
                <li><a href="#" className="hover:text-[#84d7b2]">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-3 text-white/60">
                <li><a href="/privacy" className="hover:text-[#84d7b2]">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-[#84d7b2]">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-white/40 text-xs">
            <p>&copy; 2026 TilBase Architectural Ledger. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">GitHub</a>
              <a href="#" className="hover:text-white">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
